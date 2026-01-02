const db = require('../config/database');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const { vehicle_id, start_date, end_date } = req.body;
    const user_id = req.user.user_id;

    // Validation
    if (!vehicle_id || !start_date || !end_date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date cannot be in the past' 
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date must be after start date' 
      });
    }

    // Check if vehicle exists and is available
    const [vehicles] = await db.query(
      'SELECT * FROM vehicles WHERE vehicle_id = ?',
      [vehicle_id]
    );

    if (vehicles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    const vehicle = vehicles[0];

    if (vehicle.status !== 'available') {
      return res.status(400).json({ 
        success: false, 
        message: `Vehicle is currently ${vehicle.status}` 
      });
    }

    // Check for overlapping bookings (prevent double booking)
    const [overlappingBookings] = await db.query(
      `SELECT * FROM bookings 
       WHERE vehicle_id = ? 
       AND booking_status = 'active'
       AND NOT (end_date < ? OR start_date > ?)`,
      [vehicle_id, start_date, end_date]
    );

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vehicle is already booked for the selected dates' 
      });
    }

    // Calculate total days and amount
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * parseFloat(vehicle.rent_per_day);

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Create booking
      const [bookingResult] = await connection.query(
        `INSERT INTO bookings 
        (user_id, vehicle_id, start_date, end_date, total_days, rent_per_day, total_amount, booking_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, vehicle_id, start_date, end_date, totalDays, vehicle.rent_per_day, totalAmount, 'active']
      );

      // Update vehicle status to booked
      await connection.query(
        'UPDATE vehicles SET status = ? WHERE vehicle_id = ?',
        ['booked', vehicle_id]
      );

      await connection.commit();
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking: {
          booking_id: bookingResult.insertId,
          vehicle_name: vehicle.vehicle_name,
          start_date,
          end_date,
          total_days: totalDays,
          total_amount: totalAmount
        }
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during booking' 
    });
  }
};

// Get all bookings (Admin) or user bookings (Customer)
exports.getAllBookings = async (req, res) => {
  try {
    let query = `
      SELECT 
        b.booking_id,
        b.start_date,
        b.end_date,
        b.total_days,
        b.total_amount,
        b.booking_status,
        b.booking_date,
        b.return_date,
        u.user_id,
        u.full_name,
        u.email,
        u.phone,
        v.vehicle_id,
        v.vehicle_name,
        v.vehicle_type,
        v.brand,
        v.model,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
    `;

    const params = [];

    // If customer, only show their bookings
    if (req.user.role === 'customer') {
      query += ' WHERE b.user_id = ?';
      params.push(req.user.user_id);
    }

    query += ' ORDER BY b.booking_date DESC';

    const [bookings] = await db.query(query, params);

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const [bookings] = await db.query(
      `SELECT 
        b.*,
        u.full_name,
        u.email,
        u.phone,
        v.vehicle_name,
        v.vehicle_type,
        v.brand,
        v.model,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN vehicles v ON b.vehicle_id = v.vehicle_id
      WHERE b.booking_id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    const booking = bookings[0];

    // Check authorization (customer can only see their own bookings)
    if (req.user.role === 'customer' && booking.user_id !== req.user.user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Return vehicle (Complete booking)
exports.returnVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Get booking details
    const [bookings] = await db.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    const booking = bookings[0];

    // Check authorization
    if (req.user.role === 'customer' && booking.user_id !== req.user.user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    if (booking.booking_status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking is not active' 
      });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update booking status
      await connection.query(
        'UPDATE bookings SET booking_status = ?, return_date = NOW() WHERE booking_id = ?',
        ['completed', id]
      );

      // Update vehicle status to available
      await connection.query(
        'UPDATE vehicles SET status = ? WHERE vehicle_id = ?',
        ['available', booking.vehicle_id]
      );

      await connection.commit();
      connection.release();

      res.status(200).json({
        success: true,
        message: 'Vehicle returned successfully'
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Return vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Get booking details
    const [bookings] = await db.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    const booking = bookings[0];

    // Check authorization
    if (req.user.role === 'customer' && booking.user_id !== req.user.user_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    if (booking.booking_status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking is not active' 
      });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update booking status
      await connection.query(
        'UPDATE bookings SET booking_status = ? WHERE booking_id = ?',
        ['cancelled', id]
      );

      // Update vehicle status to available
      await connection.query(
        'UPDATE vehicles SET status = ? WHERE vehicle_id = ?',
        ['available', booking.vehicle_id]
      );

      await connection.commit();
      connection.release();

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully'
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
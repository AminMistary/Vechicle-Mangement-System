const db = require('../config/database');

// Get all vehicles (with optional filters)
exports.getAllVehicles = async (req, res) => {
  try {
    const { status, vehicle_type } = req.query;
    
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (vehicle_type) {
      query += ' AND vehicle_type = ?';
      params.push(vehicle_type);
    }

    query += ' ORDER BY created_at DESC';

    const [vehicles] = await db.query(query, params);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles
    });

  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get single vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const [vehicles] = await db.query(
      'SELECT * FROM vehicles WHERE vehicle_id = ?',
      [id]
    );

    if (vehicles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json({
      success: true,
      vehicle: vehicles[0]
    });

  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Add new vehicle (Admin only)
exports.addVehicle = async (req, res) => {
  try {
    const {
      vehicle_name,
      vehicle_type,
      registration_number,
      brand,
      model,
      year,
      seating_capacity,
      rent_per_day,
      image_url,
      features
    } = req.body;

    // Validation
    if (!vehicle_name || !vehicle_type || !registration_number || !brand || !model || !year || !seating_capacity || !rent_per_day) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if registration number already exists
    const [existing] = await db.query(
      'SELECT * FROM vehicles WHERE registration_number = ?',
      [registration_number]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Registration number already exists' 
      });
    }

    // Insert vehicle
    const [result] = await db.query(
      `INSERT INTO vehicles 
      (vehicle_name, vehicle_type, registration_number, brand, model, year, seating_capacity, rent_per_day, image_url, features) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [vehicle_name, vehicle_type, registration_number, brand, model, year, seating_capacity, rent_per_day, image_url || null, features || null]
    );

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle_id: result.insertId
    });

  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update vehicle (Admin only)
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if vehicle exists
    const [vehicles] = await db.query(
      'SELECT * FROM vehicles WHERE vehicle_id = ?',
      [id]
    );

    if (vehicles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    // Build update query dynamically
    const allowedFields = [
      'vehicle_name', 'vehicle_type', 'registration_number', 'brand', 
      'model', 'year', 'seating_capacity', 'rent_per_day', 'status', 
      'image_url', 'features'
    ];

    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid fields to update' 
      });
    }

    updateValues.push(id);

    await db.query(
      `UPDATE vehicles SET ${updateFields.join(', ')} WHERE vehicle_id = ?`,
      updateValues
    );

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully'
    });

  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Delete vehicle (Admin only)
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle has active bookings
    const [activeBookings] = await db.query(
      'SELECT * FROM bookings WHERE vehicle_id = ? AND booking_status = ?',
      [id, 'active']
    );

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete vehicle with active bookings' 
      });
    }

    const [result] = await db.query(
      'DELETE FROM vehicles WHERE vehicle_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully'
    });

  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update vehicle status (Admin only)
exports.updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'booked', 'maintenance'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }

    const [result] = await db.query(
      'UPDATE vehicles SET status = ? WHERE vehicle_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vehicle not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle status updated successfully'
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
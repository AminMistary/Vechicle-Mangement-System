const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');

// Import middleware
const { verifyToken, isAdmin } = require('../middleware/auth');

// ==================== AUTH ROUTES ====================
// Public routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Protected routes
router.get('/auth/profile', verifyToken, authController.getProfile);

// ==================== VEHICLE ROUTES ====================
// Public routes (anyone can view vehicles)
router.get('/vehicles', vehicleController.getAllVehicles);
router.get('/vehicles/:id', vehicleController.getVehicleById);

// Admin only routes
router.post('/vehicles', verifyToken, isAdmin, vehicleController.addVehicle);
router.put('/vehicles/:id', verifyToken, isAdmin, vehicleController.updateVehicle);
router.delete('/vehicles/:id', verifyToken, isAdmin, vehicleController.deleteVehicle);
router.patch('/vehicles/:id/status', verifyToken, isAdmin, vehicleController.updateVehicleStatus);

// ==================== BOOKING ROUTES ====================
// Customer routes
router.post('/bookings', verifyToken, bookingController.createBooking);
router.get('/bookings', verifyToken, bookingController.getAllBookings);
router.get('/bookings/:id', verifyToken, bookingController.getBookingById);
router.patch('/bookings/:id/return', verifyToken, bookingController.returnVehicle);
router.patch('/bookings/:id/cancel', verifyToken, bookingController.cancelBooking);

module.exports = router;
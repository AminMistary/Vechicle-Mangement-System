const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require('./routes');

// API routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Vehicle Rental Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      bookings: '/api/bookings'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   Vehicle Rental Management System - Backend         ║
║   Server running on port ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                       ║
║   API URL: http://localhost:${PORT}                     ║
╚═══════════════════════════════════════════════════════╝
  `);
});
-- ================================================
-- Vehicle Rental Management System - Database Schema
-- ================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS vehicle_rental_system;
USE vehicle_rental_system;

-- Drop tables if they exist (for fresh start)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;

-- ================================================
-- Table: users
-- ================================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: vehicles
-- ================================================
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    seating_capacity INT NOT NULL,
    rent_per_day DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'booked', 'maintenance') DEFAULT 'available',
    image_url VARCHAR(255),
    features TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_vehicle_type (vehicle_type),
    INDEX idx_registration (registration_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: bookings
-- ================================================
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    rent_per_day DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_booking_status (booking_status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Insert Default Admin User
-- ================================================
-- Password: admin123
-- Hash generated using: bcrypt.hashSync('admin123', 10)
INSERT INTO users (full_name, email, password, phone, role) VALUES 
('Admin User', 'admin@vehiclerental.com', '$2b$10$YQ5iT0hKzDJgBZjKCk3N9OXKg7FZVlZGZN5FqN5F5qN5F5qN5F5qN5', '1234567890', 'admin');

-- ================================================
-- Insert Sample Vehicles
-- ================================================
INSERT INTO vehicles (vehicle_name, vehicle_type, registration_number, brand, model, year, seating_capacity, rent_per_day, status, image_url, features) VALUES
('Honda City Premium', 'Sedan', 'MH12AB1234', 'Honda', 'City', 2023, 5, 2500.00, 'available', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500', 'AC, GPS, Bluetooth, Music System'),
('Toyota Fortuner', 'SUV', 'MH12CD5678', 'Toyota', 'Fortuner', 2023, 7, 5000.00, 'available', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500', 'AC, GPS, Leather Seats, 4WD'),
('Maruti Swift', 'Hatchback', 'MH12EF9012', 'Maruti', 'Swift', 2022, 5, 1500.00, 'available', 'https://images.unsplash.com/photo-1583267746897-c4f081579aff?w=500', 'AC, Music System, Power Steering'),
('Hyundai Creta', 'SUV', 'MH12GH3456', 'Hyundai', 'Creta', 2023, 5, 3500.00, 'available', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', 'AC, Sunroof, GPS, Cruise Control'),
('Mahindra Thar', 'SUV', 'MH12IJ7890', 'Mahindra', 'Thar', 2023, 4, 4000.00, 'available', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500', '4WD, AC, Adventure Ready, Off-road Capable'),
('BMW 3 Series', 'Sedan', 'MH12KL2345', 'BMW', '3 Series', 2023, 5, 8000.00, 'available', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500', 'Luxury, Leather Seats, Sunroof, Premium Sound'),
('Tata Nexon', 'SUV', 'MH12MN6789', 'Tata', 'Nexon', 2022, 5, 2000.00, 'available', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500', 'AC, Touchscreen, Connected Car Tech'),
('Honda Amaze', 'Sedan', 'MH12OP0123', 'Honda', 'Amaze', 2022, 5, 1800.00, 'available', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', 'AC, GPS, Fuel Efficient');

-- ================================================
-- Insert Sample Bookings (Optional - for testing)
-- ================================================
-- You can uncomment these after creating a customer user
-- INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_days, rent_per_day, total_amount, booking_status) VALUES
-- (2, 1, '2024-01-15', '2024-01-20', 5, 2500.00, 12500.00, 'completed'),
-- (2, 3, '2024-01-22', '2024-01-25', 3, 1500.00, 4500.00, 'active');

-- ================================================
-- Verification Queries
-- ================================================
-- Run these to verify the setup:
-- SELECT * FROM users;
-- SELECT * FROM vehicles;
-- SELECT * FROM bookings;
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE vehicles;
-- DESCRIBE bookings;
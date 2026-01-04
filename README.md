<div align="center">

# 🚗 Vehicle Rental Management System

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&pause=1000&color=2563EB&center=true&vCenter=true&width=800&lines=Welcome+to+Vehicle+Rental+System;Rent+Cars+with+Ease;Modern+Full-Stack+Solution;Built+with+React+%26+Node.js" alt="Typing SVG" />

<br/>

<!-- Animated Status Badge -->
<img src="https://img.shields.io/badge/Status-Under%20Development-yellow?style=for-the-badge&logo=git&logoColor=white&labelColor=FFA500&color=FFD700" />

<!-- Animated Tech Stack Badges -->
<img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-4.22.1-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" />
<img src="https://img.shields.io/badge/Axios-1.13.2-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
<img src="https://img.shields.io/badge/Bcrypt.js-2.4.3-3178C6?style=for-the-badge&logo=bcrypt&logoColor=white" />
<img src="https://img.shields.io/badge/CORS-2.8.5-FF6B35?style=for-the-badge&logo=cors&logoColor=white" />
<img src="https://img.shields.io/badge/React_Router-6.30.2-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
<img src="https://img.shields.io/badge/React_Toastify-9.1.3-FFBB28?style=for-the-badge&logo=react&logoColor=white" />

<br/>

## 🌟 Project Overview

A modern, full-stack vehicle rental management system that allows users to browse, book, and manage vehicle rentals seamlessly. Built with React for the frontend, Node.js and Express for the backend, and MySQL for data storage. Features user authentication, admin dashboard, and responsive design.

### 🎯 Key Highlights
- **User-Friendly Interface**: Intuitive design for easy navigation and booking.
- **Secure Transactions**: JWT-based authentication ensures data security.
- **Admin Control**: Comprehensive dashboard for managing fleet and bookings.
- **Scalable Architecture**: Modular backend with RESTful APIs.

## ✨ Features

- 🔐 **User Authentication**: Secure login and registration with JWT tokens
- 🚗 **Vehicle Management**: Browse and manage a fleet of vehicles with real-time availability
- 📅 **Booking System**: Easy booking with date selection, availability checks, and instant confirmation
- 👨‍💼 **Admin Dashboard**: Comprehensive admin panel for managing vehicles, bookings, and user data
- 📱 **Responsive Design**: Mobile-friendly interface built with Tailwind CSS for all devices
- 🔄 **Real-time Updates**: Dynamic updates for bookings and vehicle status using modern web technologies
- 🛡️ **Secure API**: Protected routes with authentication middleware and input validation
- 📊 **Analytics**: Basic analytics for admins to track rental trends and performance

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.x or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vehicle-rental-system.git
   cd vehicle-rental-system
   ```

2. **Database Setup**
   - Install and start MySQL server
   - Create a new database (e.g., `vehicle_rental`)
   - Run the schema.sql file located in the `database` folder:
     ```bash
     mysql -u your_username -p vehicle_rental < database/schema.sql
     ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file in the backend directory with the following variables:
   # PORT=5000
   # DB_HOST=localhost
   # DB_USER=your_mysql_username
   # DB_PASSWORD=your_mysql_password
   # DB_NAME=vehicle_rental
   # JWT_SECRET=your_jwt_secret_key
   npm run dev
   ```
   The backend server will start on `http://localhost:5000`

4. **Frontend Setup**
   ```bash
   cd ../vehicle-rental-frontend
   npm install
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## 📖 Usage

### For Users:
1. **Register/Login**: Create an account or log in with existing credentials.
2. **Browse Vehicles**: Navigate to the vehicles page to view available cars with details like model, price, and availability.
3. **Book a Vehicle**: Select a vehicle, choose pickup/drop-off dates, and confirm booking.
4. **Manage Bookings**: View your bookings in the "My Bookings" section, where you can cancel or modify if allowed.

### For Admins:
1. **Access Dashboard**: Log in as an admin to access the admin panel.
2. **Manage Vehicles**: Add new vehicles, edit existing ones, or remove them from the fleet.
3. **Handle Bookings**: View all bookings, approve/reject requests, and manage conflicts.
4. **Analytics**: Monitor rental statistics and user activity.

### API Endpoints
- `GET /api/vehicles` - Fetch all vehicles
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:userId` - Get user bookings
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Screenshots
*(Add screenshots here)*
- User Dashboard
- Vehicle Listing
- Booking Form
- Admin Panel

## 🎥 Demo

<!-- Animated Demo GIF -->
<img src="https://via.placeholder.com/800x400?text=Demo+GIF+Coming+Soon" alt="Demo GIF" />

*Watch the demo video to see the system in action: [Demo Video Link](https://example.com/demo)*

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact [Your Name] at your.email@example.com

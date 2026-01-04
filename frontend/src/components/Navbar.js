import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User, LayoutDashboard, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Car size={28} />
            <span>VehicleRental</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="flex items-center space-x-6">
              {isAdmin() ? (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className="flex items-center space-x-1 hover:text-blue-200 transition"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/admin/vehicles" 
                    className="flex items-center space-x-1 hover:text-blue-200 transition"
                  >
                    <Car size={18} />
                    <span>Vehicles</span>
                  </Link>
                  <Link 
                    to="/admin/bookings" 
                    className="flex items-center space-x-1 hover:text-blue-200 transition"
                  >
                    <Calendar size={18} />
                    <span>Bookings</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/vehicles" 
                    className="flex items-center space-x-1 hover:text-blue-200 transition"
                  >
                    <Car size={18} />
                    <span>Vehicles</span>
                  </Link>
                  <Link 
                    to="/my-bookings" 
                    className="flex items-center space-x-1 hover:text-blue-200 transition"
                  >
                    <Calendar size={18} />
                    <span>My Bookings</span>
                  </Link>
                </>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-4 border-l border-blue-500 pl-6">
                <div className="flex items-center space-x-2">
                  <User size={18} />
                  <span className="text-sm">{user.full_name}</span>
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-blue-200 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import api from '../../../vehicle-rental-frontend/src/config/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { Calendar, IndianRupee, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookingId) => {
    if (!window.confirm('Are you sure you want to return this vehicle?')) {
      return;
    }

    try {
      const response = await api.patch(`/bookings/${bookingId}/return`);
      if (response.data.success) {
        toast.success('Vehicle returned successfully');
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return vehicle');
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: Clock },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };

    const badge = badges[status] || badges.active;
    const Icon = badge.icon;

    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1`}>
        <Icon size={16} />
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your vehicle bookings</p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No bookings found</p>
              <p className="text-gray-500 mt-2">Start booking vehicles to see them here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.booking_id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{booking.vehicle_name}</h3>
                          <p className="text-gray-600">{booking.brand} {booking.model} • {booking.registration_number}</p>
                        </div>
                        {getStatusBadge(booking.booking_status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-semibold">{new Date(booking.start_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-semibold">{new Date(booking.end_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Days</p>
                          <p className="font-semibold">{booking.total_days} days</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
                        <IndianRupee size={24} />
                        <span>{parseFloat(booking.total_amount).toFixed(2)}</span>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        Booked on: {new Date(booking.booking_date).toLocaleString()}
                      </p>

                      {booking.return_date && (
                        <p className="text-sm text-gray-500">
                          Returned on: {new Date(booking.return_date).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {booking.booking_status === 'active' && (
                      <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-6">
                        <button
                          onClick={() => handleReturn(booking.booking_id)}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                          Return Vehicle
                        </button>
                        <button
                          onClick={() => handleCancel(booking.booking_id)}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;
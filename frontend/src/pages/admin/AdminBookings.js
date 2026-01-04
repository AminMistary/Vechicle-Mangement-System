import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { Calendar, IndianRupee, User, Car, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: Clock },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };

    const badge = badges[status] || badges.active;
    const Icon = badge.icon;

    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit`}>
        <Icon size={14} />
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.booking_status === filter;
  });

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Bookings</h1>
            <p className="text-gray-600">View and manage all customer bookings</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex space-x-2">
            {['all', 'active', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All Bookings' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Bookings Table */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No bookings found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.booking_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          #{booking.booking_id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <User size={16} className="text-gray-400" />
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{booking.full_name}</div>
                              <div className="text-xs text-gray-600">{booking.email}</div>
                              <div className="text-xs text-gray-600">{booking.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Car size={16} className="text-gray-400" />
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{booking.vehicle_name}</div>
                              <div className="text-xs text-gray-600">{booking.registration_number}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-800">{new Date(booking.start_date).toLocaleDateString()}</div>
                            <div className="text-gray-600">to</div>
                            <div className="text-gray-800">{new Date(booking.end_date).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {booking.total_days} days
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1 text-sm font-semibold text-gray-800">
                            <IndianRupee size={14} />
                            <span>{parseFloat(booking.total_amount).toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.booking_status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.booking_status === 'active').length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.booking_status === 'completed').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.booking_status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBookings;
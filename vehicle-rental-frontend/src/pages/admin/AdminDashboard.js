import React, { useState, useEffect } from 'react';
import api from '../../../../vehicle-rental-frontend/src/config/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { Car, Calendar, Users, IndianRupee, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    bookedVehicles: 0,
    maintenanceVehicles: 0,
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/bookings')
      ]);

      if (vehiclesRes.data.success && bookingsRes.data.success) {
        const vehicles = vehiclesRes.data.vehicles;
        const bookings = bookingsRes.data.bookings;

        // Calculate statistics
        const totalVehicles = vehicles.length;
        const availableVehicles = vehicles.filter(v => v.status === 'available').length;
        const bookedVehicles = vehicles.filter(v => v.status === 'booked').length;
        const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;

        const totalBookings = bookings.length;
        const activeBookings = bookings.filter(b => b.booking_status === 'active').length;
        const completedBookings = bookings.filter(b => b.booking_status === 'completed').length;

        const totalRevenue = bookings
          .filter(b => b.booking_status === 'completed')
          .reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

        setStats({
          totalVehicles,
          availableVehicles,
          bookedVehicles,
          maintenanceVehicles,
          totalBookings,
          activeBookings,
          completedBookings,
          totalRevenue
        });
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
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

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of your vehicle rental business</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Car}
              title="Total Vehicles"
              value={stats.totalVehicles}
              subtitle={`${stats.availableVehicles} available`}
              color="bg-blue-600"
            />
            <StatCard
              icon={Calendar}
              title="Active Bookings"
              value={stats.activeBookings}
              subtitle={`${stats.completedBookings} completed`}
              color="bg-green-600"
            />
            <StatCard
              icon={TrendingUp}
              title="Total Bookings"
              value={stats.totalBookings}
              color="bg-purple-600"
            />
            <StatCard
              icon={IndianRupee}
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toFixed(2)}`}
              subtitle="From completed bookings"
              color="bg-orange-600"
            />
          </div>

          {/* Vehicle Status Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Status Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-green-600">{stats.availableVehicles}</p>
                  </div>
                  <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                    <Car className="text-green-600" size={32} />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Booked</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.bookedVehicles}</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                    <Car className="text-blue-600" size={32} />
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.maintenanceVehicles}</p>
                  </div>
                  <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                    <Car className="text-orange-600" size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => window.location.href = '/admin/vehicles'}
                className="bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <Car size={20} />
                <span>Manage Vehicles</span>
              </button>
              <button
                onClick={() => window.location.href = '/admin/bookings'}
                className="bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2"
              >
                <Calendar size={20} />
                <span>View All Bookings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
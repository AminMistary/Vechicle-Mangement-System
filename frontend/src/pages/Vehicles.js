import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { Car, Users, Calendar, IndianRupee, Filter } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, [filter]);

  const fetchVehicles = async () => {
    try {
      const params = filter !== 'all' ? { status: 'available', vehicle_type: filter } : { status: 'available' };
      const response = await api.get('/vehicles', { params });
      
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (vehicleId) => {
    navigate(`/book/${vehicleId}`);
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Vehicles</h1>
            <p className="text-gray-600">Choose your perfect ride</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex items-center space-x-4">
            <Filter size={20} className="text-gray-600" />
            <div className="flex space-x-2">
              {['all', 'Sedan', 'SUV', 'Hatchback'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type === 'all' ? 'All Vehicles' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicles Grid */}
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No vehicles available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.vehicle_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                  {/* Vehicle Image */}
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={vehicle.image_url || 'https://via.placeholder.com/400x300?text=Vehicle'}
                      alt={vehicle.vehicle_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.vehicle_name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>

                    {/* Features */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Car size={16} />
                        <span>{vehicle.vehicle_type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={16} />
                        <span>{vehicle.seating_capacity} Seats</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-2xl font-bold text-blue-600">
                        <IndianRupee size={24} />
                        <span>{vehicle.rent_per_day}</span>
                      </div>
                      <span className="text-sm text-gray-600">per day</span>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleBookNow(vehicle.vehicle_id)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                    >
                      <Calendar size={18} />
                      <span>Book Now</span>
                    </button>
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

export default Vehicles;
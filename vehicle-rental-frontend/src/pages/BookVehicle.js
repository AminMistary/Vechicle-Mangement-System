import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../vehicle-rental-frontend/src/config/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { Calendar, IndianRupee, AlertCircle } from 'lucide-react';

const BookVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: ''
  });
  const [calculation, setCalculation] = useState({
    days: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  useEffect(() => {
    calculateRent();
  }, [formData, vehicle]);

  const fetchVehicle = async () => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      if (response.data.success) {
        setVehicle(response.data.vehicle);
      }
    } catch (error) {
      toast.error('Failed to fetch vehicle details');
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  };

  const calculateRent = () => {
    if (formData.start_date && formData.end_date && vehicle) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (days > 0) {
        setCalculation({
          days,
          totalAmount: days * parseFloat(vehicle.rent_per_day)
        });
      } else {
        setCalculation({ days: 0, totalAmount: 0 });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (calculation.days <= 0) {
      toast.error('Please select valid dates');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await api.post('/bookings', {
        vehicle_id: parseInt(id),
        start_date: formData.start_date,
        end_date: formData.end_date
      });

      if (response.data.success) {
        toast.success('Booking created successfully!');
        navigate('/my-bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
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

  if (!vehicle) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Vehicle Image */}
            <div className="h-64 bg-gray-200">
              <img
                src={vehicle.image_url || 'https://via.placeholder.com/800x400?text=Vehicle'}
                alt={vehicle.vehicle_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              {/* Vehicle Details */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{vehicle.vehicle_name}</h1>
                <p className="text-gray-600">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
                <div className="mt-4 flex items-center space-x-2 text-2xl font-bold text-blue-600">
                  <IndianRupee size={28} />
                  <span>{vehicle.rent_per_day}</span>
                  <span className="text-sm text-gray-600 font-normal">per day</span>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        min={today}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        min={formData.start_date || today}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Summary */}
                {calculation.days > 0 && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Days:</span>
                        <span className="font-semibold">{calculation.days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate per Day:</span>
                        <span className="font-semibold">₹{vehicle.rent_per_day}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-800 font-bold">Total Amount:</span>
                          <span className="text-blue-600 font-bold">₹{calculation.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning */}
                <div className="flex items-start space-x-2 bg-yellow-50 p-4 rounded-lg">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    Please ensure you have a valid driving license. The vehicle must be returned by the end date to avoid additional charges.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/vehicles')}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading || calculation.days <= 0}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookVehicle;
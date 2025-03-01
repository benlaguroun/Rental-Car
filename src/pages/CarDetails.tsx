import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, DollarSign, Tag, Users, Fuel, Gauge, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(addDays(new Date(), 3), 'yyyy-MM-dd')
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCar(data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    fetchCar();
  }, [id]);

  useEffect(() => {
    if (car && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, differenceInDays(end, start));
      setTotalPrice(car.daily_rate * days);
    }
  }, [car, startDate, endDate]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { redirect: `/cars/${id}` } });
      return;
    }

    if (!car) return;

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          car_id: car.id,
          user_id: user.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: 'pending'
        })
        .select();

      if (error) throw error;
      
      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setBookingError(error.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
        <p className="mb-4">The car you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/cars')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse All Cars
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Car Image */}
          <div className="md:w-1/2">
            <img 
              src={car.image_url} 
              alt={`${car.make} ${car.model}`} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Car Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{car.make} {car.model}</h1>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 mr-1 text-gray-500" />
                  <span className="text-gray-600 mr-4">{car.year}</span>
                  <Tag className="h-5 w-5 mr-1 text-gray-500" />
                  <span className="text-gray-600">{car.category}</span>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {car.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{car.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                <span>5 Seats</span>
              </div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-blue-600" />
                <span>Gasoline</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-5 w-5 mr-2 text-blue-600" />
                <span>Automatic</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2 text-blue-600" />
                <span>Air Conditioning</span>
              </div>
            </div>
            
            <div className="flex items-center text-2xl font-bold text-green-600 mb-6">
              <DollarSign className="h-6 w-6" />
              <span>${car.daily_rate}/day</span>
            </div>
            
            {/* Booking Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Book This Car</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total Price:</span>
                <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              
              {bookingSuccess && (
                <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Booking successful! Redirecting to your bookings...
                </div>
              )}
              
              {bookingError && (
                <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 flex items-center">
                  <X className="h-5 w-5 mr-2" />
                  {bookingError}
                </div>
              )}
              
              <button
                onClick={handleBooking}
                disabled={bookingLoading || !car.available}
                className={`w-full py-3 rounded-md font-medium ${
                  car.available
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-colors`}
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : car.available ? (
                  'Book Now'
                ) : (
                  'Currently Unavailable'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
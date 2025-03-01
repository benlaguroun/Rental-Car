import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Car, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CarCard from '../components/CarCard';
import type { Database } from '../types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = React.useState<Car[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('available', true)
          .order('daily_rate', { ascending: false })
          .limit(3);

        if (error) throw error;
        setFeaturedCars(data || []);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Car rental hero" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Find Your Perfect Rental Car
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Choose from our wide selection of vehicles at competitive prices
            </p>
            <Link 
              to="/cars" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Find Your Ideal Car</h2>
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Pick-up Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    className="w-full p-3 border border-gray-300 rounded-md pl-10"
                    placeholder="City, Airport, etc."
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  id="pickup-date"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="return-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  id="return-date"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Search Cars
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2">Featured Vehicles</h2>
          <p className="text-gray-600 text-center mb-10">Discover our top-rated cars for your next journey</p>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link 
              to="/cars" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors"
            >
              View All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2">Why Choose Us</h2>
          <p className="text-gray-600 text-center mb-12">We offer the best car rental experience</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from our extensive fleet of vehicles to find the perfect car for your needs.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Booking</h3>
              <p className="text-gray-600">
                Easy online booking with flexible pick-up and return options to suit your schedule.
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Safe & Reliable</h3>
              <p className="text-gray-600">
                All our vehicles are regularly maintained and thoroughly cleaned for your safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2">What Our Customers Say</h2>
          <p className="text-gray-600 text-center mb-12">Read testimonials from our satisfied customers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">John Doe</h4>
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Great service and excellent cars. The booking process was smooth and the staff was very helpful. Will definitely use again!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  JS
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Jane Smith</h4>
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I rented an SUV for our family trip and it was perfect. Clean, well-maintained, and fuel-efficient. Highly recommend!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Johnson</h4>
                  <div className="flex text-yellow-400">
                    {"★".repeat(4)}{"☆".repeat(1)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Competitive prices and good selection of vehicles. The pick-up process was quick and the car was in excellent condition."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
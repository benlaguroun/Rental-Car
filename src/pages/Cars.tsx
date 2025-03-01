import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CarCard from '../components/CarCard';
import type { Database } from '../types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];

const Cars: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');

  useEffect(() => {
    fetchCars();
  }, [category, minPrice, maxPrice, sortBy]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('available', true);

      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }
      
      if (minPrice) {
        query = query.gte('daily_rate', parseInt(minPrice));
      }
      
      if (maxPrice) {
        query = query.lte('daily_rate', parseInt(maxPrice));
      }
      
      // Apply sorting
      if (sortBy === 'price_asc') {
        query = query.order('daily_rate', { ascending: true });
      } else if (sortBy === 'price_desc') {
        query = query.order('daily_rate', { ascending: false });
      } else if (sortBy === 'newest') {
        query = query.order('year', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('price_asc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Available Cars</h1>
      
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          <span className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </span>
          {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className={`w-full md:w-64 ${filtersOpen ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                <option value="economy">Economy</option>
                <option value="compact">Compact</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="van">Van</option>
              </select>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Price Range (per day)</h3>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Models</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleFilterChange}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {/* Cars grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-2">No cars found</h3>
              <p className="text-gray-600 mb-4">
                No cars match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;
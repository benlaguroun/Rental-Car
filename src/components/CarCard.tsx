import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Tag } from 'lucide-react';
import type { Database } from '../types/supabase';

type Car = Database['public']['Tables']['cars']['Row'];

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img 
          src={car.image_url} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {car.category}
          </span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{car.year}</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-green-600 font-bold">
            <DollarSign className="h-5 w-5" />
            <span>${car.daily_rate}/day</span>
          </div>
          <Link 
            to={`/cars/${car.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
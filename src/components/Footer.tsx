import React from 'react';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">CarRental</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for car rentals. We provide quality vehicles at affordable prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/cars" className="text-gray-300 hover:text-white">Cars</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Car Categories</h3>
            <ul className="space-y-2">
              <li><a href="/cars?category=economy" className="text-gray-300 hover:text-white">Economy</a></li>
              <li><a href="/cars?category=suv" className="text-gray-300 hover:text-white">SUV</a></li>
              <li><a href="/cars?category=luxury" className="text-gray-300 hover:text-white">Luxury</a></li>
              <li><a href="/cars?category=van" className="text-gray-300 hover:text-white">Vans</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span className="text-gray-300">info@carrental.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-gray-300">123 Rental St, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-gray-300">
            &copy; {new Date().getFullYear()} CarRental. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
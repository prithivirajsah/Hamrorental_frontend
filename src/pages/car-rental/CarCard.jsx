import React from 'react';
import { Gauge, Users, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CarCard({ car }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/vehicles/${car.id}`, { state: { car } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Car Image */}
      <div className="relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img 
          src={car.image} 
          alt={car.name}
          className="w-4/5 h-auto object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Card Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
          <div className="text-right">
            <span className="text-lg font-bold text-indigo-600">{car.price}</span>
            <span className="text-xs text-gray-400 block">per day</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>PB 95</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            <span>Air Conditioner</span>
          </div>
        </div>
        
        {/* Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

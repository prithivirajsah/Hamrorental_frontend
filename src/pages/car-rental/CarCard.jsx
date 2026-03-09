import React, { useEffect, useState } from 'react';
import { Gauge, Users, Wind, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isInWishlist, toggleWishlist } from '../../utils/wishlistStorage';

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const featureOne = car.features?.[0] || car.fuel || 'PB 95';
  const featureTwo = car.features?.[1] || 'Air Conditioner';

  useEffect(() => {
    setLiked(isInWishlist(car.id));
  }, [car.id]);

  const handleViewDetails = () => {
    navigate(`/vehicles/${car.id}`, { state: { car } });
  };

  const handleToggleWishlist = (event) => {
    event.stopPropagation();
    const result = toggleWishlist(car);
    setLiked(result.added);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Car Image */}
      <div className="relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4.5 h-4.5 ${liked ? 'fill-[#695ED9] text-[#695ED9]' : 'text-gray-500'}`}
          />
        </button>
        <img
          src={car.image}
          alt={car.name}
          className="w-4/5 h-auto object-contain"
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
            <span>{featureOne}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            <span>{featureTwo}</span>
          </div>
        </div>
        
        {/* Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

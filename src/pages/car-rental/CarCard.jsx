import React, { useEffect, useState } from 'react';
import { Gauge, Users, Wind, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isInWishlist, toggleWishlist } from '../../utils/wishlistStorage';
import { RatingDisplay } from '../../components/ui/rating';

function parseImages(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return [];

    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
          ? parsed.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
          : [];
      } catch {
        return [];
      }
    }

    return [raw];
  }

  return [];
}

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = (() => {
    const source = [
      ...parseImages(car.images),
      ...parseImages(car.image_urls),
      ...parseImages(car.image_url),
      ...parseImages(car.image),
    ];

    if (source.length === 0) return [];

    return source.filter((value, index) => source.indexOf(value) === index);
  })();
  const hasMultipleImages = images.length > 1;
  const featureOne = car.features?.[0] || car.fuel || 'PB 95';
  const featureTwo = car.features?.[1] || 'Air Conditioner';
  const ratingValue = Number(car.rating) || 4.6;
  const ratingCount = Number(car.ratingCount) || 32;

  useEffect(() => {
    setLiked(isInWishlist(car.id));
  }, [car.id]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [car.id]);

  useEffect(() => {
    if (activeImageIndex >= images.length) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, images.length]);

  const handleViewDetails = () => {
    navigate(`/vehicles/${car.id}`, { state: { car } });
  };

  const handleToggleWishlist = (event) => {
    event.stopPropagation();
    const result = toggleWishlist(car);
    setLiked(result.added);
  };

  const showPreviousImage = (event) => {
    event.stopPropagation();
    if (!hasMultipleImages) return;
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNextImage = (event) => {
    event.stopPropagation();
    if (!hasMultipleImages) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
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

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        ) : null}

        <img
          src={images[activeImageIndex] || car.image}
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

        <div className="flex items-center justify-between mb-4">
          <RatingDisplay value={ratingValue} size="sm" showValue valueClassName="font-medium" />
          <span className="text-xs text-gray-500">{ratingCount}+ reviews</span>
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

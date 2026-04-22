import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from './BookingForm';

export default function Hero({ title, subtitle, ctaText }) {
  return (
    <section className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl sm:rounded-3xl overflow-hidden">
          {/* Background car image */}
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=500&fit=crop&auto=format" 
            alt="Car background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none" 
            style={{zIndex: 0}}
          />
          {/* Background blur effect */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-48 bg-indigo-400/30 blur-3xl rounded-full" />
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between p-5 sm:p-8 lg:p-12 gap-6 lg:gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left lg:-mt-15">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4">
                {title || (
                  <>
                    Experience the road <br />like never before
                  </>
                )}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base mb-5 sm:mb-6 max-w-md mx-auto lg:mx-0">
                {subtitle || "Discover the freedom of the open road with our premium car rental service. Quality vehicles, competitive prices."}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start w-full sm:w-auto">
                <Link
                  to="/vehicles"
                  className="w-full sm:w-auto justify-center bg-[#FF9E0C] text-white font-bold px-6 py-3 rounded-2xl transition-colors inline-flex items-center gap-2"
                >
                  {ctaText || 'Browse Vehicles'}
                </Link>
                <Link
                  to="/hire-a-driver"
                  className="w-full sm:w-auto justify-center bg-white/10 border border-white/30 text-white font-bold px-6 py-3 rounded-2xl transition-colors inline-flex items-center gap-2 hover:bg-white/20"
                >
                  Hire a Driver
                </Link>
              </div>
            </div>

            {/* Right - Booking Form */}
            <div className="flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

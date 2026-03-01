import React from 'react';
import BookingForm from './BookingForm';

export default function Hero({ title, subtitle, ctaText }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl overflow-hidden">
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
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left -mt-15">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {title || (
                  <>
                    Experience the road <br />like never before
                  </>
                )}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base mb-6 max-w-md mx-auto lg:mx-0">
                {subtitle || "Discover the freedom of the open road with our premium car rental service. Quality vehicles, competitive prices."}
              </p>
              <button className="bg-[#FF9E0C] text-white font-bold px-6 py-2.5 rounded-2xl transition-colors inline-flex items-center gap-2">
                {ctaText || "View all cars"}
              </button>
            </div>

            {/* Right - Booking Form */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

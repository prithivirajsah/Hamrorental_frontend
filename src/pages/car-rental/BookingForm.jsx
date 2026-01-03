import React, { useRef } from 'react';
import { SlArrowDown } from "react-icons/sl";

export default function BookingForm() {
  const carTypeRef = useRef(null);
  const rentalPlaceRef = useRef(null);
  const returnPlaceRef = useRef(null);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-100 max-w-md mx-auto">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Book your car</h3>
      <div className="space-y-5">
        {/* Car Type */}
        <div className="relative">
          <select ref={carTypeRef} className="w-full appearance-none bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 cursor-pointer placeholder:text-gray-400" defaultValue="">
            <option value="" disabled hidden>Car type</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Hatchback</option>
            <option>Luxury</option>
          </select>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer" onClick={() => carTypeRef.current && carTypeRef.current.focus()}>
            <SlArrowDown size={15} />
          </span>
        </div>

        {/* Place of Rental */}
        <div className="relative">
          <select ref={rentalPlaceRef} className="w-full appearance-none bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 cursor-pointer placeholder:text-gray-400" defaultValue="">
            <option value="" disabled hidden>Place of rental</option>
            <option>Kathmandu</option>
            <option>Pokhara</option>
            <option>Chitwan</option>
          </select>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer" onClick={() => rentalPlaceRef.current && rentalPlaceRef.current.focus()}>
            <SlArrowDown size={15} />
          </span>
        </div>

        {/* Place of Return */}
        <div className="relative">
          <select ref={returnPlaceRef} className="w-full appearance-none bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 cursor-pointer placeholder:text-gray-400" defaultValue="">
            <option value="" disabled hidden>Place of return</option>
            <option>Kathmandu</option>
            <option>Pokhara</option>
            <option>Chitwan</option>
          </select>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer" onClick={() => returnPlaceRef.current && returnPlaceRef.current.focus()}>
            <SlArrowDown size={15} />
          </span>
        </div>

        {/* Rental Date */}
        <div className="relative">
          <input 
            type="date" 
            className="w-full bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
            placeholder="Rental date"
          />
        </div>

        {/* Return Date */}
        <div className="relative">
          <input 
            type="date" 
            className="w-full bg-gray-50 border-0 rounded-xl px-6 py-4 pr-12 text-lg text-gray-900 font-normal focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
            placeholder="Return date"
          />
        </div>

        {/* Book Now Button */}
        <button className="w-full bg-[#FF9E0C] text-white font-bold text-xl py-4 rounded-2xl transition-colors mt-2">
          Book now
        </button>
      </div>
    </div>
  );
}

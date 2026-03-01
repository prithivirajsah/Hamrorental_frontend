import React from 'react';

export default function BookingSteps() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 bg-[#f2f3f2] w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">How to book a vehicle?</h2>
        <p className="text-center text-lg mb-10">To book a vehicle with us in Nepal, you can follow the following steps:</p>
        <div className="flex flex-col md:flex-row justify-center items-start md:items-stretch gap-12 w-full mb-8">

          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center px-4 border-r border-gray-300 last:border-none">
            <span className="text-7xl text-[#AEBAC7] font-serif mb-2">1</span>
            <p className="text-center text-base md:text-lg text-[#2C3A4B]">Choose your vehicle and rent.</p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center px-4 border-r border-gray-300 last:border-none">
            <span className="text-7xl text-[#AEBAC7] font-serif mb-2">2</span>
            <p className="text-center text-base md:text-lg text-[#2C3A4B]">Select the pickup location and share it with us.</p>
          </div>

          {/* Step 3 (highlighted) */}
          <div className="flex-1 flex flex-col items-center px-4 border-r border-gray-300 last:border-none">
            <span className="text-7xl text-[#AEBAC7] font-serif mb-2">3</span>
            <p className="text-center text-base md:text-lg text-[#2C3A4B]">Confirm the booking by paying an advance deposit online or by phone.</p>
          </div>

          {/* Step 4 */}
          <div className="flex-1 flex flex-col items-center px-4 border-r border-gray-300 last:border-none">
            <span className="text-7xl text-[#AEBAC7] font-serif mb-2">4</span>
            <p className="text-center text-base md:text-lg text-[#2C3A4B]">Our driver will be at your choice of location. Enjoy your ride!</p>
          </div>
        </div>
        <p className="text-center font-semibold text-[#2C3A4B] mt-6 text-base md:text-lg">
          *Note: You can hire a vehicle in Nepal directly through our website or contact us at the number you provide.
        </p>
      </div>
    </section>
  );
}

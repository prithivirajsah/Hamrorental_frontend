import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash2, ShoppingCart } from 'lucide-react';
import { VscArrowRight } from "react-icons/vsc";

export default function Wishlist() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const wishlistItems = [
    { 
      id: 1, 
      name: '2023 Changan SL S7 EV', 
      price: 0.00, 
      image: 'https://static-cdn.cars24.com/prod/new-car-cms/Toyota/Taisor/2024/05/06/a96bad59-0f97-45fc-ac24-88c904529c44-Taisor-Featured-Image.jpg?w=300&dpr=2.625&optimize=low&format=auto&quality=50'
    }
  ];

  const calculateTotal = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const dailyRate = wishlistItems[0]?.price || 0;
      setTotalAmount(dailyRate * diffDays);
    } else {
      setTotalAmount(0);
    }
  };

  React.useEffect(() => {
    calculateTotal();
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-[#F3F2F2] text-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist (1)</h1>
        
        {wishlistItems.length > 0 ? (
          <div className="space-y-6">
            {/* Vehicle Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-6">
                {/* Vehicle Image */}
                <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={wishlistItems[0].image}
                    alt={wishlistItems[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Vehicle Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{wishlistItems[0].name}</h3>
                      <p className="text-gray-600 text-lg">Rs.{wishlistItems[0].price.toFixed(2)}/day</p>
                    </div>
                    <button className="text-red-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-black font-semibold mb-3">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="yyyy-mm-dd"
                      />
                    </div>
                    <div>
                      <label className="block text-black font-semibold mb-3">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="yyyy-mm-dd"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">Total Amount</span>
                <span className="text-2xl font-bold">Rs.{totalAmount.toFixed(0)}</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">* Price calculated based on selected dates</p>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
                  Checkout (Rs.{totalAmount.toFixed(0)})
                </button>
                
                <Link 
                  to="/"
                  className="flex items-center justify-center gap-2 text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  <span className="text-lg">Continue Shopping</span>
                  <VscArrowRight className="text-2xl" />
                </Link>

              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-500 mb-2">No items in wishlist</h2>
            <p className="text-gray-400 mb-6">Start adding vehicles to your wishlist to see them here.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Vehicles
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

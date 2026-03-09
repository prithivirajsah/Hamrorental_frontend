import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash2, ShoppingCart } from 'lucide-react';
import { VscArrowRight } from "react-icons/vsc";
import { getWishlistItems, removeFromWishlist } from '../utils/wishlistStorage';

export default function Wishlist() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    setWishlistItems(getWishlistItems());
  }, []);

  const parsePrice = (priceValue) => {
    if (typeof priceValue === 'number') return priceValue;
    if (typeof priceValue !== 'string') return 0;
    const numeric = Number(priceValue.replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const totalDailyRate = useMemo(
    () => wishlistItems.reduce((sum, item) => sum + parsePrice(item.price), 0),
    [wishlistItems]
  );

  const totalAmount = rentalDays > 0 ? totalDailyRate * rentalDays : 0;

  const handleRemove = (id) => {
    const nextItems = removeFromWishlist(id);
    setWishlistItems(nextItems);
  };

  return (
    <div className="min-h-screen bg-[#F3F2F2] text-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistItems.length})</h1>
        
        {wishlistItems.length > 0 ? (
          <div className="space-y-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start gap-6">
                  <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-lg">{typeof item.price === 'string' ? item.price : `Rs. ${item.price}`}/day</p>
                        {item.location ? <p className="text-sm text-gray-500 mt-1">{item.location}</p> : null}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  to="/vehicles"
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
            <Link to="/vehicles" className="inline-flex bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Vehicles
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VehicleCard from '../car-rental/CarCard';
import FilterTabs from './FilterTabs';

const vehiclesData = [
  {
    id: 1,
    name: 'Toyota',
    category: 'Sedan',
    price: 0,
    transmission: 'Automat',
    fuel: 'PB 95',
  },
  {
    id: 2,
    name: 'Toyota',
    category: 'Cabriolet',
    price: 0,
    transmission: 'Manual',
    fuel: 'PB 95',
  },
  {
    id: 3,
    name: 'Toyota',
    category: 'Pickup',
    price: 0,
    transmission: 'Automat',
    fuel: 'PB 95',
  },
  {
    id: 4,
    name: 'Toyota',
    category: 'SUV',
    price: 0,
    transmission: 'Manual',
    fuel: 'PB 95',
  },
  {
    id: 5,
    name: 'Toyota',
    category: 'Minivan',
    price: 0,
    transmission: 'Automat',
    fuel: 'PB 95',
  },
  {
    id: 6,
    name: 'Toyota',
    category: 'Sedan',
    price: 0,
    transmission: 'Automat',
    fuel: 'PB 95',
  },

];

export default function Vehicles() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = useMemo(() => {
    return vehiclesData.filter((vehicle) => {
      const matchesCategory = activeTab === 'all' || vehicle.category.toLowerCase() === activeTab;
      const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Select a vehicle group
          </h1>
          {/* Uncomment below if SearchBar exists */}
          {/* <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} /> */}
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} car={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No vehicles found matching your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

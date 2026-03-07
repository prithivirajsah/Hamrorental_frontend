import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VehicleCard from '../car-rental/CarCard';
import FilterTabs from './FilterTabs';
import api from '../../api';

const fallbackImage = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format';

function toAbsoluteImage(url) {
  if (!url) return fallbackImage;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  return `${apiBaseUrl}${url}`;
}

export default function Vehicles() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehiclesData, setVehiclesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      setLoading(true);
      try {
        const posts = await api.getPosts({ limit: 100 });
        const mappedVehicles = Array.isArray(posts)
          ? posts.map((post) => ({
              id: post.id,
              name: post.post_title || 'Vehicle',
              category: (post.category || '').toLowerCase(),
              price: `Rs. ${post.price_per_day ?? 0}`,
              transmission: post.transmission || 'Automatic',
              fuel: post.features?.[0] || 'PB 95',
              features: Array.isArray(post.features) ? post.features : [],
              image: toAbsoluteImage(post.image_urls?.[0]),
              location: post.location || '',
              description: post.description || '',
              contact_number: post.contact_number || '',
            }))
          : [];

        if (isMounted) {
          setVehiclesData(mappedVehicles);
        }
      } catch (error) {
        console.error('Failed to load vehicles:', error);
        if (isMounted) {
          setVehiclesData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehiclesData.filter((vehicle) => {
      const matchesCategory = activeTab === 'all' || (vehicle.category && vehicle.category === activeTab);
      const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vehicle.category || '').includes(searchQuery.toLowerCase()) ||
        (vehicle.location || '').toLowerCase().includes(searchQuery.toLowerCase());
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
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading vehicles...</p>
          </div>
        ) : filteredVehicles.length > 0 ? (
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

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

function parseImages(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return [];

    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return [];
      }
    }

    return [raw];
  }

  return [];
}

export default function Vehicles() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehiclesData, setVehiclesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      setLoading(true);
      try {
        const [posts, categoryOptions] = await Promise.all([
          api.getPosts({ limit: 100, category: activeTab }),
          api.getPostCategories(),
        ]);
        const mappedVehicles = Array.isArray(posts)
          ? posts.map((post) => ({
              images: (() => {
                const apiImages = parseImages(post.image_urls);
                const localImages = parseImages(post.images);
                const fallbackCandidates = [post.image_url, post.image]
                  .map((item) => parseImages(item))
                  .flat();
                const sourceImages = apiImages.length > 0
                  ? apiImages
                  : (localImages.length > 0 ? localImages : fallbackCandidates);
                const normalized = sourceImages
                  .map((item) => toAbsoluteImage(String(item).trim()))
                  .filter(Boolean);
                return normalized.length > 0 ? normalized : [fallbackImage];
              })(),
              id: post.id,
              name: post.post_title || 'Vehicle',
              category: (post.category || '').toLowerCase(),
              price: `Rs. ${post.price_per_day ?? 0}`,
              transmission: post.transmission || 'Automatic',
              fuel: post.features?.[0] || 'PB 95',
              features: Array.isArray(post.features) ? post.features : [],
              image: toAbsoluteImage(post.image_urls?.[0]),
              image_urls: parseImages(post.image_urls),
              location: post.location || '',
              description: post.description || '',
              contact_number: post.contact_number || '',
            }))
              .map((vehicle) => ({
                ...vehicle,
                image: vehicle.images[0],
              }))
          : [];

        if (isMounted) {
          setVehiclesData(mappedVehicles);
          setCategories(Array.isArray(categoryOptions) ? categoryOptions : []);
        }
      } catch (error) {
        console.error('Failed to load vehicles:', error);
        if (isMounted) {
          setVehiclesData([]);
          setCategories([]);
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
  }, [activeTab]);

  const filteredVehicles = useMemo(() => {
    return vehiclesData.filter((vehicle) => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vehicle.category || '').includes(searchQuery.toLowerCase()) ||
        (vehicle.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, vehiclesData]);

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
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} categories={categories} />
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

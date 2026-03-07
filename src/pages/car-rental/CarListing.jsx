import React from 'react';
import { ArrowRight } from 'lucide-react';
import CarCard from './CarCard';

const fallbackImage = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format';

function toAbsoluteImage(url) {
	if (!url) return fallbackImage;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;
	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
	return `${apiBaseUrl}${url}`;
}

export default function CarListing({ vehicles }) {
	const cars = vehicles && vehicles.length > 0
		? vehicles.map((vehicle) => ({
				id: vehicle.id,
				name: vehicle.post_title || vehicle.name || 'Vehicle',
				price: `${!vehicle.currency || vehicle.currency === '$' || String(vehicle.currency).toUpperCase() === 'USD' ? 'Rs.' : vehicle.currency} ${vehicle.price_per_day ?? 0}`,
				transmission: vehicle.transmission || vehicle.category || 'Automatic',
				image: toAbsoluteImage(vehicle.image_url || vehicle.images?.[0] || vehicle.image_urls?.[0]),
				category: vehicle.category || 'Vehicle',
				fuel: vehicle.fuel || vehicle.features?.[0] || 'PB 95',
				features: Array.isArray(vehicle.features) ? vehicle.features : [],
				location: vehicle.location || '',
				description: vehicle.description || '',
		  }))
		: [];

	return (
		<section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Choose the car that suits you
					</h2>
					<a
						href="#"
						className="text-indigo-600 font-bold text-sm flex items-center gap-1 transition-colors"
					>
						View All
						<ArrowRight className="w-4 h-4" strokeWidth={3} />
					</a>
				</div>

				{/* Grid */}
				{cars.length === 0 ? (
					<div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
						No posts available yet.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{cars.map((car) => (
							<CarCard key={car.id} car={car} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}

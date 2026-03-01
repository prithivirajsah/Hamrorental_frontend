import React from 'react';
import { ArrowRight } from 'lucide-react';
import CarCard from './CarCard';

const defaultCars = [
	{
		id: 1,
		name: 'Toyota',
		price: '0',
		transmission: 'Automat.',
		image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format',
	},
	{
		id: 2,
		name: 'Toyota',
		price: '0',
		transmission: 'Automat.',
		image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format',
	},
	{
		id: 3,
		name: 'Toyota',
		price: '0',
		transmission: 'Automat.',
		image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format',
	},
	{
		id: 4,
		name: 'Toyota',
		price: '0',
		transmission: 'Automat.',
		image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format',
	},
	{
		id: 5,
		name: 'Toyota',
		price: '0',
		transmission: 'Automat.',
		image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format',
	},
	{
		id: 6,
		name: 'Toyota',
		price: '0',
		transmission: 'Automat.',
		image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop&auto=format',
	},
];

export default function CarListing({ vehicles }) {
	const cars = vehicles && vehicles.length > 0
		? vehicles.map((vehicle) => ({
				id: vehicle.id,
				name: vehicle.name,
				price: `${vehicle.currency} ${vehicle.price_per_day}`,
				transmission: vehicle.transmission || vehicle.category,
				image: vehicle.image_url,
				category: vehicle.category || 'Vehicle',
				fuel: vehicle.fuel || 'PB 95',
		  }))
		: defaultCars;

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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{cars.map((car) => (
						<CarCard key={car.id} car={car} />
					))}
				</div>
			</div>
		</section>
	);
}

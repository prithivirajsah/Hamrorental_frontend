import React from 'react';
import { Clock, Calendar, Plane, MapPin, Briefcase } from 'lucide-react';
import ServiceCard from './ServiceCard';

const services = [
  {
    icon: Clock,
    title: 'Hourly Hire',
    description: 'Perfect for short trips and errands within the city',
    price: '500/hr',
    features: ['Flexible hours', 'City travel', 'Waiting time included', 'Professional driver']
  },
  {
    icon: Calendar,
    title: 'Daily Hire',
    description: 'Full-day driver service for your convenience',
    price: '1000/day',
    features: ['8-10 hours service', 'Multiple stops', 'Fuel efficient', 'Local expertise']
  },
  {
    icon: MapPin,
    title: 'Outstation Trip',
    description: 'Long-distance travel with experienced drivers',
    price: '2000',
    features: ['Interstate travel', 'Comfortable rides', 'Route planning', 'Safe driving']
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#685ed9]/10 text-[#685ed9] rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Perfect
            <span className="text-[#685ed9]"> Service</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            We offer a variety of driver hire services tailored to your needs.
            Professional, reliable, and always on time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

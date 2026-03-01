import React from 'react';
import { Shield, Clock, Award, Headphones, CreditCard, MapPinned } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Drivers',
    description: 'All our drivers undergo thorough background checks and verification'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Book a driver anytime, day or night. We are always ready to serve'
  },
  {
    icon: Award,
    title: 'Professional Service',
    description: 'Experienced drivers committed to providing excellent service'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Our customer support team is always here to help you'
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80"
                alt="Professional Driver"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </div>

          {/* Right - Features */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#685ed9]/10 text-[#685ed9] rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Experience the Best
              <span className="text-[#685ed9]"> Driver Service</span>
            </h2>
            <p className="text-slate-600 mb-10">
              We pride ourselves on providing top-quality driver services that exceed your expectations.
              Here's what sets us apart.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-[#685ed9]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#685ed9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { Clock, Armchair, PiggyBank, Car, ShieldCheck, UserCheck } from 'lucide-react';

const defaultFeatures = [
  {
    icon: Clock,
    title: 'Availability',
    description: 'Reliability and steady growth are maintained at every moment.'
  },
  {
    icon: Armchair,
    title: 'Comfort',
    description: 'Strong support that enhances performance and ensures smooth operation.'
  },
  {
    icon: PiggyBank,
    title: 'Savings',
    description: 'Affordable service with convenient and flexible options.'
  }
];

const iconMap = {
  car: Car,
  "shield-check": ShieldCheck,
  "user-check": UserCheck,
  availability: Clock,
  comfort: Armchair,
  savings: PiggyBank,
};

export default function Features({ items }) {
  const features = (items && items.length > 0
    ? items.map((item) => ({
        ...item,
        icon: iconMap[item.icon] || Clock,
      }))
    : defaultFeatures
  );

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4 group-hover:bg-indigo-100 transition-colors">
                <feature.icon className="w-8 h-8 text-indigo-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

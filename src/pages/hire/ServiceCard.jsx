import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ icon: Icon, title, description, price, features, delay = 0 }) {
  return (
    <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100 overflow-hidden">
      
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-[#685ed9]/90 to-[#685ed9] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#685ed9]/20">
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4">{description}</p>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-3xl font-bold text-slate-900">{price}</span>
          <span className="text-slate-500">/starting</span>
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-slate-600">
              <div className="w-5 h-5 rounded-full bg-[#685ed9]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[#685ed9]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {feature}
            </li>
          ))}
        </ul>

        <button className="flex items-center gap-2 text-[#685ed9] font-semibold">
          Book Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

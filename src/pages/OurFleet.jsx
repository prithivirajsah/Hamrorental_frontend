import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Fuel, ShieldCheck, Gauge, CheckCircle2 } from 'lucide-react';

const fleet = [
  { category: 'Economy Cars', examples: 'Suzuki Alto, Hyundai i10, Kia Picanto', price: 'From Rs. 3,500/day' },
  { category: 'SUV & 4x4', examples: 'Mahindra Scorpio, Hyundai Creta, Toyota Fortuner', price: 'From Rs. 8,500/day' },
  { category: 'Premium Sedans', examples: 'Honda City, Skoda Slavia, Toyota Corolla', price: 'From Rs. 6,000/day' },
  { category: 'Vans & Group Travel', examples: 'Hiace, EV Van, Tourist Minibus', price: 'From Rs. 11,000/day' },
];

const assurances = [
  { icon: ShieldCheck, label: 'Safety Checked Vehicles' },
  { icon: Gauge, label: 'Performance Maintained' },
  { icon: Fuel, label: 'Fuel Policy Transparency' },
];

export default function OurFleet() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 md:p-12 overflow-hidden relative text-white">
          <div className="absolute -top-16 right-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-indigo-300/25 blur-2xl" />

          <div className="relative grid lg:grid-cols-[1.35fr,1fr] gap-8 items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-indigo-100 uppercase">Our Fleet</p>
              <h1 className="text-3xl md:text-5xl font-bold mt-3">Vehicles For Every Road And Budget</h1>
              <p className="text-indigo-100 mt-4 max-w-2xl leading-relaxed">
                From compact city cars to premium SUVs, choose the right vehicle for daily use, business travel,
                family trips, or special events.
              </p>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-5">
              <p className="text-sm text-indigo-100">Fleet availability</p>
              <p className="text-3xl font-bold mt-1">120+ Active Vehicles</p>
              <p className="text-xs text-indigo-100 mt-2">Updated daily with latest available models.</p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-5 mt-8">
          {fleet.map((item) => (
            <article key={item.category} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold text-gray-900">{item.category}</h2>
              <p className="text-gray-600 mt-3">{item.examples}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#695ED9]">{item.price}</p>
                <Link to="/vehicles" className="text-sm font-semibold text-[#695ED9] hover:underline">
                  View options
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="bg-white rounded-2xl p-7 md:p-8 border border-gray-200 shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Why Customers Trust Our Fleet</h2>
          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white border border-indigo-100 text-[#695ED9] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2 text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-[#FF9E0C]" />
            <p className="text-sm">Need help choosing a model? Our team can suggest based on route and budget.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Clock3, Users, CarFront } from 'lucide-react';

const stats = [
  { label: 'Vehicles Ready', value: '120+' },
  { label: 'Happy Customers', value: '10K+' },
  { label: 'Cities Covered', value: '18+' },
  { label: 'Support Availability', value: '24/7' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Reliable Fleet',
    description: 'Every vehicle is inspected, cleaned, and maintained before each booking.',
  },
  {
    icon: Clock3,
    title: 'Transparent Pricing',
    description: 'No hidden costs. Clear rental pricing with flexible plans for every trip.',
  },
  {
    icon: Users,
    title: '24/7 Assistance',
    description: 'Our support team is available round the clock to help you on the road.',
  },
  {
    icon: CarFront,
    title: 'Modern Experience',
    description: 'Simple booking flow, quick confirmation, and smooth pickup and return process.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 md:p-12 overflow-hidden relative text-white">
          <div className="absolute -top-16 right-8 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 left-10 w-44 h-44 bg-indigo-300/30 rounded-full blur-2xl" />
          <div className="relative grid lg:grid-cols-[1.4fr,1fr] gap-8 items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-indigo-100 uppercase">About Hamro Car Rental</p>
              <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight">Drive With Confidence Across Nepal</h1>
              <p className="text-indigo-100 mt-4 max-w-2xl leading-relaxed">
                Hamro Car Rental was built to make travel simple, safe, and flexible. From daily city driving to outstation
                road trips, our team focuses on quality vehicles and dependable support.
              </p>
              <button className="mt-6 px-6 py-3 rounded-xl bg-[#FF9E0C] hover:brightness-110 text-white font-semibold transition-all">
                Explore Vehicles
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-4">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-indigo-100 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-indigo-50 text-[#695ED9] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">{item.description}</p>
              </article>
            );
          })}
        </section>

        <section className="bg-white rounded-2xl p-7 md:p-10 border border-gray-200 shadow-sm mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Promise</h2>
          <p className="text-gray-600 mt-3 leading-relaxed">
            We deliver a consistent rental experience through verified vehicles, honest rates, and responsive service.
            Whether you choose self-drive or with-driver, your comfort and safety stay at the center of everything we do.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {['Verified Vehicles', 'Flexible Packages', 'Fast Support'].map((item) => (
              <span key={item} className="px-4 py-2 rounded-full text-sm font-medium text-[#695ED9] bg-indigo-50 border border-indigo-100">
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

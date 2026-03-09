import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserCheck, CarTaxiFront, MapPinned, Clock3 } from 'lucide-react';

const benefits = [
  { icon: UserCheck, text: 'Experienced, verified drivers' },
  { icon: MapPinned, text: 'Ideal for business, family, and outstation travel' },
  { icon: CarTaxiFront, text: 'No parking or navigation stress' },
  { icon: Clock3, text: 'Comfort-focused long and short trips' },
];

export default function WithDriver() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 md:p-12 overflow-hidden relative text-white">
          <div className="absolute -top-16 right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-12 w-44 h-44 rounded-full bg-indigo-300/25 blur-2xl" />

          <div className="relative grid lg:grid-cols-[1.4fr,1fr] gap-8 items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-indigo-100 uppercase">With Driver</p>
              <h1 className="text-3xl md:text-5xl font-bold mt-3">Professional Driver Service For Easy Travel</h1>
              <p className="text-indigo-100 mt-4 max-w-2xl leading-relaxed">
                Let our professional drivers handle the road while you focus on your schedule. This service is perfect
                for city transfers, events, and long-distance journeys.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Verified Drivers', 'Safe Travel', 'Doorstep Pickup'].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-5">
              <p className="text-sm text-indigo-100">Most booked plan</p>
              <p className="text-3xl font-bold mt-1">City + Driver</p>
              <p className="text-xs text-indigo-100 mt-2">Popular for events, business, and family travel.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">Service Benefits</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4 text-gray-700">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text} className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white border border-indigo-100 text-[#695ED9] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-800">{item.text}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/hire-a-driver"
              className="inline-flex rounded-xl bg-[#FF9E0C] text-white px-5 py-2.5 font-semibold hover:brightness-110 transition-all"
            >
              Book With Driver
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-xl bg-[#695ED9] text-white px-5 py-2.5 font-semibold hover:opacity-90 transition-all"
            >
              Contact Team
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

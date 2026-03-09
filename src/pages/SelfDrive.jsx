import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CalendarClock, KeyRound, ShieldCheck, Route } from 'lucide-react';

const highlights = [
  { icon: CalendarClock, text: 'Flexible daily, weekly, and monthly packages' },
  { icon: Route, text: 'Wide range of economy to premium vehicles' },
  { icon: KeyRound, text: 'Simple pickup and return process' },
  { icon: ShieldCheck, text: 'Optional insurance upgrades' },
];

export default function SelfDrive() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 md:p-12 overflow-hidden relative text-white">
          <div className="absolute -top-16 right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-12 w-44 h-44 rounded-full bg-indigo-300/25 blur-2xl" />

          <div className="relative grid lg:grid-cols-[1.4fr,1fr] gap-8 items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-indigo-100 uppercase">Self Drive</p>
              <h1 className="text-3xl md:text-5xl font-bold mt-3">Freedom To Drive On Your Schedule</h1>
              <p className="text-indigo-100 mt-4 max-w-2xl leading-relaxed">
                Enjoy full control of your journey with our self-drive rental service. Pick your preferred car,
                set your own route, and travel at your own pace.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['No Driver Fee', 'Easy Pickup', 'Flexible Duration'].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-5">
              <p className="text-sm text-indigo-100">Starting from</p>
              <p className="text-3xl font-bold mt-1">Rs. 3,500/day</p>
              <p className="text-xs text-indigo-100 mt-2">Pricing depends on model and booking duration.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">Why Choose Self Drive?</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4 text-gray-700">
            {highlights.map((item) => {
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
              to="/vehicles"
              className="inline-flex rounded-xl bg-[#FF9E0C] text-white px-5 py-2.5 font-semibold hover:brightness-110 transition-all"
            >
              Browse Vehicles
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-xl bg-[#695ED9] text-white px-5 py-2.5 font-semibold hover:opacity-90 transition-all"
            >
              Ask For Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

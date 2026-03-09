import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Car, UserRound, Plane, BriefcaseBusiness } from 'lucide-react';

const services = [
  {
    icon: Car,
    title: 'Self Drive',
    description: 'Take full control of your journey with flexible self-drive car rentals.',
    link: '/self-drive',
  },
  {
    icon: UserRound,
    title: 'With Driver',
    description: 'Sit back and relax while our trained and trusted drivers handle the route.',
    link: '/with-driver',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 md:p-12 overflow-hidden relative text-white">
          <div className="absolute -top-12 right-6 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-14 left-12 h-40 w-40 rounded-full bg-indigo-300/25 blur-2xl" />

          <div className="relative">
            <p className="text-sm font-semibold tracking-[0.2em] text-indigo-100 uppercase">Our Services</p>
            <h1 className="text-3xl md:text-5xl font-bold mt-3">Mobility Solutions For Every Trip</h1>
            <p className="text-indigo-100 mt-4 max-w-3xl leading-relaxed">
              Choose the service that matches your travel style. Whether you want to drive yourself or hire a driver,
              we provide safe vehicles, easy booking, and reliable support throughout your journey.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Easy Booking', 'Verified Drivers', 'Flexible Plans'].map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-2 gap-5 mt-8">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="h-11 w-11 rounded-xl bg-indigo-50 text-[#695ED9] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                <p className="text-gray-600 mt-3 leading-relaxed flex-1">{item.description}</p>
                <Link
                  to={item.link}
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#FF9E0C] text-white px-4 py-2.5 font-semibold hover:brightness-110 transition-all"
                >
                  Learn More
                </Link>
              </article>
            );
          })}
        </section>

        <section className="grid lg:grid-cols-3 gap-5 mt-8">
          <article className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">How Our Service Works</h2>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {['Choose service', 'Confirm booking', 'Enjoy your ride'].map((step, index) => (
                <div key={step} className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <p className="text-xs font-semibold text-[#695ED9]">STEP {index + 1}</p>
                  <p className="font-semibold text-gray-800 mt-1">{step}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl p-6 border border-indigo-100 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Need custom plan?</h3>
            <p className="text-gray-600 mt-3">Contact us for group travel, wedding events, and corporate packages.</p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#695ED9] text-white px-4 py-2.5 font-semibold hover:opacity-90 transition-all"
            >
              Talk To Support
            </Link>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}

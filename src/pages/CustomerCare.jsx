import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Headset, FileText, PhoneCall, LifeBuoy } from 'lucide-react';

const supportOptions = [
  { icon: Headset, title: 'Booking Help', detail: 'Need help choosing a vehicle or completing payment? We can guide you.' },
  { icon: LifeBuoy, title: 'Trip Assistance', detail: 'Roadside and emergency support is available during active rentals.' },
  { icon: FileText, title: 'Billing Questions', detail: 'Get clear answers on pricing, deposits, and invoices.' },
  { icon: PhoneCall, title: 'Feedback & Complaints', detail: 'Share your feedback so we can improve your rental experience.' },
];

export default function CustomerCare() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 md:p-12 overflow-hidden relative text-white">
          <div className="absolute -top-12 right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 left-12 h-40 w-40 rounded-full bg-indigo-300/25 blur-2xl" />
          <div className="relative grid lg:grid-cols-[1.4fr,1fr] gap-8 items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-indigo-100 uppercase">Customer Care</p>
              <h1 className="text-3xl md:text-5xl font-bold mt-3">We Are Here To Help, Anytime</h1>
              <p className="text-indigo-100 mt-4 max-w-2xl leading-relaxed">
                Our customer care team is dedicated to making your rental smooth from booking to return.
                Reach out for support, updates, or quick problem resolution.
              </p>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-5">
              <p className="text-sm text-indigo-100">Support response</p>
              <p className="text-3xl font-bold mt-1">Under 2 Hours</p>
              <p className="text-xs text-indigo-100 mt-2">Fastest responses during working hours.</p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-5 mt-8">
          {supportOptions.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="h-11 w-11 rounded-xl bg-indigo-50 text-[#695ED9] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">{item.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="bg-white rounded-2xl p-7 md:p-8 border border-gray-200 shadow-sm mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Need immediate assistance?</h2>
            <p className="text-gray-600 mt-2">Our support channels are open for booking and active trip help.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-[#FF9E0C] text-white px-5 py-2.5 font-semibold hover:brightness-110 transition-all"
          >
            Contact Support
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

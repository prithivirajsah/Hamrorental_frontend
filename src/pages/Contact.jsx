import React, { useState } from 'react';
import { FaClock, FaEnvelope, FaLocationDot, FaPhone } from 'react-icons/fa6';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    topic: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero Card */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-indigo-400/40 blur-3xl" />
              <div className="absolute bottom-0 left-16 h-32 w-32 rounded-full bg-indigo-300/30 blur-3xl" />
            </div>

            <div className="relative grid gap-6 md:grid-cols-[2fr,1.3fr] items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/80 mb-3">
                  We&apos;re here to help
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                  Contact Hamro  Car Rental Support
                </h1>
                <p className="text-sm sm:text-base text-indigo-100 max-w-xl">
                  Have questions about your booking, prices, or specific vehicles? Reach out and our team will
                  get back to you as soon as possible.
                </p>
              </div>

              <div className="hidden md:flex justify-end">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md px-6 py-5 text-sm text-indigo-50 border border-white/10 max-w-xs">
                  <p className="font-semibold mb-2">Average response time</p>
                  <p className="text-2xl font-bold">&lt; 2 hours</p>
                  <p className="mt-2 text-xs text-indigo-100/80">
                    During business hours, we aim to respond to all messages within two hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr,1.2fr]">
          {/* Left: Contact Info + Visit Us */}
          <div className="space-y-6">
            <div className="bg-white text-gray-900 px-7 py-8 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Talk to our team</h2>
              <p className="text-sm text-gray-500 mb-6">
                Reach us directly via phone, email, or visit our office during working hours.
              </p>
              <ul className="space-y-4 text-sm sm:text-base">
                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FaPhone className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</p>
                    <p className="mt-1 font-medium text-gray-900">+977 9815836412</p>
                    <p className="text-gray-800">+977 9767563691</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
                    <p className="mt-1 font-medium text-gray-900">prithivirajsah584@gmail.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FaLocationDot className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</p>
                    <p className="mt-1 font-medium text-gray-900">44600 Kathmandu, Nepal</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FaClock className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Working hours</p>
                    <p className="mt-1 text-gray-800">
                      Sun – Fri: 9:00 AM – 6:00 PM
                      <br />
                      Sat: 10:00 AM – 4:00 PM
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white p-7 sm:p-9 text-gray-900 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
            <p className="text-sm text-gray-500 mb-7">
              Fill out the form below and our support team will contact you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full h-11 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full h-11 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-800 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Booking inquiry, pricing question, etc."
                    className="w-full h-11 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-800 mb-2">
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full h-11 rounded-2xl border border-gray-300 bg-white text-gray-900 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select a topic</option>
                    <option value="booking">New booking</option>
                    <option value="existing-booking">Existing booking</option>
                    <option value="pricing">Pricing & offers</option>
                    <option value="vehicle">Vehicle information</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-2">
                  Phone number (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full h-11 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us a bit about what you need help with..."
                  className="w-full rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 py-3 text-sm outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 sm:h-12 rounded-2xl bg-[#FF9E0C] text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-sm hover:brightness-110 transition"
              >
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
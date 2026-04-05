import React, { useState } from 'react';
import { FaClock, FaEnvelope, FaLocationDot, FaPhone } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    topic: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      full_name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      topic: formData.topic.trim(),
      phone_number: formData.phone.trim() || undefined,
      message: formData.message.trim(),
    };

    try {
      const response = await api.sendContactMessage(payload);
      toast.success(response?.message || 'Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        topic: '',
        message: '',
      });
    } catch (error) {
      const detail = error?.response?.data?.detail;

      let errorMessage = 'Failed to send message. Please try again.';
      if (Array.isArray(detail) && detail.length > 0) {
        errorMessage = detail[0]?.msg || errorMessage;
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      label: 'Phone',
      value: '+977 9815836412',
      icon: FaPhone,
    },
    {
      label: 'Email',
      value: 'prithivirajsah584@gmail.com',
      icon: FaEnvelope,
    },
    {
      label: 'Location',
      value: '44600 Kathmandu, Nepal',
      icon: FaLocationDot,
    },
    {
      label: 'Hours',
      value: 'Sun – Fri: 9:00 AM – 6:00 PM',
      subValue: 'Sat: 10:00 AM – 4:00 PM',
      icon: FaClock,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-7 sm:p-10 overflow-hidden relative">
          <div className="absolute -top-14 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 left-10 h-36 w-36 rounded-full bg-purple-300/20 blur-2xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr,1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] font-semibold text-indigo-100 mb-3">Contact Us</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Need Help With Your Booking?</h1>
              <p className="text-indigo-100 mt-4 text-sm sm:text-base max-w-2xl">
                Send your query and our support team will guide you with bookings, pricing, and vehicle details.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {['Instant support', 'Trusted service', 'Quick response'].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
                    {item}
                  </span>
                ))}
              </div>
            </div>


          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map(({ label, value, subValue, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Icon className="text-lg" />
              </div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1 break-words">{value}</p>
              {subValue && <p className="text-sm text-gray-600 mt-0.5">{subValue}</p>}
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-9 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a message</h2>
            <p className="text-sm text-gray-500 mb-7">Fill out the form and our support team will contact you shortly.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-11 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full h-11 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-800 mb-2">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Booking, pricing, or support"
                    required
                    className="w-full h-11 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-800 mb-2">Topic</label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                    className="w-full h-11 rounded-xl border border-gray-300 bg-white text-gray-900 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-2">Phone number (optional)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full h-11 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirement..."
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 py-3 text-sm outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 rounded-xl bg-[#FF9E0C] text-white text-sm sm:text-base font-semibold hover:brightness-110 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

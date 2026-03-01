import React, { useState } from 'react';
import { FaClock, FaEnvelope, FaLocationDot, FaPhone } from 'react-icons/fa6';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };


  return (
    <div className="bg-[#f3f3f3] min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <section className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-black">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            Have questions about renting? We&apos;re here to help you with your rental needs.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4 lg:order-2">


            <div className="bg-white text-gray-900 px-8 py-10 rounded-3xl shadow-sm border border-gray-200">
              <ul className="space-y-5 text-lg">
                <li className="flex items-center gap-4">
                  <FaPhone className="text-xl" />
                  <span>+977 9815836412 
                    <br />
                    +977 9767563691
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <FaEnvelope className="text-xl" />
                  <span>prithivirajsah584@gmail.com</span>
                </li>
                <li className="flex items-center gap-4">
                  <FaLocationDot className="text-xl" />
                  <span>44600 Kathmandu, Nepal</span>
                </li>
                <li className="flex items-start gap-4">
                  <FaClock className="text-xl mt-1" />
                  <span>
                    Sun: 9:00 AM - 6:00 PM
                    <br />
                    Mon: 9:00 AM - 6:00 PM
                    <br />
                    Tue: 9:00 AM - 6:00 PM
                    <br />
                    Wed: 9:00 AM - 6:00 PM
                    <br />
                    Thu: 9:00 AM - 6:00 PM
                    <br />
                    Fri: 9:00 AM - 6:00 PM
                    <br />
                    Sat: 10:00 AM - 4:00 PM
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10 text-gray-900 rounded-3xl shadow-sm border border-gray-200 lg:order-1">
            <h2 className="text-4xl font-bold text-black mb-8">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full h-12 rounded-full border-2 border-black bg-white text-black placeholder:text-gray-500 px-4 text-lg outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your@gmail.com"
                    className="w-full h-12 rounded-full border-2 border-black bg-white text-black placeholder:text-gray-500 px-4 text-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={8}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message......"
                  className="w-full rounded-3xl border-2 border-black bg-white text-black placeholder:text-gray-500 px-4 py-3 text-lg outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#ff9f0f] text-black text-3xl font-semibold hover:brightness-95 transition"
              >
                Book now
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
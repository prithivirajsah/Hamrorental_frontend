import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ServicesSection from './ServicesSection';
import HowItWorks from './HowItWorks';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import { addDriverRequest } from '@/utils/driverRequestStorage';

export default function HireaDriver() {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    pickup_location: '',
    service_type: '',
    pickup_date: '',
    pickup_time: '',
    note: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.customer_name.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }
    if (!formData.pickup_location.trim()) {
      toast.error('Please enter pickup location.');
      return;
    }
    if (!formData.service_type) {
      toast.error('Please choose service type.');
      return;
    }
    if (!formData.pickup_date) {
      toast.error('Please choose pickup date.');
      return;
    }

    addDriverRequest(formData);
    toast.success('Driver request submitted. Drivers can now see your request.');

    setFormData({
      customer_name: '',
      phone: '',
      pickup_location: '',
      service_type: '',
      pickup_date: '',
      pickup_time: '',
      note: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <ServicesSection />

      <section className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Request a Driver</h2>
          <p className="text-sm text-gray-500 mt-1">Fill this form and available drivers will see your request.</p>

          <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name *</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.customer_name}
                onChange={(event) => handleChange('customer_name', event.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number *</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                placeholder="98XXXXXXXX"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Pickup Location *</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.pickup_location}
                onChange={(event) => handleChange('pickup_location', event.target.value)}
                placeholder="Pickup location"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Service Type *</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.service_type}
                onChange={(event) => handleChange('service_type', event.target.value)}
                required
              >
                <option value="">Select service type</option>
                <option value="Hourly Hire">Hourly Hire</option>
                <option value="Daily Hire">Daily Hire</option>
                <option value="Outstation Hire">Outstation Hire</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Pickup Date *</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.pickup_date}
                onChange={(event) => handleChange('pickup_date', event.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Pickup Time</label>
              <input
                type="time"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.pickup_time}
                onChange={(event) => handleChange('pickup_time', event.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Additional Note</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.note}
                onChange={(event) => handleChange('note', event.target.value)}
                placeholder="Any special instructions"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium transition-colors"
              >
                <Phone className="w-4 h-4" /> Submit Driver Request
              </button>
            </div>
          </form>
        </div>
      </section>

      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ServicesSection from './ServicesSection';
import HowItWorks from './HowItWorks';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/api';

export default function HireaDriver() {
  const { user, isAuthenticated } = useAuth();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [formData, setFormData] = useState({
    post_id: '',
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

  const openRequestModal = (serviceType = '') => {
    setFormData((prev) => ({
      ...prev,
      service_type: serviceType || prev.service_type,
    }));
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
  };

  React.useEffect(() => {
    const loadVehicles = async () => {
      try {
        const posts = await api.getPosts({ limit: 200 });
        const list = Array.isArray(posts) ? posts : [];
        setAvailableVehicles(list);
      } catch {
        setAvailableVehicles([]);
      }
    };

    loadVehicles();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated() || user?.role !== 'user') {
      toast.error('Please login as customer before hiring a driver.');
      return;
    }

    if (!formData.customer_name.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!formData.post_id) {
      toast.error('Please select a vehicle/driver first.');
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

    setIsSubmitting(true);
    try {
      const extraNote = [
        formData.note?.trim(),
        `Customer: ${formData.customer_name.trim()}`,
        `Phone: ${formData.phone.trim()}`,
        formData.service_type ? `Service: ${formData.service_type}` : null,
        formData.pickup_time ? `Pickup Time: ${formData.pickup_time}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      await api.createHireRequest({
        post_id: Number(formData.post_id),
        pickup_location: formData.pickup_location.trim(),
        return_location: formData.pickup_location.trim(),
        start_date: formData.pickup_date,
        end_date: formData.pickup_date,
        note: extraNote,
      });

      toast.success('Driver request submitted. Driver can now approve and start chat.');

      setFormData({
        post_id: '',
        customer_name: '',
        phone: '',
        pickup_location: '',
        service_type: '',
        pickup_date: '',
        pickup_time: '',
        note: '',
      });
      closeRequestModal();
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to submit hire request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <ServicesSection onRequest={openRequestModal} />

      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" onClick={closeRequestModal}>
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-xl p-6 md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Request a Driver</h2>
                <p className="text-sm text-gray-500 mt-1">Fill this form and available drivers will see your request.</p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={closeRequestModal}
                aria-label="Close request form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Choose Vehicle/Driver *</label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.post_id}
                  onChange={(event) => handleChange('post_id', event.target.value)}
                  required
                >
                  <option value="">Select available vehicle</option>
                  {availableVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.post_title || `Vehicle #${vehicle.id}`} - {vehicle.location || 'Location N/A'}
                    </option>
                  ))}
                </select>
              </div>

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
                  <option value="Outstation Trip">Outstation Trip</option>
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
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium transition-colors"
                >
                  <Phone className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Driver Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Car, Phone } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ServicesSection from './ServicesSection';
import HowItWorks from './HowItWorks';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';

export default function HireaDriver() {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    pickup_location: '',
    service_type: '',
    pickup_date: '',
    pickup_time: ''
  });

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <ServicesSection />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
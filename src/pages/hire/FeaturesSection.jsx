import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, Headphones, CreditCard, MapPinned } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Drivers',
    description: 'All our drivers undergo thorough background checks and verification'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Book a driver anytime, day or night. We are always ready to serve'
  },
  {
    icon: Award,
    title: 'Professional Service',
    description: 'Experienced drivers committed to providing excellent service'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Our customer support team is always here to help you'
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Multiple payment options including cash, cards, and digital wallets'
  },
  {
    icon: MapPinned,
    title: 'GPS Tracking',
    description: 'Real-time tracking for your safety and peace of mind'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80"
                alt="Professional Driver"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Driver" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="Driver" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Driver" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">100+ Drivers</p>
                  <p className="text-sm text-slate-500">Ready to serve you</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Experience the Best
              <span className="text-amber-500"> Driver Service</span>
            </h2>
            <p className="text-slate-600 mb-10">
              We pride ourselves on providing top-quality driver services that exceed your expectations.
              Here's what sets us apart.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
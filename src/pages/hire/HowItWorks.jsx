import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, UserCheck, Car } from 'lucide-react';

const steps = [
  {
    icon: Smartphone,
    step: '01',
    title: 'Book Online or Call',
    description: 'Use our easy booking form or call us directly to schedule your driver'
  },
  {
    icon: UserCheck,
    step: '02',
    title: 'Get Confirmation',
    description: 'Receive instant confirmation with driver details and contact information'
  },
  {
    icon: Car,
    step: '03',
    title: 'Enjoy Your Ride',
    description: 'Your professional driver arrives on time, ready to serve you'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It <span className="text-amber-400">Works</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Getting a driver is as easy as 1-2-3. Book now and experience hassle-free travel.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent" />
              )}

              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors duration-300">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 border-2 border-amber-400 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Executive',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    content: 'Exceptional service! The driver was professional, punctual, and made my airport transfer completely stress-free. Highly recommend!',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Frequent Traveler',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    content: 'I use their monthly service for my business needs. The drivers are always well-mannered and know the city inside out.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Tourist',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    content: 'Made our vacation so much better! Our driver was not just skilled but also acted as a wonderful guide. Great value for money.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-[#b4aeee] text-[#b4aeee] rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            What Our Customers <span className="text-[#b4aeee]">Say</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what our happy customers have to say.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#b4aeee] opacity-30" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#b4aeee] text-[#b4aeee]" />
                ))}
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#b4aeee]"
                />
                <div>
                  <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

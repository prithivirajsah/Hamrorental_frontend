import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Prithivi',
    role: 'Business Executive',
    image: '',
    content: 'Exceptional service! The driver was professional, punctual, and made my airport transfer completely stress-free. Highly recommend!',
    rating: 5
  },
  {
    name: 'Prithivi',
    role: 'Frequent Traveler',
    image: '',
    content: 'I use their monthly service for my business needs. The drivers are always well-mannered and know the city inside out.',
    rating: 5
  },
  {
    name: 'Prithivi',
    role: 'Tourist',
    image: '',
    content: 'Made our vacation so much better! Our driver was not just skilled but also acted as a wonderful guide. Great value for money.',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#b4aeee] text-[#b4aeee] rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            What Our Customers <span className="text-[#b4aeee]">Say</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what our happy customers have to say.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
            >

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#b4aeee] text-[#b4aeee]" />
                ))}
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div>
                <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

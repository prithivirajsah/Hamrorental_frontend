import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-12 lg:p-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-slate-800 text-lg mb-10 max-w-2xl mx-auto">
            Book your professional driver today and experience the difference.
            Available 24/7 for all your transportation needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-lg rounded-xl">
              Book Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <a
              href="tel:+1234567890"
              className="flex items-center gap-2 h-14 px-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-slate-900 font-semibold text-lg rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call: +1 234 567 890
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-800">
            <a href="mailto:info@hiredriver.com" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <Mail className="w-5 h-5" />
              info@hiredriver.com
            </a>
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-800/50" />
            <span>Available in 50+ Cities</span>
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-800/50" />
            <span>24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
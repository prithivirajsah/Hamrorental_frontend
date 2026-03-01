import React from 'react';
import { Phone, Mail, ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#685ed9]/10 via-transparent to-[#685ed9]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#685ed9]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-gradient-to-br from-[#685ed9] to-[#685ed9]/90 rounded-3xl p-12 lg:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-slate-800 text-lg mb-10 max-w-2xl mx-auto">
            Book your professional driver today and experience the difference.
            Available 24/7 for all your transportation needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              type="button"
              className="h-14 px-8 bg-slate-900 text-white font-semibold text-lg rounded-xl inline-flex items-center"
            >
              Book Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <a
              href="tel:+977 9815836412"
              className="flex items-center gap-2 h-14 px-8 bg-white/20 backdrop-blur-sm text-slate-900 font-semibold text-lg rounded-xl"
            >
              <Phone className="w-5 h-5" />
              Call: +977 9815836412
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-800">
            <a href="mailto:info@hiredriver.com" className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              prithivirajsah584@gmail.com
            </a>
          


            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
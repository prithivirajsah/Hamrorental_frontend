import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import HeaderIcon from '../assets/Headericon.png';

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img src={HeaderIcon} alt="Hamro Rental" className="h-12" />
            </div>

            <p className="text-black mb-4 font-medium">
              Your trusted partner for quality car rentals. Drive your dreams with our premium fleet.
            </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.facebook.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black flex items-center justify-center"
              aria-label="Facebook"
            >
              <FaFacebook className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
            <a
              href="https://www.instagram.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
            <a
              href="https://x.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black flex items-center justify-center"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
            <a
              href="https://www.youtube.com/"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black flex items-center justify-center"
              aria-label="YouTube"
            >
              <FaYoutube className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </a>
          </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover-custom-purple font-medium inline-block transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover-custom-purple font-medium inline-block transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover-custom-purple font-medium inline-block transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
                  Services 
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover-custom-purple font-medium inline-block transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
                  Our Fleet
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover-custom-purple font-medium inline-block transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
                  Customer Care
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover-custom-purple font-medium inline-block transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
                  Self Drive
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover-custom-purple font-medium inline-block transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
                  With Driver
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4.5">
              <li className="flex items-center gap-3">
                <FaPhone className="size-6 flex-shrink-0 text-black" />
                <span className="text-black">+977 9815836412</span>
              </li>

              <li className="flex items-center gap-3">
                <MdEmail className="size-6 flex-shrink-0 text-black" />
                <span className="text-black">info@hamrorental.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FaLocationDot className="size-6 flex-shrink-0 text-black" />
                <span className="text-black">Haddigaun Naxal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black text-center md:text-left">
            © 2025 HamroCar Rental. 
          </p>
          <div className="flex flex-wrap gap-6 text-black">
            <a href="#" className="text-black hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-black hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
              Terms of Service
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-black hover-custom-purple font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative group">
              Cookie Policy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 custom-purple-underline transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
    
  );
}

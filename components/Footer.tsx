'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/85"></div>
      <div className="max-w-7xl mx-auto px-4 py-16 relative text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Restaurant Info */}
          <motion.div className="space-y-6">
            <Link href="/" className="block transform hover:scale-105 transition-transform duration-300">
              <div className="relative w-[120px] h-[48px] md:w-[140px] md:h-[56px]">
                <Image 
                  src="/logo.jpg" 
                  alt="Foodies by glance" 
                  fill
                  className="object-contain rounded-full"
                  priority
                />
              </div>
            </Link>
            <p className="text-lg leading-relaxed text-gray-300">
              Experience culinary excellence at its finest. Our passion for food meets artistic presentation, creating unforgettable dining moments for our cherished guests.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-amber-500 font-semibold">Our Rating:</span>
              <div className="flex text-amber-400">
                {'★'.repeat(5)}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative inline-block">
              Menu & More
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/menu', text: 'Our Menu', icon: '🍽️' },
                { href: '/reservations', text: 'Book a Table', icon: '📅' },
                { href: '/specials', text: 'Daily Specials', icon: '✨' },
                { href: '/events', text: 'Private Events', icon: '🎉' },
                { href: '/gallery', text: 'Food Gallery', icon: '📸' },
                { href: '/chef', text: 'Meet the Chef', icon: '👨‍🍳' }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center space-x-2 text-gray-300 hover:text-amber-500 transition-all duration-300">
                    <span>{link.icon}</span>
                    <span>{link.text}</span>
                    <FaArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h4>
            <div className="space-y-4">
              <a href="tel:5551234567" className="flex items-center gap-4 p-3 rounded-lg bg-black/30 hover:bg-amber-500/20 transition-all duration-300">
                <div className="bg-amber-500 rounded-full p-2">
                  <FaPhoneAlt className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Reservations</p>
                  <p className="text-white">(555) 123-4567</p>
                </div>
              </a>
              <a href="mailto:info@foodiesbyglance.com" className="flex items-center gap-4 p-3 rounded-lg bg-black/30 hover:bg-amber-500/20 transition-all duration-300">
                <div className="bg-amber-500 rounded-full p-2">
                  <FaEnvelope className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Email Us</p>
                  <p className="text-white">info@foodiesbyglance.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-black/30 hover:bg-amber-500/20 transition-all duration-300">
                <div className="bg-amber-500 rounded-full p-2">
                  <FaMapMarkerAlt className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Location</p>
                  <p className="text-white">789 Gourmet Avenue, Foodie District, FD 56789</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative inline-block">
              Foodie Updates
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h4>
            <p className="text-gray-300">Subscribe to receive special offers, new menu updates, and exclusive event invitations.</p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border-2 border-transparent focus:border-amber-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">🍽️</div>
              </div>
              <button 
                type="submit"
                className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
              >
                Join Our Table
              </button>
            </form>
          </motion.div>
        </div>

        {/* Social Links & Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex space-x-6">
              {[
                { Icon: FaFacebookF, href: '#', color: 'bg-[#1877F2]' },
                { Icon: FaInstagram, href: '#', color: 'bg-[#E4405F]' },
                { Icon: FaTiktok, href: '#', color: 'bg-[#000000]' },
                { Icon: FaYoutube, href: '#', color: 'bg-[#FF0000]' }
              ].map(({ Icon, href, color }, index) => (
                <Link 
                  key={index} 
                  href={href} 
                  className={`${color} p-3 rounded-full hover:bg-amber-500 transition-all duration-300 transform hover:scale-110`}
                >
                  <Icon className="text-xl text-white" />
                </Link>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Foodies by glance. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-2 text-sm">
                <Link href="/privacy" className="text-gray-300 hover:text-amber-500 transition-colors">Privacy Policy</Link>
                <span className="text-gray-500">•</span>
                <Link href="/terms" className="text-gray-300 hover:text-amber-500 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

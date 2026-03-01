import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'All vehicles', icon: '🚗' },
  { id: 'sedan', label: 'Sedan', icon: '🚙' },
  { id: 'cabriolet', label: 'Cabriolet', icon: '🏎️' },
  { id: 'pickup', label: 'Pickup', icon: '🛻' },
  { id: 'suv', label: 'SUV', icon: '🚐' },
  { id: 'minivan', label: 'Minivan', icon: '🚌' },
];

export default function FilterTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onTabChange(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
            ${activeTab === category.id
              ? 'text-white shadow-lg shadow-indigo-500/30'
              : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }
          `}
        >
          {activeTab === category.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            <span className="hidden sm:inline">{category.icon}</span>
            {category.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

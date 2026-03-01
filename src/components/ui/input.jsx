import React from 'react';

export const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${className}`.trim()}
      {...props}
    />
  );
});

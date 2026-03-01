import React from 'react';

export const Textarea = React.forwardRef(function Textarea({ className = '', ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`w-full min-h-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${className}`.trim()}
      {...props}
    />
  );
});

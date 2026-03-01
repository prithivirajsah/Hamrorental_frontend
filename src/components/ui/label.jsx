import React from 'react';

export function Label({ className = '', ...props }) {
  return <label className={`text-sm font-medium text-gray-700 ${className}`.trim()} {...props} />;
}

import React from 'react';

export const Button = React.forwardRef(function Button(
  { className = '', variant = 'default', type = 'button', ...props },
  ref
) {
  const variantClass =
    variant === 'outline'
      ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent';

  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variantClass} ${className}`.trim()}
      {...props}
    />
  );
});

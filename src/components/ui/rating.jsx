import { Star } from 'lucide-react';

function clampRating(value, max) {
  return Math.max(0, Math.min(value, max));
}

export function RatingDisplay({
  value = 0,
  max = 5,
  size = 'md',
  className = '',
  showValue = false,
  valueClassName = '',
}) {
  const normalizedValue = clampRating(Number(value) || 0, max);
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  const iconSize = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <div className="flex items-center gap-1" aria-label={`Rated ${normalizedValue} out of ${max}`}>
        {Array.from({ length: max }).map((_, index) => { 
          const starNumber = index + 1;
          const isFilled = starNumber <= normalizedValue;

          return (
            <Star
              key={starNumber}
              className={`${iconSize} ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
            />
          );
        })}
      </div>
      {showValue ? (
        <span className={`text-sm text-gray-600 ${valueClassName}`.trim()}>{normalizedValue.toFixed(1)}</span>
      ) : null}
    </div>
  );
}

export function RatingInput({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  className = '',
}) {
  const normalizedValue = clampRating(Number(value) || 0, max);
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };
  const iconSize = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`.trim()}>
      {Array.from({ length: max }).map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= normalizedValue;

        return (
          <button
            key={starNumber}
            type="button"
            onClick={() => onChange?.(starNumber)}
            className="rounded-sm p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`Rate ${starNumber} out of ${max}`}
          >
            <Star
              className={`${iconSize} transition-colors ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-400'}`}
            />
          </button>
        );
      })}
    </div>
  );
}

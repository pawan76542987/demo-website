import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, reviewCount, size = 'sm', showCount = true }) => {
  const numRating = Number(rating) || 0;
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {stars.map((star) => {
          const isFull = numRating >= star;
          const isHalf = !isFull && numRating >= star - 0.5;

          return (
            <span key={star} className="relative">
              <Star
                className={`${starSize} ${
                  isFull
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </span>
          );
        })}
      </div>
      <span className="text-xs font-bold text-slate-700">
        {numRating > 0 ? numRating.toFixed(1) : 'New'}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-slate-500 font-normal">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

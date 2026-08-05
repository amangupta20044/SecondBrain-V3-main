import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>

      {/* Category skeleton */}
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="grid grid-cols-5 gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Tags skeleton */}
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-14 bg-gray-200 dark:bg-slate-700 rounded-full" />
          ))}
        </div>
      </div>

      {/* Textarea skeleton */}
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded-lg" />
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg w-full" />
    </div>
  );
};

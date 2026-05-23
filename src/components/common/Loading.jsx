import React from 'react';
import Skeleton from './Skeleton';

const Loading = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-white ring-1 ring-gray-200">
            <Skeleton className="h-28 w-full rounded-none sm:h-40" />
            <div className="space-y-2 p-3 sm:p-4">
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3.5 w-10/12" />
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;

import React from 'react';

const Box = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

const EventDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back link */}
      <Box className="mb-6 h-4 w-28" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: image + thumbnails */}
        <div>
          <Box className="h-[420px] w-full rounded-xl" />
          <div className="mt-3 flex gap-3">
            <Box className="h-20 w-20 rounded-lg" />
            <Box className="h-20 w-20 rounded-lg" />
          </div>
        </div>

        {/* Right: details */}
        <div>
          {/* Title */}
          <Box className="h-8 w-3/4" />

          {/* About heading */}
          <Box className="mt-5 h-5 w-44" />

          {/* Description lines */}
          <div className="mt-3 space-y-2">
            <Box className="h-4 w-full" />
            <Box className="h-4 w-full" />
            <Box className="h-4 w-2/3" />
          </div>
          <div className="mt-3 space-y-2">
            <Box className="h-4 w-full" />
            <Box className="h-4 w-5/6" />
          </div>

          {/* Send proof line */}
          <Box className="mt-4 h-4 w-52" />

          <div className="my-5 border-t border-gray-100" />

          {/* Date / Distance / Location row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Box className="h-4 w-24" />
              <Box className="mt-2 h-4 w-28" />
              <Box className="mt-1 h-4 w-16" />
            </div>
            <div>
              <Box className="h-4 w-20" />
              <Box className="mt-2 h-4 w-12" />
            </div>
            <div>
              <Box className="h-4 w-20" />
              <Box className="mt-2 h-4 w-32" />
              <Box className="mt-1 h-4 w-20" />
            </div>
          </div>

          {/* Price */}
          <Box className="mt-5 h-8 w-32" />

          {/* Register button + share icons */}
          <div className="mt-4 flex items-center justify-between">
            <Box className="h-11 w-36 rounded-full" />
            <div className="flex items-center gap-3">
              <Box className="h-4 w-12" />
              <Box className="h-5 w-5 rounded" />
              <Box className="h-5 w-5 rounded" />
              <Box className="h-5 w-5 rounded" />
            </div>
          </div>

          {/* Organizer */}
          <div className="mt-6 flex items-center gap-3">
            <Box className="h-10 w-10 rounded-full" />
            <div>
              <Box className="h-3 w-24" />
              <Box className="mt-2 h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;

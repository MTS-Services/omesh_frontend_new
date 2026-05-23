import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className = '', style, rounded = 'rounded-lg', ...props }) => {
  return (
    <div
      aria-hidden="true"
      className={clsx('skeleton-shimmer motion-reduce:animate-none', rounded, className)}
      style={style}
      {...props}
    />
  );
};

export default Skeleton;
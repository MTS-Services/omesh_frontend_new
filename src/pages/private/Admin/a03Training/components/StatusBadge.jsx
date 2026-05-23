import React from 'react';

const StatusBadge = ({ status }) => {
  const isCompleted = status === 'Completed';
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
        isCompleted ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-600'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

import React from 'react';

const HistoryStatusBadge = ({ status }) => {
  const isApproved = status === 'Approved';
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
      }`}
    >
      {status}
    </span>
  );
};

export default HistoryStatusBadge;

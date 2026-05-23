import React from 'react';
import { ChevronDown } from 'lucide-react';

const RequestStatusBadge = ({ status }) => {
  const isApproved = status === 'Approved';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
        isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
      }`}
    >
      {status}
      <ChevronDown size={12} />
    </span>
  );
};

export default RequestStatusBadge;

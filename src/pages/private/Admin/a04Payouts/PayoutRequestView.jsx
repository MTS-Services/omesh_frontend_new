import React from 'react';
import PayoutTable from './components/PayoutTable';
import PayoutTable2 from './components/PayoutTable2';

const PayoutRequestView = () => {
  return (
    <div className="">
      {/* Payout Request */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Payout Request</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your balance summary and request a new payout.
        </p>
      </div>

      <div className="mb-8">
        <PayoutTable initialStatus="REQUESTED" />
      </div>

      {/* Payout History */}
      <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Payout History</h2>
      <PayoutTable2 initialStatus={null} />
    </div>
  );
};

export default PayoutRequestView;

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, Wallet } from 'lucide-react';
import WithdrawFundsModal from './components/WithdrawFundsModal';
import Skeleton from '../../../../components/common/Skeleton';
import { usePaymentsData } from '../../../../features/organizer/payments/hooks';
import { fetchPayoutHistory } from '../../../../features/organizer/payments/paymentService';

const iconMap = {
  DollarSign,
  TrendingUp,
  Download,
  Wallet,
};

const statusStyles = {
  APPROVED: 'text-green-600',
  REQUESTED: 'text-orange-500',
  REJECTED: 'text-red-500',
  PAID: 'text-green-600',
};

const PaymentView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [payouts, setPayouts] = useState([]);
  const [payoutMeta, setPayoutMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [payoutLoading, setPayoutLoading] = useState(true);
  const [payoutError, setPayoutError] = useState('');

  const { stats, statesAmount, loading, error, signal, setSignal } = usePaymentsData();

  const handleWithdrawalSuccess = () => {
    window.location.reload();
  };

  // Fetch payout history when page changes
  useEffect(() => {
    const fetchPayouts = async () => {
      setPayoutLoading(true);
      setPayoutError('');

      try {
        const result = await fetchPayoutHistory({ page, limit: 10 });
        setPayouts(result.transactions);
        setPayoutMeta(result.meta);
      } catch (err) {
        console.error('Failed to fetch payouts:', err);
        setPayoutError('Failed to load payout history');
        setPayouts([]);
      } finally {
        setPayoutLoading(false);
      }
    };

    fetchPayouts();
  }, [page, signal]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Earnings & Payment</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your earnings and payment information</p>
      </div>

      {/* Stats Cards */}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
          Error loading payment data: {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <Skeleton className="mb-4 h-12 w-12 rounded-lg" />
                <Skeleton className="mb-2 h-8 w-3/5" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))
          : stats.map((stat) => {
              const Icon = iconMap[stat.icon] || DollarSign;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                  {stat.hasButton && (
                    <button
                      onClick={() => setModalOpen(true)}
                      className="mt-4 w-full rounded-lg bg-[#1FB356] py-2.5 text-sm font-semibold text-white transition hover:bg-[#188a47]"
                    >
                      Withdraw Funds
                    </button>
                  )}
                </div>
              );
            })}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Payment History</h2>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {payoutError ? (
            <p className="px-6 py-8 text-center text-sm text-red-500">{payoutError}</p>
          ) : payoutLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}
            </div>
          ) : payouts.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-500">No transactions found.</p>
          ) : (
            <>
              <div className="divide-y divide-gray-100 sm:hidden">
                {payouts.map((tx) => (
                  <div key={tx.id} className="space-y-2 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-gray-500">Date</span>
                      <span className="text-sm text-gray-900">{tx.date}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-gray-500">Method</span>
                      <span className="text-sm text-gray-900">{tx.method}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-gray-500">Amount</span>
                      <span className="text-sm font-semibold text-gray-900">{tx.amount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-gray-500">Status</span>
                      <span
                        className={`text-sm font-medium ${statusStyles[tx.status] || 'text-gray-600'}`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Method</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payouts.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900">{tx.date}</td>
                        <td className="px-6 py-4 text-gray-900">{tx.method}</td>
                        <td className="px-6 py-4 text-gray-900">{tx.amount}</td>
                        <td
                          className={`px-6 py-4 font-medium ${statusStyles[tx.status] || 'text-gray-600'}`}
                        >
                          {tx.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {payouts.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-gray-600">
                Showing {payouts.length === 0 ? 0 : (page - 1) * 10 + 1} to{' '}
                {Math.min(page * 10, payoutMeta.total)} of {payoutMeta.total} results
              </p>
              <div className="grid grid-cols-3 items-center gap-2 sm:flex">
                <button
                  type="button"
                  disabled={!payoutMeta.hasPreviousPage || payoutLoading}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="min-w-20 text-center text-sm font-medium text-gray-700">
                  Page {payoutMeta.page} of {payoutMeta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={!payoutMeta.hasNextPage || payoutLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <WithdrawFundsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        availableBalance={Number(statesAmount?.availableBalance) || 0}
        onSuccess={handleWithdrawalSuccess}
      />
    </div>
  );
};

export default PaymentView;

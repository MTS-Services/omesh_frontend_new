import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `$${safeAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const toPaymentStats = (payload) => {
  const availableBalance = Number(payload?.availableBalance ?? 0);
  const pendingBalance = Number(payload?.pendingBalance ?? 0);
  // const totalEarnings = Number(payload?.totalEarnings ?? 0);
  const manualBalance = Number(payload?.manualBalance ?? 0);

  return [
    {
      label: 'Available Balance',
      value: formatCurrency(availableBalance),
      icon: 'DollarSign',
      hasButton: true,
    },

    {
      label: 'Pending Withdrawal Request',
      value: formatCurrency(pendingBalance),
      icon: 'DollarSign',
      hasButton: false,
    },
    {
      label: 'Manual Balance',
      value: formatCurrency(manualBalance),
      icon: 'DollarSign',
      hasButton: false,
    },
  ];
};

// API Integration: Organizer Payments API
export const fetchPaymentsData = async ({ signal } = {}) => {
  const response = await request({
    method: 'GET',
    url: ENDPOINT.ORGANIZER.PAYMENTS.PAYOUTS_STATES,
    signal,
  });

  const payload = response?.data?.data ?? response?.data ?? response ?? {};

  return {
    stats: toPaymentStats(payload),
    transactions: Array.isArray(payload?.transactions) ? payload.transactions : [],
    singleValue: payload ?? {},
  };
};

export const fetchPayoutHistory = async ({ page = 1, limit = 10, signal } = {}) => {
  const response = await request({
    method: 'GET',
    url: '/api/v1/pay-request/my-payouts',
    params: {
      page,
      limit,
    },
    signal,
  });

  const payload = response?.data ?? response ?? {};
  const data = Array.isArray(payload) ? payload : [];
  const meta = response?.meta ?? {};

  console.log('Fetched payout history:', { data, response });

  // Format transaction data to match table display
  const transactions = data.map((item) => ({
    id: item?.id ?? item?._id ?? '',
    date: item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
      : '-',
    method: item?.method ?? item?.paymentMethod ?? '-',
    amount:
      item?.amount && item?.currency
        ? `$${Number(item.amount).toFixed(2)}`
        : `$${Number(item?.amount ?? 0).toFixed(2)}`,
    status: item?.status ?? 'Pending',
  }));

  return {
    transactions,
    meta: {
      page: meta.page ?? page,
      limit: meta.limit ?? limit,
      total: meta.total ?? data.length,
      totalPages: meta.totalPages ?? 1,
      hasNextPage: meta.hasNextPage ?? false,
      hasPreviousPage: meta.hasPreviousPage ?? false,
    },
  };
};

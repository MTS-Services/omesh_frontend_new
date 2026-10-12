import React, { useEffect, useState } from 'react';
import {
  Loader2,
  Eye,
  User,
  Mail,
  Phone,
  Ticket,
  CalendarDays,
  DollarSign,
  MessageSquare,
  HeartHandshake,
  Building2,
  HandCoins,
  Gift,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  fetchSponsorRequests,
  deleteSponsorRequest,
} from '../../../../features/public/sponsor/sponsorService';
import ServerPagination from '../../../../components/ui/navigation/ServerPagination';

const PAGE_SIZE = 10;

const FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'SPONSORSHIP', label: 'Sponsorship' },
  { value: 'DONATION', label: 'Donation' },
  { value: 'IN_KIND', label: 'Hampers / Vouchers' },
];

const formatDate = (isoDate) => (isoDate ? new Date(isoDate).toLocaleDateString() : '-');
const formatAmount = (amount) => (amount != null ? `$${Number(amount).toFixed(2)}` : '-');

const TYPE_BADGES = {
  SPONSORSHIP: { label: 'Sponsorship', icon: Building2, className: 'bg-blue-50 text-blue-700' },
  DONATION: { label: 'Donation', icon: HandCoins, className: 'bg-green-50 text-green-700' },
  IN_KIND: { label: 'Hampers / Vouchers', icon: Gift, className: 'bg-purple-50 text-purple-700' },
};

const TypeBadge = ({ type }) => {
  const badge = TYPE_BADGES[type] || TYPE_BADGES.SPONSORSHIP;
  const Icon = badge.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${badge.className}`}
    >
      <Icon size={12} />
      {badge.label}
    </span>
  );
};

const PAYMENT_BADGES = {
  SUCCEEDED: { label: 'Paid', className: 'bg-green-100 text-green-700' },
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Refunded', className: 'bg-gray-100 text-gray-700' },
};

const PaymentBadge = ({ status }) => {
  const badge = PAYMENT_BADGES[status];
  if (!badge) return <span className="text-gray-400">-</span>;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}>
      {badge.label}
    </span>
  );
};

const DetailRow = ({ icon, color, label, children }) => {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-0.5 rounded-lg p-2 ${color}`}>
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <div className="font-medium break-words text-gray-800">{children}</div>
      </div>
    </div>
  );
};

const RequestModal = ({ request, onClose }) => {
  if (!request) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <TypeBadge type={request.supportType} />
            <span className="text-xs text-gray-400">{formatDate(request.createdAt)}</span>
          </div>
          <DetailRow icon={User} color="bg-indigo-50 text-indigo-500" label="Name / Company">
            {request.name}
          </DetailRow>
          <DetailRow icon={Phone} color="bg-green-50 text-green-500" label="Contact Number">
            {request.phone}
          </DetailRow>
          <DetailRow icon={Mail} color="bg-blue-50 text-blue-500" label="Email">
            {request.email}
          </DetailRow>
          <DetailRow icon={Ticket} color="bg-orange-50 text-orange-500" label="Event">
            {request.eventName || 'General support'}
          </DetailRow>
          {request.supportType === 'IN_KIND' && (
            <DetailRow icon={Gift} color="bg-purple-50 text-purple-500" label="Items Offered">
              <span className="whitespace-pre-line">{request.itemDescription || '-'}</span>
            </DetailRow>
          )}
          <DetailRow icon={DollarSign} color="bg-emerald-50 text-emerald-500" label="Amount">
            <span className="flex items-center gap-2">
              {request.amount != null ? formatAmount(request.amount) : 'No payment'}
              <PaymentBadge status={request.paymentStatus} />
            </span>
          </DetailRow>
          <DetailRow icon={MessageSquare} color="bg-gray-100 text-gray-500" label="Message">
            {request.message || '-'}
          </DetailRow>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <a
            href={`mailto:${request.email}`}
            className="flex-1 rounded-lg bg-[#1FB356] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#188a47]"
          >
            Reply by Email
          </a>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ target, isDeleting, onCancel, onConfirm }) => {
  if (!target) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={isDeleting ? undefined : onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={22} />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Delete Request</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete the request from{' '}
            <span className="font-medium text-gray-700">{target.name}</span>? This action cannot be
            undone.
          </p>
        </div>

        <div className="flex gap-3 px-6 py-5">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(target.id)}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <span className={`rounded-lg p-3 ${color}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const SponsorRequestsView = () => {
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    status: 'loading',
    rows: [],
    stats: null,
    meta: null,
    error: '',
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchSponsorRequests({
      page,
      limit: PAGE_SIZE,
      supportType: filter === 'ALL' ? undefined : filter,
      signal: controller.signal,
    })
      .then((response) => {
        setState({
          status: 'succeeded',
          rows: response?.data?.items || [],
          stats: response?.data?.stats || null,
          meta: response?.meta || null,
          error: '',
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          status: 'failed',
          error: error?.message || 'Failed to load requests.',
        }));
      });

    return () => controller.abort();
  }, [page, filter, reloadKey]);

  const { rows, meta } = state;
  const stats = state.stats || {
    total: 0,
    sponsorships: 0,
    donations: 0,
    inKind: 0,
    totalReceived: 0,
  };
  const handleFilterChange = (value) => {
    if (value === filter) return;
    setFilter(value);
    setPage(1);
    setState((prev) => ({ ...prev, status: 'loading' }));
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    setState((prev) => ({ ...prev, status: 'loading' }));
  };

  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await deleteSponsorRequest(id);
      toast.success('Request deleted successfully.');
      setDeleteTarget(null);
      if (rows.length === 1 && page > 1) {
        goToPage(page - 1);
      } else {
        setReloadKey((key) => key + 1);
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to delete request.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Sponsors &amp; Donations</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Requests"
          value={stats.total}
          icon={HeartHandshake}
          color="bg-indigo-50 text-indigo-500"
        />
        <StatCard
          label="Sponsorship Requests"
          value={stats.sponsorships}
          icon={Building2}
          color="bg-blue-50 text-blue-500"
        />
        <StatCard
          label="Donations"
          value={stats.donations}
          icon={HandCoins}
          color="bg-green-50 text-green-500"
        />
        <StatCard
          label="Hampers / Vouchers"
          value={stats.inKind}
          icon={Gift}
          color="bg-purple-50 text-purple-500"
        />
        <StatCard
          label="Total Received"
          value={formatAmount(stats.totalReceived)}
          icon={DollarSign}
          color="bg-emerald-50 text-emerald-500"
        />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-gray-100 px-4 py-3 sm:px-6">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange(value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === value
                  ? 'bg-[#1FB356] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-100 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">Name / Company</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-6 py-3 font-medium">Amount / Items</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.status === 'loading' && (
                <tr>
                  <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Loading requests...
                    </span>
                  </td>
                </tr>
              )}
              {state.status !== 'loading' && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
              {state.status !== 'loading' &&
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-800">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TypeBadge type={row.supportType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <p>{row.email}</p>
                      <p className="text-xs text-gray-400">{row.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {row.eventName || 'General support'}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      <span className="whitespace-nowrap">{formatAmount(row.amount)}</span>
                      {row.supportType === 'IN_KIND' && (
                        <span
                          className="block max-w-48 truncate text-xs text-gray-500"
                          title={row.itemDescription || ''}
                        >
                          {row.itemDescription || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentBadge status={row.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-gray-400" />
                        {formatDate(row.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="flex items-center justify-center gap-3">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="View"
                          onClick={() => setSelected(row)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          title="Delete"
                          onClick={() => setDeleteTarget({ id: row.id, name: row.name })}
                        >
                          <Trash2 size={16} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {state.status === 'failed' && (
          <div className="border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 sm:px-6">
            {state.error}
          </div>
        )}

        <ServerPagination meta={meta || {}} onPageChange={goToPage} />
      </div>

      <RequestModal request={selected} onClose={() => setSelected(null)} />

      <DeleteConfirmModal
        target={deleteTarget}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default SponsorRequestsView;

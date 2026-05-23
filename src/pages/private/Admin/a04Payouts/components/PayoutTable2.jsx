import React from 'react';
import { User, Mail, DollarSign, CreditCard, CalendarDays, Tag } from 'lucide-react';
import Skeleton from '../../../../../components/common/Skeleton';
import { usePayRequests } from '../../../../../features/admin/payRequest/usePayRequests';

const statusBadgeMap = {
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PAID: 'bg-sky-100 text-sky-700',
  REQUESTED: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-rose-100 text-rose-700',
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || '').toUpperCase();
  const badgeClass = statusBadgeMap[normalized] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
      {normalized || 'UNKNOWN'}
    </span>
  );
};

const TableHeaders = () => (
  <thead className="hidden sm:table-header-group">
    <tr className="border-b border-gray-100 bg-gray-50 text-left text-sm text-gray-500">
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <User size={14} />
          Organizer Name
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Mail size={14} />
          Email
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <DollarSign size={14} />
          Amount
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <CreditCard size={14} />
          Account Number
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          Date
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Tag size={14} />
          Action
        </span>
      </th>
    </tr>
  </thead>
);

const PayoutTable2 = ({ initialStatus = null }) => {
  const { items, total, status, page, totalPages, nextPage, prevPage } =
    usePayRequests(initialStatus);

  const limit = 10;
  const start = (page - 1) * limit;
  const end = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHeaders />
          <tbody className="block sm:table-row-group">
            {status === 'loading' ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hidden sm:table-row">
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              items.map((row) => (
              <tr
                key={row.id}
                className="m-2 block border border-gray-100 bg-white hover:bg-gray-50 sm:m-0 sm:table-row sm:border-0 sm:border-b sm:border-gray-50"
              >
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-800 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <User size={12} />
                    Organizer Name
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} className="shrink-0 text-gray-400" />
                    {row.organizer.fullName}
                  </span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <Mail size={12} />
                    Email
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} className="shrink-0 text-gray-400" />
                    {row.organizer.email}
                  </span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-800 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <DollarSign size={12} />
                    Amount
                  </span>
                  <span className="inline-flex items-center gap-1.5">{row.amount}</span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <CreditCard size={12} />
                    Account Number
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CreditCard size={14} className="shrink-0 text-gray-400" />
                    {row.accountNumber}
                  </span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <CalendarDays size={12} />
                    Date
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} className="shrink-0 text-gray-400" />
                    {new Date(row.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="flex items-center justify-between px-4 py-2.5 sm:table-cell sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <Tag size={12} />
                    Action
                  </span>
                  <StatusBadge status={row.status} />
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-green-600">{start + 1}</span> to{' '}
          <span className="font-medium text-green-600">{end}</span> of {total} results
        </p>
        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="rounded-lg border px-4 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="rounded-lg border px-4 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutTable2;

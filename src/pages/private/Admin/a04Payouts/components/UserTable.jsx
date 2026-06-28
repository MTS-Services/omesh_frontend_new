import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, CalendarDays, Tag, Trash2, Loader2 } from 'lucide-react';
import { useUsers } from '../../../../../hooks/useUsers';
import Skeleton from '../../../../../components/common/Skeleton';
import ConfirmModal from './ConfirmModal';
import { API_CONFIG } from '../../../../../api/config/constants';

const statusStyles = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  BANNED: 'bg-red-100 text-red-700',
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || '').toUpperCase();
  const style = statusStyles[normalized] || 'bg-gray-100 text-gray-700';
  const label = normalized
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`inline-block rounded-lg px-3 py-1.5 text-sm font-medium ${style}`}>
      {label || 'Unknown'}
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
          <Phone size={14} />
          Phone
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={14} />
          Total Events
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          Joined
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

const UserTable = ({ initialRole = 'ORGANIZER' }) => {
  const { items, total, page, totalPages, status, actionLoading, nextPage, prevPage, deleteUser } =
    useUsers(initialRole);

  const [confirmTarget, setConfirmTarget] = useState(null); // { id, fullName } | null

  const limit = 10;
  const start = (page - 1) * limit;
  const end = Math.min(page * limit, total);

  const openDeleteModal = (userId, name) => setConfirmTarget({ id: userId, fullName: name });
  const closeDeleteModal = () => setConfirmTarget(null);

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    await deleteUser(confirmTarget.id);
    setConfirmTarget(null);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHeaders />
          <tbody className="block sm:table-row-group">
            {status === 'loading' ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hidden sm:table-row">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </td>
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
                      <User size={12} /> Organizer Name
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {row.avatarUrl ? (
                        <img
                          src={`${API_CONFIG.BASE_URL}${row.avatarUrl}`}
                          alt={row.fullName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User size={14} className="shrink-0 text-gray-400" />
                      )}
                      {row.fullName}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <Mail size={12} /> Email
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {/* <Mail size={14} className="shrink-0 text-gray-400" /> */}
                      {row.email}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <Phone size={12} /> Phone
                    </span>
                    <span className="inline-flex items-center gap-1.5">{row.phone || '—'}</span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      Total Events
                    </span>
                    {/* <StatusBadge status={row.status} /> */}
                    <span className="inline-flex items-center gap-1.5">{row.totalEvents}</span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <CalendarDays size={12} /> Joined
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {/* <CalendarDays size={14} className="shrink-0 text-gray-400" /> */}
                      {new Date(row.joinedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="flex items-center justify-between gap-2 px-4 py-2.5 sm:table-cell sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <Tag size={12} /> Action
                    </span>
                    <button
                      onClick={() => openDeleteModal(row.id, row.fullName)}
                      disabled={!!actionLoading[row.id]}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                    >
                      {actionLoading[row.id] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-green-600">{total === 0 ? 0 : start + 1}</span>{' '}
          to <span className="font-medium text-green-600">{end}</span> of {total} results
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

      <ConfirmModal
        isOpen={!!confirmTarget}
        title="Delete this organizer?"
        message={
          confirmTarget
            ? `"${confirmTarget.fullName}" ke permanently delete kora hobe. Eta undo kora jabe na.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={confirmTarget ? !!actionLoading[confirmTarget.id] : false}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default UserTable;

import React, { useEffect, useState } from 'react';
import { Eye, User, Mail, Phone, CalendarDays, Hash, Ticket, X, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminToolkitRequests } from '../../../../features/admin/toolkit/toolkitAPI';
import { API_CONFIG } from '../../../../api/config/constants';

const OrganizerModal = ({ organizer, onClose }) => {
  if (!organizer) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Organizer Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-indigo-50 p-2 text-indigo-500">
              <User size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="font-medium text-gray-800">{organizer.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-500">
              <Mail size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="font-medium text-gray-700">{organizer.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-green-50 p-2 text-green-500">
              <Phone size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Phone Number</p>
              <p className="font-medium text-gray-700">{organizer.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-orange-50 p-2 text-orange-500">
              <Ticket size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Event Name</p>
              <p className="font-medium text-gray-700">{organizer.event}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-purple-50 p-2 text-purple-500">
              <CalendarDays size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Event Date</p>
              <p className="font-medium text-gray-700">{organizer.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-gray-100 p-2 text-gray-500">
              <Hash size={16} />
            </span>
            <div>
              <p className="text-xs text-gray-400">Quantity</p>
              <p className="font-medium text-gray-700">{organizer.qty}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-6 pb-5">
          {(organizer.images || []).slice(0, 4).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="overflow-hidden rounded-xl border border-gray-100"
            >
              <img
                src={`${API_CONFIG.BASE_URL}/${image}`}
                alt={`Organizer item ${index + 1}`}
                className="h-24 w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  return new Date(isoDate).toLocaleDateString();
};

const ToolkitView = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  const { items, total, limit, totalPages, status, error, hasNextPage, hasPreviousPage } =
    useSelector((state) => state.adminToolkit);

  useEffect(() => {
    dispatch(
      fetchAdminToolkitRequests({
        page,
        limit: 10,
      })
    );
  }, [dispatch, page]);

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <div className="">
      <h1 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Organizer Toolkit</h1>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-gray-100 bg-gray-100 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} />
                    Name
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
                    Phone Number
                  </span>
                </th>
                <th className="px-6 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Ticket size={14} />
                    Event Name
                  </span>
                </th>
                <th className="px-6 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    Event Date
                  </span>
                </th>
                <th className="px-6 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Hash size={14} />
                    Quantity
                  </span>
                </th>
                <th className="px-6 py-3 font-medium">
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <Eye size={14} />
                    Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {status === 'loading' && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Loading toolkit requests...
                    </span>
                  </td>
                </tr>
              )}

              {status !== 'loading' && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                    No toolkit requests found.
                  </td>
                </tr>
              )}

              {items.map((row) => (
                <tr
                  key={row.id}
                  className="m-2 block border border-gray-100 bg-white hover:bg-gray-50 sm:m-0 sm:table-row sm:border-0 sm:border-b sm:border-gray-50"
                >
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-800 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <User size={12} />
                      Name
                    </span>
                    <span className="inline-flex items-center gap-1.5 sm:gap-0">
                      <User size={14} className="text-gray-400 sm:hidden" />
                      {row.submitter?.fullName || row.fullName || '-'}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <Mail size={12} />
                      Email
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={14} className="shrink-0 text-gray-400" />
                      {row.submitter?.email || row.email || '-'}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <Phone size={12} />
                      Phone Number
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} className="shrink-0 text-gray-400" />
                      {row.phone || '-'}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <Ticket size={12} />
                      Event Name
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Ticket size={14} className="shrink-0 text-gray-400" />
                      {row.eventName || '-'}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <CalendarDays size={12} />
                      Event Date
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} className="shrink-0 text-gray-400" />
                      {formatDate(row.eventDate)}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                      <Hash size={12} />
                      Quantity
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Hash size={14} className="text-gray-400" />
                      {row.quantity ?? '-'}
                    </span>
                  </td>
                  <td className="flex items-center justify-between px-4 py-2.5 sm:table-cell sm:px-6 sm:py-4 sm:text-center">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Action</span>
                    <button
                      className="mx-auto flex items-center justify-center text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setSelectedOrganizer({
                          name: row.submitter?.fullName || row.fullName || '-',
                          email: row.submitter?.email || row.email || '-',
                          phone: row.phone || '-',
                          event: row.eventName || '-',
                          date: formatDate(row.eventDate),
                          qty: row.quantity ?? '-',
                          images:
                            Array.isArray(row.designImageUrls) && row.designImageUrls.length > 0
                              ? row.designImageUrls
                              : [
                                  '/img/random/Marathon.png',
                                  '/img/random/Frame 13.png',
                                  '/img/random/Frame 50.png',
                                  '/img/random/Frame 49.png',
                                ],
                        })
                      }
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {status === 'failed' && (
          <div className="border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 sm:px-6">
            {error || 'Failed to load toolkit requests.'}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="text-sm text-green-600">
            Showing {start} to {end} of {total} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || !hasPreviousPage}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || !hasNextPage}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <OrganizerModal organizer={selectedOrganizer} onClose={() => setSelectedOrganizer(null)} />
    </div>
  );
};

export default ToolkitView;

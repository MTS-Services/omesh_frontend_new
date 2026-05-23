import React, { useMemo, useState } from 'react';
import { Eye, Trash2, CalendarDays, User, Calendar, MapPin, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterTableData from '../components/FilterTableData';
import DeleteEventModal from '../components/DeleteEventModal';
import { useAdminRequestedEvents } from '../../../../../features/admin/requestedEvents/hooks';
import { toast } from 'react-toastify';
import { formatLocationWithCountry } from '../../../../../utils/eventUtils';

const ITEMS_PER_PAGE = 10;
const getSortQuery = (sortBy) => {
  if (sortBy === 'name-asc') return { sortBy: 'title', sortOrder: 'asc' };
  if (sortBy === 'name-desc') return { sortBy: 'title', sortOrder: 'desc' };
  if (sortBy === 'date-desc') return { sortBy: 'createdAt', sortOrder: 'desc' };
  if (sortBy === 'title-asc') return { sortBy: 'title', sortOrder: 'asc' };
  return { sortBy: 'createdAt', sortOrder: 'asc' };
};

const ApprovedEventsView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [deleteEventTitle, setDeleteEventTitle] = useState('');

  const sortQuery = useMemo(() => getSortQuery(sortBy), [sortBy]);
  const query = useMemo(
    () => ({
      status: 'APPROVED',
      search: search || undefined,
      createdAfter: dateFilter || undefined,
      page,
      limit: ITEMS_PER_PAGE,
      sortBy: sortQuery.sortBy,
      sortOrder: sortQuery.sortOrder,
    }),
    [dateFilter, page, sortQuery, search]
  );

  console.log('ApprovedEventsView Rendered with query:', query, dateFilter);

  const { events, total, currentLimit, loading, error, deleteEvent } =
    useAdminRequestedEvents(query);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleDateChange = (value) => {
    setPage(1);
    setDateFilter(value);
  };

  const handleSortChange = (value) => {
    setPage(1);
    setSortBy(value);
  };

  const handleDelete = (eventId, eventTitle) => {
    setDeleteEventId(eventId);
    setDeleteEventTitle(eventTitle);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async (eventId) => {
    try {
      // 2. API call
      await deleteEvent(eventId).unwrap();

      // 3. Success hole Model close koro ebong state reset koro
      setIsDeleteOpen(false);
      setDeleteEventId(null);
      setDeleteEventTitle('');

      // 4. Success Toast dekhano
      toast.success('Event deleted successfully!');
    } catch (error) {
      // 5. Fail hole Toast-e error dekhano
      const errorMessage = error?.data?.message || 'Failed to delete event';
      toast.error(errorMessage);

      // Catch block-e model close kora hobe na, jate user retry korte pare
    }
  };
  const handleCancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteEventId(null);
    setDeleteEventTitle('');
  };

  const limit = currentLimit || ITEMS_PER_PAGE;
  const displayedTotal = Math.max(0, total || 0);
  const totalPages = Math.max(1, Math.ceil(displayedTotal / limit));
  const start = displayedTotal === 0 ? 0 : (page - 1) * limit + 1;
  const end = displayedTotal === 0 ? 0 : Math.min(page * limit, displayedTotal);

  return (
    <div className="mt-4 rounded-lg border border-gray-100 bg-white shadow-sm md:mt-6">
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-gray-900">Listings Approved Event</h2>
          <FilterTableData
            search={search}
            onSearchChange={handleSearchChange}
            dateFilter={dateFilter}
            onDateChange={handleDateChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-gray-100 bg-gray-100 text-left text-gray-500">
              <th className="px-6 py-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Title
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  Name
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Date
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  Location
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <Settings2 size={14} />
                  Action
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {loading ? (
              <tr className="m-2 block border-2 border-dashed border-gray-200 sm:table-row">
                <td
                  colSpan={5}
                  className="block px-6 py-12 text-center text-sm text-gray-400 sm:table-cell"
                >
                  Loading approved events...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr className="m-2 block border-2 border-dashed border-gray-200 sm:table-row">
                <td
                  colSpan={5}
                  className="block px-6 py-12 text-center text-sm text-gray-400 sm:table-cell"
                >
                  No events found matching your filters.
                </td>
              </tr>
            ) : (
              events.map((event, i) => (
                <tr
                  key={event.id}
                  className={`m-2 block border border-gray-100 bg-white hover:bg-gray-50 sm:mb-0 sm:table-row sm:rounded-none sm:border-0 sm:border-b sm:border-gray-50 sm:hover:bg-gray-100 ${
                    i % 2 === 0 ? 'sm:bg-white' : 'sm:bg-gray-50'
                  }`}
                >
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-700 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Title</span>
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                        <CalendarDays size={14} className="text-green-500" />
                      </span>
                      {event.title}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-700 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Name</span>
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <User size={14} className="text-gray-500" />
                      </span>
                      {event?.organizer?.fullName}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Date</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="shrink-0 text-gray-400" />
                      {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-700 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Location</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="shrink-0 text-gray-400" />
                      {formatLocationWithCountry(event.location, event.country || event.flag)}
                    </span>
                  </td>
                  <td className="flex items-center justify-between px-4 py-2.5 sm:table-cell sm:px-6 sm:py-4">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Action</span>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/dash/events/${event.id}`}
                        state={{ from: '/dash/events/approved' }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="text-red-400 transition-colors hover:text-red-600"
                        title="Delete event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm text-green-600">
          Showing {start} to {end} of {displayedTotal} results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <DeleteEventModal
        isOpen={isDeleteOpen}
        eventId={deleteEventId}
        eventTitle={deleteEventTitle}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ApprovedEventsView;

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrgEventCard from './components/OrgEventCard';
import Skeleton from '../../../../components/common/Skeleton';
import DeleteEventModal from './components/DeleteEventModal';
import { TABS } from '../../../../constants/event';
import { useEventsList } from '../../../../features/organizer/events/hooks';
import { deleteEventService } from '../../../../features/organizer/events/eventService';
import { handleApiError } from '../../../../api/errorHandler';

const EventView = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => location.state?.from ?? 'all');
  const [eventsList, setEventsList] = useState([]);
  const [deleteEvent, setDeleteEvent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { events, loading, error, meta, setSignal } = useEventsList(activeTab, page);

  useEffect(() => {
    if (Array.isArray(events)) {
      setEventsList(events);
    }
  }, [events]);

  // Reset to page 1 when activeTab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // const filtered = filterEventsByTab(eventsList, activeTab);

  const openCreate = () => {
    navigate('/org/create');
  };

  const openEdit = (event) => {
    navigate('/org/create', { state: { event } });
  };

  const openDelete = (event) => {
    setDeleteEvent(event);
  };

  const handleDelete = async (eventId) => {
    if (!eventId || deleteLoading) return;

    setDeleteLoading(true);
    try {
      await deleteEventService(eventId);
      setEventsList((prev) => prev.filter((event) => event.id !== eventId));
      toast.success('Event deleted successfully');
      setSignal((prev) => (prev ? `${prev}-refetch` : 'refetch'));
      setDeleteEvent(null);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    const placeholders = Array.from({ length: 8 });
    return (
      <div className="mt-4">
        <div className="grid-wrap grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {placeholders.map((_, i) => (
            <div
              key={`ph-${i}`}
              className="overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition hover:ring-gray-200"
            >
              <div className="flex h-full flex-col">
                <div className="relative h-28 w-full shrink-0 sm:h-40">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex grow flex-col p-3 sm:p-4">
                  <Skeleton className="mb-3 h-4 w-3/4" />
                  <Skeleton className="mb-2 h-3 w-1/2" />
                  <div className="mt-auto flex items-center gap-2">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            Welcome to Your Organizer Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create events, manage training plans, and track your participants—all in one place.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
        >
          Create Event
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {events.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
          No events found.
        </div>
      ) : (
        <>
          <div className="grid-wrap grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <OrgEventCard
                key={event.id}
                event={event}
                onEdit={openEdit}
                onDelete={openDelete}
                detailState={{ from: activeTab }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing {eventsList.length === 0 ? 0 : (page - 1) * 10 + 1} to{' '}
              {Math.min(page * 10, meta.total || eventsList.length)} of{' '}
              {meta.totalItems || eventsList.length} results
            </p>
            <div className="grid grid-cols-3 items-center gap-2 sm:flex">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="min-w-20 text-center text-sm font-medium text-gray-700">
                Page {page} of {meta.totalPages || 1}
              </span>
              <button
                type="button"
                disabled={page >= (meta.totalPages || 1) || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <DeleteEventModal
        isOpen={Boolean(deleteEvent)}
        eventId={deleteEvent?.id}
        eventTitle={deleteEvent?.title ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteEvent(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default EventView;

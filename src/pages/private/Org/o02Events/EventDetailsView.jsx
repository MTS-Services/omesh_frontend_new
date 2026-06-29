import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

import EventHeroGallery from './components/EventHeroGallery';
import EventInfoPanel from './components/EventInfoPanel';
import RegistrationStats from './components/RegistrationStats';
import QuickActions from './components/QuickActions';
import ParticipantList from './components/ParticipantList';
import AddParticipantModal from './components/AddParticipantModal';
import Modal from '../../../../components/common/Modal';
import { request } from '../../../../api/request';
import { ENDPOINT } from '../../../../api/config/endpoints';
// import { useEventDetails } from '../../../../features/organizer/events/hooks';
import { resolveImageUrl } from '../../../../utils/images';
import { formatLocationWithCountry } from '../../../../utils/eventUtils';

// Convert Tailwind width class (e.g. "w-[85%]") to CSS value for inline style
const toProgressWidth = (progressClass) => {
  if (!progressClass) return '0%';
  if (progressClass === 'w-full') return '100%';
  const bracket = progressClass.match(/w-\[(.+)\]/);
  if (bracket) return bracket[1];
  const frac = progressClass.match(/w-(\d+)\/(\d+)/);
  if (frac) return `${Math.round((parseInt(frac[1]) / parseInt(frac[2])) * 100)}%`;
  return '0%';
};

const formatDateTimeLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${datePart} - ${timePart}`;
};

const extractEventPayload = (value) => {
  if (!value || typeof value !== 'object') return null;

  if (Array.isArray(value)) return value[0] || null;
  if (value.id) return value;
  if (value.event && typeof value.event === 'object') return value.event;
  if (value.data && typeof value.data === 'object') {
    if (value.data.id) return value.data;
    if (value.data.event && typeof value.data.event === 'object') return value.data.event;
    if (value.data.result && typeof value.data.result === 'object') return value.data.result;
  }
  if (value.result && typeof value.result === 'object') return value.result;
  if (value.payload && typeof value.payload === 'object') return value.payload;

  return value;
};

const normalizeEventImages = (eventValue) => {
  const eventPayload = extractEventPayload(eventValue);
  const imageSource =
    eventPayload?.gallery ||
    eventPayload?.images ||
    eventPayload?.data?.gallery ||
    eventPayload?.data?.images ||
    eventPayload?.event?.images ||
    [];

  return imageSource
    .map((item) => {
      if (!item) return '';
      if (typeof item === 'string') return resolveImageUrl(item);
      return resolveImageUrl(
        item.url || item.path || item.fileUrl || item.src || item.location || ''
      );
    })
    .filter(Boolean);
};

const EventDetailsView = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [participantRefreshKey, setParticipantRefreshKey] = useState(0);
  const [closeAction, setCloseAction] = useState(null);
  const [isSubmittingClose, setIsSubmittingClose] = useState(false);
  // const { event, loading, error, refetch } = useEventDetails(eventId);
  const [loading, setIsLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const backState = location.state?.from ? { from: location.state.from } : undefined;

  const fetchRevenue = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await request({
        method: 'GET',
        url: `api/v1/events/revenue/${eventId}`,
      });
      setEvent(res?.data || null);
    } catch (err) {
      console.error('Failed to fetch event details:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const handleEventFetch = async () => {
    try {
      await fetchRevenue();
    } catch (err) {
      console.error('Failed to fetch event details:', err);
    }
  };

  const refetch = async () => {
    await handleEventFetch();
  };

  useEffect(() => {
    handleEventFetch();
  }, [eventId, fetchRevenue]);

  const handleQuickAction = (key) => {
    if (key === 'closed') {
      setCloseAction({
        key,
        title: isRegistrationClosed ? 'Reopen  Registration' : 'Registration Closed',
        message: isRegistrationClosed
          ? 'Do you want to reopen registration for this event?'
          : 'Do you want to close registration for this event?',
        registerClose: !isRegistrationClosed,
      });
    }

    if (key === 'complete') {
      setCloseAction({
        key,
        title: 'Marks as complete',
        message: 'Do you want to mark this event as complete?',
        complete: !event.complete,
      });
    }
  };

  const confirmCloseAction = async () => {
    if (!closeAction || !eventId) return;

    try {
      setIsSubmittingClose(true);

      const body = {};

      if (closeAction.key === 'closed') {
        body.registerClose = closeAction.registerClose;
      } else if (closeAction.key === 'complete') {
        body.complete = !event.complete;
      }

      await request({
        method: 'PATCH',
        url: ENDPOINT.ORGANIZER.EVENTS.CLOSE(eventId),
        data: body,
      });
      toast.success(
        closeAction.registerClose
          ? 'Registration closed successfully'
          : 'Registration restarted successfully'
      );
      refetch?.();
      setCloseAction(null);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to update event';
      toast.error(message);
    } finally {
      setIsSubmittingClose(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Failed to load event data</p>
      </div>
    );
  }

  const eventData = extractEventPayload(event) || event;

  // Adapt flat JSON fields to the shape sub-components expect
  const description = {
    headline: eventData.headline || eventData.eventName || eventData.title,
    bullets1: eventData.bulletsTop || eventData.bulletPoints || [],
    body: eventData.body || eventData.description || '',
    bullets2: eventData.bulletsBottom || eventData.highlights || [],
    tagline: eventData.tagline || eventData.quote || '',
  };

  const soldSeats = Math.max(
    Number(eventData.totalSeats || 0) - Number(eventData.availableSeats || 0),
    0
  );
  const totalSeats = Number(eventData.totalSeats || 0);
  const isCapacityFull = totalSeats > 0 && soldSeats >= totalSeats;
  const estimatedRevenue = soldSeats * Number(eventData.price || 0);
  const progressPct = totalSeats > 0 ? Math.round((soldSeats / totalSeats) * 100) : 0;

  const stats = {
    sold: eventData.stats?.sold || `${soldSeats} / ${Number(eventData.totalSeats || 0)}`,
    revenue:
      eventData.revenue ||
      `${String(eventData.currency || 'USD').toUpperCase()} ${estimatedRevenue.toLocaleString()}`,
    remaining: eventData.stats?.remaining || String(Number(eventData.availableSeats || 0)),
    progressWidth: eventData.stats?.progressClass
      ? toProgressWidth(eventData.stats?.progressClass)
      : `${progressPct}%`,
  };

  // Determine if registration is closed or event is complete
  const isRegistrationClosed = eventData.registrationClosed || eventData.registerClose;
  const isEventComplete = eventData.isComplete || eventData.status === 'completed';

  const quickActions = eventData.quickActions || [
    {
      key: 'add',
      label: 'Add Participant Manually',
      tone: 'success',
      disabled: isRegistrationClosed || isEventComplete || isCapacityFull || event.complete,
    },
    {
      key: 'closed',
      label: isRegistrationClosed ? 'Reopen' : 'Registration Closed',
      tone: isRegistrationClosed ? 'success' : 'danger',
      disabled: isCapacityFull,
    },
    {
      key: 'complete',
      // label: 'Marks as complete',
      // tone: 'warning',
      label: event.complete ? 'In Process' : 'Marks as complete',
      tone: event.complete ? 'success' : 'warning',
      disabled: isEventComplete || isCapacityFull,
    },
  ];

  const participants = Array.isArray(eventData.participants) ? eventData.participants : [];

  const galleryImages = normalizeEventImages(eventData);
  const coverImage =
    eventData.coverImageUrl || eventData.image || eventData.coverImage || eventData.thumbnail || '';
  const resolvedGalleryImages =
    galleryImages.length > 0 ? galleryImages : coverImage ? [resolveImageUrl(coverImage)] : [];

  const dateText =
    eventData.meta?.dateTime ||
    (eventData.startAt ? formatDateTimeLabel(eventData.startAt) : eventData.date);

  const distanceText = eventData.meta?.distance || eventData.distance || '-';
  const locationText = formatLocationWithCountry(
    eventData.meta?.location || eventData.location || '-',
    eventData.country || eventData.flag
  );

  const handleParticipantAdded = () => {
    setParticipantRefreshKey((prev) => prev + 1);
    refetch?.();
  };

  return (
    <>
      <div className="mb-3">
        <Link
          to="/org/events"
          state={backState}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Link>
      </div>

      <section>
        {/* 3-col grid: image | info | sidebar */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-start lg:gap-10">
          {/* COL 1: hero + thumbnails */}
          <EventHeroGallery images={resolvedGalleryImages} flag={eventData.country} />

          {/* COL 2: title, about, meta */}
          <EventInfoPanel
            date={dateText}
            title={eventData.title}
            distance={distanceText}
            location={locationText}
            description={description}
          />

          {/* COL 3: sidebar */}
          <aside className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-start lg:sticky lg:top-20 lg:col-span-1 lg:flex-col">
            <div className="w-full md:flex-1 lg:w-full">
              <RegistrationStats stats={stats} />
            </div>
            <div className="w-full md:flex-1 lg:w-full">
              <QuickActions
                actions={quickActions}
                setModalOpen={setModalOpen}
                onAction={handleQuickAction}
              />
            </div>
          </aside>
        </div>
      </section>

      <ParticipantList
        participants={participants}
        eventId={eventId}
        refreshKey={participantRefreshKey}
      />
      <AddParticipantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        eventId={eventId}
        totalPrice={eventData.price || 0}
        location={eventData.location || ''}
        onSuccess={handleParticipantAdded}
      />

      <Modal
        open={Boolean(closeAction)}
        onClose={() => setCloseAction(null)}
        title={closeAction?.title || 'Confirm action'}
        size="md"
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setCloseAction(null)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmCloseAction}
              disabled={isSubmittingClose}
              className="rounded-lg bg-[#1FB356] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#188a47] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingClose ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-sm text-gray-600">
          <p>{closeAction?.message}</p>
        </div>
      </Modal>
    </>
  );
};

export default EventDetailsView;

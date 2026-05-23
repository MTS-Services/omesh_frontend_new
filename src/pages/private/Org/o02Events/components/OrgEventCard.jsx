import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Eye, Pencil, Trash2 } from 'lucide-react';
import { STATUS_STYLES, STATUS_LABELS } from '../../../../../constants/event';
// import getFlagEmoji from '../../../../../components/common/FlagIcon';
import { resolveImageUrl } from '../../../../../utils/images';
import SpecialCountryFlag from '../../../../../components/common/SpecialCountryFlag';
import { formatLocationWithCountry } from '../../../../../utils/eventUtils';
// import SpecialCountryFlag from '../../../../../components/common/test';

const formatTimeFromISO = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';

    const utcHour = date.getUTCHours();
    const utcMinute = date.getUTCMinutes();
    const period = utcHour >= 12 ? 'PM' : 'AM';
    const hour12 = utcHour % 12 || 12;
    const minute = String(utcMinute).padStart(2, '0');
    return `${hour12}:${minute}${period}`;
  } catch {
    return '';
  }
};

const formatDateFromISO = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '';
  }
};

const OrgEventCard = ({ event, onEdit, onDelete }) => {
  const totalSeats = Number(event?.totalSeats || 0);
  const availableSeats = Number(event?.availableSeats || 0);
  const soldSeats = Math.max(totalSeats - availableSeats, 0);
  const pct = totalSeats > 0 ? Math.min((soldSeats / totalSeats) * 100, 100) : 0;
  const statusKey = String(event.status || '')
    .trim()
    .toLowerCase();
  // Map event id to the data key used in eventDetailsData
  const detailId = String(event.id);
  const getImageUrl = (it) => {
    if (!it) return null;
    if (typeof it === 'string') return it;
    return it?.url || it?.path || it?.fileUrl || it?.src || it?.location || it?.secure_url || null;
  };

  const imageSrc = resolveImageUrl(
    getImageUrl(event?.images?.[0]) ||
      getImageUrl(event?.coverImageUrl) ||
      getImageUrl(event?.image) ||
      ''
  );

  const eventDate = formatDateFromISO(event?.startAt) || event?.date || '-';
  const eventTime = formatTimeFromISO(event?.startAt) || event?.time || '-';

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      {/* Image */}
      <div className="relative h-44 w-full">
        {imageSrc ? (
          <img src={imageSrc ||"/img/home/premium.avif"} alt={event.title}     onError={(e) => {
                if (e.currentTarget.src.includes('/img/home/premium.avif')) return;
                e.currentTarget.src = '/img/home/premium.avif';
              }} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-50" />
        )}
        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[statusKey] ?? 'bg-gray-400 text-white'}`}
        >
          {STATUS_LABELS[statusKey] ?? event.status}
        </span>
        {/* Flag */}
        {event.country && (
          <div className="absolute top-2 right-2 overflow-hidden">
            <SpecialCountryFlag name={event.country} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="mb-3 text-base font-bold text-gray-900">{event.title}</h3>

        <div className="mb-3 space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="shrink-0 text-green-500" />
            <span>
              <span className="font-semibold text-gray-800">Date:</span> {eventDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={14} className="shrink-0 text-green-500" />
            <span>
              <span className="font-semibold text-gray-800">Time:</span> {eventTime}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 shrink-0 text-green-500" />
            <span>
              <span className="font-semibold text-gray-800">Location:</span>{' '}
              {formatLocationWithCountry(event.location, event.country || event.flag)}
            </span>
          </div>
        </div>

        {/* Seat progress */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
            <span>Capacity</span>
            <span className="font-medium text-gray-800">
              {soldSeats}/{totalSeats}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/org/events/${detailId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
          >
            <Eye size={13} />
            View
          </Link>
          <button
            onClick={() => onEdit?.(event)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete?.(event)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgEventCard;

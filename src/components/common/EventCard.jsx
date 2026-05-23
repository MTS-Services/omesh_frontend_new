import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import getFlagEmoji from './FlagIcon';
import { isAuthenticated } from '../../utils/auth';
import { resolveImageUrl } from '../../utils/images';
import { formatLocationWithCountry } from '../../utils/eventUtils';

const getBarColor = (availableSeats, totalSeats, status) => {
  if (status === 'Sold Out') return 'bg-[#EB4645]';
  if (status === 'Registration Closed') return 'bg-[#D7920D]';
  const soldSeats = totalSeats - availableSeats;
  const pct = totalSeats > 0 ? soldSeats / totalSeats : 0;
  if (pct >= 0.9) return 'bg-red-500';
  if (pct >= 0.6) return 'bg-amber-400';
  return 'bg-green-500';
};

const getStatusStyle = (status) => {
  if (status === 'Sold Out') return 'bg-red-500 text-white';
  if (status === 'COMPLETED') return 'bg-green-500 text-white';
  if (status === 'Registration Closed') return 'bg-amber-400 text-white';
  return '';
};

const EventCard = ({ event }) => {
  const detailsPath = `/events/${event.id}`;
  const resolvedImage = resolveImageUrl(event.image);

  // Handle both availableSeats (organizer) and seats (public) properties
  const availableSeats = event.availableSeats ?? event.seats ?? 0;
  const totalSeats = Number(event.totalSeats) || 0;
  const soldSeats = Math.max(totalSeats - availableSeats, 0);
  const pct = totalSeats > 0 ? Math.min((soldSeats / totalSeats) * 100, 100) : 0;
  const isSoldOut = totalSeats > 0 && (availableSeats <= 0 || soldSeats >= totalSeats);
  const isRegistrationClosed = Boolean(event.registrationClosed || event.registerClose);
  const displayStatus =
    isRegistrationClosed || event.status === 'Registration Closed'
      ? 'Registration Closed'
      : isSoldOut
        ? 'Sold Out'
        : event.status === 'COMPLETED'
          ? 'COMPLETED'
          : null;
  const barColor = getBarColor(availableSeats, totalSeats, displayStatus);
  const isFull =
    displayStatus === 'Sold Out' ||
    displayStatus === 'Registration Closed' ||
    event.status === 'COMPLETED';
  const isLoggedIn = isAuthenticated();
  const registerTo = isLoggedIn ? '/events/checkout' : '/auth/register';
  const registerState = isLoggedIn
    ? {
        event: {
          id: event.id,
          title: event.title,
          image: resolveImageUrl(event.image),
          flag: event.flag,
          country: event.country,
          price: event.price,
          date: event.date,
          time: event.time,
          location: event.location,
          seats: availableSeats,
          totalSeats: event.totalSeats,
          tShirtIncluded: event.tShirtIncluded,
          tShirtImageUrls: event.tShirtImageUrls,
          tShirtImageUrl: event.tShirtImageUrl,
          tShirtSizes: event.tShirtSizes,
          tShirtPrice: event.tShirtPrice,
        },
        quantity: 1,
      }
    : undefined;

  const capacityBg =
    displayStatus === 'Sold Out'
      ? 'bg-red-500'
      : displayStatus === 'Registration Closed'
        ? 'bg-amber-100'
        : 'bg-[#414652]';

  return (
    <div className="overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition hover:ring-gray-200">
      {/* Body */}
      <div className="flex h-full flex-col">
        {/* Image */}
        <div className="relative h-28 w-full shrink-0 sm:h-40">
          <Link to={detailsPath} aria-label={`View details for ${event.title}`}>
            <img
              src={resolvedImage || '/img/home/premium.avif'}
              alt={event.title}
              onError={(e) => {
                if (e.currentTarget.src.includes('/img/home/premium.avif')) return;
                e.currentTarget.src = '/img/home/premium.avif';
              }}
              className={`h-full w-full object-cover ${event.status ? 'blur-[1px]' : ''}`}
            />
          </Link>
          {/* Flag badge */}
          {event.flag && (
            <div className="absolute top-2 right-2 overflow-hidden">{getFlagEmoji(event.flag)}</div>
          )}
          {/* Status overlay */}
          {displayStatus && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(displayStatus)}`}
              >
                {displayStatus}
              </span>
            </div>
          )}
        </div>

        <div className="flex grow flex-col p-3 sm:p-4">
          <Link to={detailsPath} className="mb-1.5 sm:mb-2">
            <h3 className="line-clamp-2 text-sm font-bold text-gray-900 hover:text-green-600 sm:text-lg lg:text-xl">
              {event.title}
            </h3>
          </Link>

          <div className="mb-2 space-y-0.5 text-xs text-gray-600 sm:mb-3">
            <div className="flex items-start gap-2 pb-1.5">
              <Calendar className="mt-0.5 h-3 w-3 shrink-0 text-green-500 sm:h-5 sm:w-5" />
              <span className="text-sx line-clamp-1 sm:text-sm">
                <span className="font-semibold text-gray-800">Date:</span> {event.date}
              </span>
            </div>
            <div className="flex items-center gap-2 pb-1.5">
              <Clock className="h-3 w-3 shrink-0 text-green-500 sm:h-5 sm:w-5" />
              <span className="text-sx sm:text-sm">
                <span className="font-semibold text-gray-800">Time:</span> {event.time}
              </span>
            </div>
            <div className="flex items-start gap-2 pb-1.5">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-green-500 sm:h-5 sm:w-5" />
              <span className="text-sx line-clamp-1 sm:text-sm">
                <span className="font-semibold text-gray-800">Location:</span>{' '}
                {formatLocationWithCountry(event.location, event.country || event.flag)}
              </span>
            </div>
          </div>

          {/* Seat availability */}
          <div className="mt-auto mb-2 sm:mb-3">
            <div className="mb-0.5 flex items-center justify-between text-xs">
              <span className="text-xs text-gray-700">Capacity</span>
              <span className="text-xs font-medium text-gray-800">
                {soldSeats}/{totalSeats}
              </span>
            </div>
            <div className={`h-1.5 w-full overflow-hidden rounded-full ${capacityBg}`}>
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
            <Link
              to={detailsPath}
              className={`w-full rounded-md border border-green-500 bg-[#1FB356] py-1 text-center text-sm font-medium text-white transition-colors hover:bg-[#188a47] sm:py-2`}
            >
              View Details
            </Link>
            {!isFull && (
              <Link
                to={registerTo}
                state={registerState}
                className="w-full rounded-md border border-gray-300 py-1 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:py-2"
              >
                Register Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  CalendarDays,
  MapPin,
  ArrowLeft,
  Info,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { request } from '../../../../api/request';
import { ENDPOINT } from '../../../../api/config/endpoints';
import getFlagEmoji from '../../../../components/common/FlagIcon';
import { formatDistanceValue, formatLocationWithCountry } from '../../../../utils/eventUtils';

const formatDateTimeLabel = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

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

const toEventPayload = (responseValue) => {
  if (!responseValue || typeof responseValue !== 'object') return null;
  if (responseValue.data && typeof responseValue.data === 'object') return responseValue.data;
  return responseValue;
};

const toEventImages = (event) => {
  const imageList = Array.isArray(event?.images) ? event.images : [];
  const urls = imageList
    .slice()
    .sort((a, b) => Number(a?.position || 0) - Number(b?.position || 0))
    .map((item) => item?.url)
    .filter(Boolean);

  if (urls.length > 0) return urls;
  if (event?.coverImageUrl) return [event.coverImageUrl];
  return ['/img/home/hero.jpg'];
};

// ── Component ────────────────────────────────────────────────────────────────
const EventsDetailsView = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const backTo = state?.from || '/dash/events/requested';
  const [activeImg, setActiveImg] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const stripRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEventDetails = async () => {
      if (!id) {
        setError('Event id is missing from route.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const response = await request({
          method: 'GET',
          url: ENDPOINT.ADMIN.EVENT_BY_ID(id),
        });

        const payload = toEventPayload(response);
        if (!payload?.id) {
          throw new Error('Event data is not available.');
        }

        if (isMounted) {
          setEvent(payload);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load event details.');
          setEvent(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEventDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const images = toEventImages(event);

  useEffect(() => {
    if (activeImg >= images.length) {
      setActiveImg(0);
    }
  }, [activeImg, images.length]);

  const updateScrollButtons = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      ro.disconnect();
    };
  }, [updateScrollButtons, images.length]);

  const scrollStrip = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 120, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section className="mx-auto mt-8 max-w-7xl">
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Loading event details...</p>
        </div>
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-4">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm text-gray-600"
          >
            <ArrowLeft size={14} />
            <span>Back to Events</span>
          </Link>
        </div>
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">{error || 'Failed to load event details.'}</p>
        </div>
      </section>
    );
  }

  const description = {
    headline: event.headline || event.title || '-',
    bullets1: Array.isArray(event.bulletsTop) ? event.bulletsTop : [],
    body: event.body || '-',
    bullets2: Array.isArray(event.bulletsBottom) ? event.bulletsBottom : [],
    tagline: event.tagline || '',
  };

  const dateLabel = formatDateTimeLabel(event.startAt);
  const countryCode =
    typeof event.country === 'string' && event.country.trim().length === 2
      ? event.country.trim().toUpperCase()
      : '';

  return (
    <section className="mx-auto mt-8 max-w-7xl">
      <div className="mb-4">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm text-gray-600"
        >
          <ArrowLeft size={14} />
          <span>Back to Events</span>
        </Link>
      </div>
      {/* Main two-column grid */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
        {/* ── LEFT: images ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative overflow-hidden rounded">
            <img
              src={images[activeImg] || images[0]}
              alt={event.title || 'Event image'}
              className="h-[40vh] w-full object-cover sm:h-[50vh]"
            />
            {countryCode && (
              <div className="absolute top-3 right-3 overflow-hidden rounded shadow">
                {getFlagEmoji(countryCode)}
              </div>
            )}
          </div>

          {/* Thumbnail strip with slider buttons */}
          <div className="relative">
            {/* Left button */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollStrip(-1)}
                aria-label="Scroll thumbnails left"
                className="absolute top-1/2 left-0 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 transition hover:bg-gray-50 sm:h-7 sm:w-7"
              >
                <ChevronLeft size={14} />
              </button>
            )}

            {/* Scrollable strip */}
            <div
              ref={stripRef}
              className="scrollbar-none flex gap-2 overflow-x-auto pb-1 sm:gap-2.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-24 sm:w-24 md:h-28 md:w-28 ${
                    idx === activeImg
                      ? 'border-green-500 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Right button */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollStrip(1)}
                aria-label="Scroll thumbnails right"
                className="absolute top-1/2 right-0 z-10 flex h-6 w-6 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 transition hover:bg-gray-50 sm:h-7 sm:w-7"
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: info ── */}
        <div className="space-y-3 sm:space-y-4">
          {/* About */}
          <h1 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">
            {event.title}
          </h1>
          <h5 className="flex items-center gap-2 text-sm font-medium text-gray-900 sm:text-base">
            <span>
              <Info className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
            </span>
            <span>About This Experience</span>
          </h5>

          <div className="space-y-3 text-xs text-gray-700 sm:space-y-4 sm:text-sm">
            <p className="font-semibold text-gray-500">{description.headline}</p>
            <ul className="list-disc space-y-1">
              {description.bullets1.map((b, idx) => (
                <li key={`${b}-${idx}`} className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 shrink-0 text-green-500 sm:h-4 sm:w-4" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p>{description.body}</p>
            <ul className="list-disc space-y-1">
              {description.bullets2.map((b, idx) => (
                <li key={`${b}-${idx}`} className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 shrink-0 text-green-500 sm:h-4 sm:w-4" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="font-medium text-gray-800">{description.tagline}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs sm:gap-6 sm:text-sm">
            {/* Date & Time */}
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-2 sm:mb-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                <span className="font-semibold text-gray-900">Date & Time:</span>
              </div>
              <span className="ml-6 text-sm text-gray-600">{dateLabel}</span>
            </div>

            {/* Distance */}
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-2 sm:mb-2">
                <MapPin className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                <span className="font-semibold text-gray-900">Distance</span>
              </div>
              <span className="ml-6 text-sm text-gray-600">{formatDistanceValue(event.distance)}</span>
            </div>

            {/* Location - Full width */}
            <div className="col-span-2 flex flex-col">
              <div className="mb-1 flex items-center gap-2 sm:mb-2">
                <MapPin className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                <span className="font-semibold text-gray-900">Location</span>
              </div>
              <span className="ml-6 text-sm text-gray-600">{formatLocationWithCountry(event.location, event.country || event.flag)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsDetailsView;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  CalendarDays,
  MapPin,
  Copy,
  Twitter,
  ArrowLeft,
  Facebook,
  Info,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import getFlagEmoji from '../../../components/common/FlagIcon';
import { selectIsAuthenticated } from '../../../features/auth/selectors';
import { usePublicEventDetails, usePublicEventsList } from '../../../features/public/events/hooks';
import { selectPublicEventById } from '../../../features/public/events/selectors';
import { resolveImageUrl } from '../../../utils/images';
import { formatLocationWithCountry } from '../../../utils/eventUtils';

// ── Component ────────────────────────────────────────────────────────────────
const DetailsView = () => {
  const { id } = useParams();
  const eventId = String(id ?? '').trim();

  const { loading: listLoading } = usePublicEventsList();
  const { event: detailEvent, loading: detailLoading, error } = usePublicEventDetails(eventId);
  const listEvent = useSelector(selectPublicEventById(eventId));
  const event = detailEvent ?? listEvent;
  const loading = listLoading || detailLoading;

  const [activeImgById, setActiveImgById] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const stripRef = useRef(null);
  const activeImg = activeImgById[eventId] ?? 0;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Look at this!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/events/checkout', {
      state: {
        event: {
          id: event.id,
          title: event.title,
          image: event.image,
          flag: event.flag,
          country: event.country,
          price: event.price,
          date: event.date,
          time: event.time,
          location: event.location,
          seats: event.seats,
          totalSeats: event.totalSeats,
          tShirtIncluded: event.tShirtIncluded,
          tShirtImageUrls: event.tShirtImageUrls,
          tShirtImageUrl: event.tShirtImageUrl,
          tShirtSizes: event.tShirtSizes,
          tShirtPrice: event.tShirtPrice,
        },
        quantity,
      },
    });
  };

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
  }, [updateScrollButtons]);

  const scrollStrip = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 120, behavior: 'smooth' });
  };

  const setActiveImg = (index) => {
    setActiveImgById((current) => ({
      ...current,
      [eventId]: index,
    }));
  };

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(window.location.href).catch(() => {});
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 1500);
  // };

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => q + 1);

  const getStatusStyle = (status) => {
    if (status === 'Sold Out') return 'bg-red-300 text-white';
    if (status === 'COMPLETED') return 'bg-green-300 text-white';
    if (status === 'Registration Closed') return 'bg-yellow-100 text-gray-400';
    return '';
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-400">Loading…</div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-lg font-medium">Failed to load event.</p>
        <Link to="/events" className="text-sm text-green-600 hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-400">Loading…</div>
    );
  }

  const images = (event.images?.length ? event.images : [event.image])
    .map(resolveImageUrl)
    .filter(Boolean);
  const d = event.description ?? {};
  const organizer = event.organizer ?? {};

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-3">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </div>

        <div>
          {/* 3-col grid: image | info | sidebar */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
            {/* COL 1: hero + thumbnails */}
            <div className="w-full space-y-3 lg:max-w-[50%]">
              {/* Main image */}
              <div className="relative overflow-hidden rounded">
                <img
                  src={images[activeImg] || '/img/home/premium.avif'}
                  alt={event.title}
                  onError={(e) => {
                    if (e.currentTarget.src.includes('/img/home/premium.avif')) return;
                    e.currentTarget.src = '/img/home/premium.avif';
                  }}
                  className="h-[40vh] w-full object-cover sm:h-[50vh]"
                />
                {event.flag && (
                  <div className="absolute top-3 right-3 overflow-hidden">
                    {getFlagEmoji(event.flag)}
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
                        src={src || '/img/home/premium.avif'}
                        alt={`Thumbnail ${idx + 1}`}
                        onError={(e) => {
                          if (e.currentTarget.src.includes('/img/home/premium.avif')) return;
                          e.currentTarget.src = '/img/home/premium.avif';
                        }}
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
            <div className="w-full space-y-3 sm:space-y-4 lg:max-w-[50%]">
              {/* About */}
              <h1 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">
                {event.title}
              </h1>
              <h5 className="flex items-center gap-2 text-sm text-gray-700 sm:text-base">
                <span>
                  <Info className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                </span>
                <span>About This Experience</span>
              </h5>

              <div className="space-y-3 text-xs text-gray-700 sm:space-y-4 sm:text-base">
                <p className="text-sm text-gray-700 sm:text-base">{d.headline}</p>
                <ul className="list-disc space-y-1">
                  {(d.bullets1 ?? []).map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 shrink-0 text-green-500 sm:h-4 sm:w-4" />
                      <span className="text-sm sm:text-base">{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm wrap-break-word whitespace-pre-wrap sm:text-base">{d.body}</p>
                <ul className="list-disc space-y-1">
                  {(d.bullets2 ?? []).map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 shrink-0 text-green-500 sm:h-4 sm:w-4" />
                      <span className="text-sm sm:text-base">{b}</span>
                    </li>
                  ))}
                </ul>
                <hr className="border-gray-200" />
                <p className="text-sm sm:text-base">{d.tagline}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4 text-xs sm:gap-6 sm:text-sm md:grid-cols-3">
                {/* Date & Time */}
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-2 sm:mb-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                    <span className="font-semibold text-gray-900">Date & Time:</span>
                  </div>
                  <span className="ml-6 text-sm text-gray-600">
                    {event.date} · {event.time}
                  </span>
                </div>

                {/* Distance */}
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-2 sm:mb-2">
                    <MapPin className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                    <span className="font-semibold text-gray-900">Distance</span>
                  </div>
                  <span className="ml-6 text-sm text-gray-600">{event.distance}</span>
                </div>

                {/* Location - Full width */}
                <div className="flex flex-col">
                  <div className="mb-1 flex items-center gap-2 sm:mb-2">
                    <MapPin className="h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />
                    <span className="font-semibold text-gray-900">Location</span>
                  </div>
                  <span className="ml-6 text-sm text-gray-600">
                    {formatLocationWithCountry(event.location, event.flag || event.country)}
                  </span>
                </div>
              </div>

              {/* Price */}
              <h2 className="text-2xl text-green-500 sm:text-3xl">
                ${event.price?.toLocaleString()} USD
              </h2>

              <hr className="border-gray-200" />

              {/* Quantity + Register + Share */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {/* Left group: Quantity + Register — only when registration is open */}
                {event.status === 'APPROVED' && event.availableSeats > 0 && !event.registerClose ? (
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Quantity Stepper */}
                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={dec}
                        aria-label="Decrease quantity"
                        className="px-2 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 active:bg-gray-200 sm:px-3 sm:py-2"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-xs font-semibold text-gray-800 select-none sm:min-w-10 sm:text-sm">
                        {String(quantity).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={inc}
                        aria-label="Increase quantity"
                        disabled={quantity >= event.availableSeats}
                        className="px-2 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 active:bg-gray-200 sm:px-3 sm:py-2"
                      >
                        +
                      </button>
                    </div>

                    {/* Register Button */}
                    {isAuth ? (
                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                      >
                        Checkout
                      </button>
                    ) : (
                      <Link
                        to="/auth/login"
                        className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                      >
                        Checkout
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    {event.registerClose ? (
                      <>
                        <span
                          className={`rounded-md px-4 py-2 text-sm font-medium ${getStatusStyle(
                            'Sold Out'
                          )}`}
                        >
                          Register Close
                        </span>
                      </>
                    ) : (
                      <>
                        {event.status === 'COMPLETED' ? (
                          <span
                            className={`rounded-md px-4 py-2 text-sm font-medium ${getStatusStyle(
                              'COMPLETED'
                            )}`}
                          >
                            Completed
                          </span>
                        ) : (
                          <span
                            className={`rounded-md px-4 py-2 text-sm font-medium ${getStatusStyle(
                              'Sold Out'
                            )}`}
                          >
                            Sold out
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Right group: Share */}
                <div className="flex items-center gap-2 text-xs text-gray-500 sm:gap-3 sm:text-sm">
                  <span className="font-medium whitespace-nowrap">Share</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    title={copied ? 'Copied!' : 'Copy link'}
                    className="text-gray-500 transition hover:text-gray-700"
                  >
                    {copied ? (
                      <span className="font-semibold text-green-600">Copied!</span>
                    ) : (
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={shareOnFacebook}
                    aria-label="Share on Facebook"
                    className="transition hover:text-blue-600"
                  >
                    <Facebook className="h-4 w-4 sm:h-5 sm:w-4 sm:w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={shareOnTwitter}
                    aria-label="Share on Twitter"
                    className="transition hover:text-sky-500"
                  >
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center gap-2 pt-1 sm:gap-3">
                <img
                  src={
                    organizer.avatar ||
                    'https://media.istockphoto.com/id/517998264/vector/male-user-icon.jpg?s=170667a&w=0&k=20&c=ZUf0DE14mBsbtgTvNdhDB1uzey9CK2BJlhhMhfFftB8='
                  }
                  alt={organizer.name}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-green-400 sm:h-10 sm:w-10"
                />
                <div className="min-w-0 text-xs sm:text-sm">
                  <p className="text-xs text-gray-400">Organizer Name</p>
                  <p className="truncate font-semibold text-gray-800">{organizer.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;

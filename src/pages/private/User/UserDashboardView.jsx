import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock3, LogOut, Mail, MapPin, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '../../../features/auth/hooks';
import { toast } from 'react-toastify';
import NavbarTemplate from '../../../components/template/public/NavbarTemplate';
import FooterTemplate from '../../../components/template/public/FooterTemplate';
import { getBookedUserEvents } from '../../../features/users/userService';
import { handleApiError } from '../../../api/errorHandler';
import { formatLocationWithCountry } from '../../../utils/eventUtils';
import { resolveImageUrl } from '../../../utils/images';

const UserEventCard = ({ event }) => {
  const imageUrl =
    resolveImageUrl(
      event?.image ||
        event?.coverImageUrl ||
        event?.images?.url ||
        event?.images?.[0]?.url ||
        event?.images?.[0] ||
        ''
    ) || '';

  return (
    <article className="overflow-hidden rounded-lg bg-white ring-1 ring-gray-300 transition hover:ring-gray-200">
      <div className="flex h-full flex-col">
        <div className="relative h-20 w-full shrink-0 sm:h-40">
          <img src={imageUrl ||'/img/home/premium.avif'} alt={event.title} className="h-full w-full object-cover" />
        </div>

        <div className="flex grow flex-col p-2 sm:p-3">
          <h3 className="mb-1.5 line-clamp-2 text-sm font-bold text-gray-900 sm:mb-2 sm:text-lg md:text-2xl">
            {event.title}
          </h3>

          <div className="mb-2 space-y-0.5 text-xs text-gray-600 sm:mb-3">
            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-green-500 sm:h-5 sm:w-5" />
              <span className="line-clamp-1 sm:text-sm">
                <span className="font-semibold text-gray-800">Date:</span> {event.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-3 w-3 shrink-0 text-green-500 sm:h-5 sm:w-5" />
              <span className="sm:text-sm">
                <span className="font-semibold text-gray-800">Time:</span> {event.time}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-green-500 sm:h-5 sm:w-5" />
              <span className="line-clamp-1 sm:text-sm">
                <span className="font-semibold text-gray-800">Location:</span>{' '}
                {formatLocationWithCountry(event.location, event.country)}
              </span>
            </div>
          </div>

          <Link
            to={`/events/${event.id}`}
            className="mt-auto w-full rounded-md border border-green-500 bg-[#1FB356] py-1 text-center text-sm font-medium text-white transition-colors hover:bg-[#188a47] sm:py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

const formatDate = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const mapUpcomingEvent = (event) => ({
  id: event?.id,
  title: event?.title ?? 'Untitled Event',
  date: formatDate(event?.startAt),
  time: event?.startAt
    ? new Date(event.startAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '',
  location: event?.location ?? '',
  country: event?.country ?? event?.flag ?? '',
    image:
      resolveImageUrl(
        event?.coverImageUrl ||
          event?.image ||
          event?.thumbnail ||
          event?.images?.url ||
          event?.images?.[0]?.url ||
          event?.images?.[0] ||
          ''
      ) || '',
});

const extractEvents = (payload, key) => {
  const collection = payload?.data?.[key];

  if (!Array.isArray(collection)) {
    return [];
  }

  return collection.map(mapUpcomingEvent).filter((event) => Boolean(event.id || event.title));
};

const UserDashboardView = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadBookedEvents = async () => {
      setUpcomingLoading(true);
      setUpcomingError('');

      try {
        const response = await getBookedUserEvents({ signal: controller.signal });
        setUpcomingEvents(extractEvents(response, 'upcomingEvents'));
        setCompletedEvents(extractEvents(response, 'completedEvents'));
      } catch (error) {
        if (error?.name === 'AbortError' || error?.name === 'CanceledError') {
          return;
        }

        setUpcomingError(handleApiError(error));
        setUpcomingEvents([]);
      } finally {
        setUpcomingLoading(false);
      }
    };

    loadBookedEvents();

    return () => controller.abort();
  }, []);

  const fullName = user?.fullName || '';
  const email = user?.email || '';
  const avatarUrl = user?.avatarUrl || '';
  const joinedAt = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : '';

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="bg-[#FEFFFF]">
      <section className="mx-auto max-w-7xl px-2 py-6 sm:px-6 md:py-8 lg:px-0">
        <div className="flex flex-col-reverse gap-6 lg:flex-row">
          {/* Left Side - Events List */}
          <div className="flex-1 lg:w-2/3">
            {/* Upcoming Events */}
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-semibold sm:text-3xl">
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-2">
                      {/* <span className="h-2 w-2 rounded-full bg-teal-500" /> */}
                      <span className="text-teal-600 font-semibold">Upcoming Events</span>
                    </span>
                  </span>
                </h3>
              {upcomingLoading ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
                  Loading booked events...
                </div>
              ) : upcomingError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-10 text-center text-sm text-red-600">
                  {upcomingError}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
                  No upcoming booked events found.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <UserEventCard key={`upcoming-${event.id}`} event={event} />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Events */}
            <div>
              <h3 className="mb-4 text-2xl font-semibold sm:text-3xl">
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-2">
                      {/* <span className="h-2 w-2 rounded-full bg-emerald-600" /> */}
                      <span className="text-emerald-700 font-semibold">Completed Events</span>
                    </span>
                  </span>
                </h3>
              {upcomingLoading ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
                  Loading completed events...
                </div>
              ) : completedEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
                  No completed events found.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {completedEvents.map((event) => (
                    <UserEventCard key={`completed-${event.id}`} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - User Profile (Sticky on desktop, top on mobile) */}
          <aside className="lg:w-1/3 lg:max-w-sm">
            <div className="rounded-lg border border-gray-300 bg-white p-5 lg:sticky lg:top-20">
              {/* Profile Picture */}
              <div className="mb-4 flex justify-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100 ring-2 ring-gray-100">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-400">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-[#42444A] sm:text-2xl">{fullName}</h2>
                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-[#42444A]">
                  <Mail className="h-4 w-4" />
                  <span className="break-all">{email}</span>
                </p>
                {joinedAt && (
                  <p className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4" />
                    <span>Joined {joinedAt}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/user"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-green-500 px-4 py-2.5 text-white transition-colors hover:bg-green-400"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm font-medium">My Events</span>
                </Link>

                <Link
                  to="/user/edit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-[#42444A] transition-colors hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default UserDashboardView;

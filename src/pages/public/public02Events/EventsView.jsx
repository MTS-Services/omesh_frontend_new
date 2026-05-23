import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Pagination } from '../../../components/ui';
import EventCard from '../../../components/common/EventCard';
import Skeleton from '../../../components/common/Skeleton';
import { usePublicEventsList } from '../../../features/public/events/hooks';

const ITEMS_PER_PAGE = 8;

const resolveCountryKey = (event) => {
  const rawCountry = String(event?.country || '').trim().toLowerCase();
  if (rawCountry.includes('guyana')) return 'gy';
  if (rawCountry.includes('trinidad') || rawCountry.includes('tobago')) return 'tt';

  const rawFlag = String(event?.flag || '').trim().toLowerCase();
  if (rawFlag === 'gy') return 'gy';
  if (rawFlag === 'tt') return 'tt';

  const rawLocation = String(event?.location || '').trim().toLowerCase();
  if (rawLocation.includes('guyana')) return 'gy';
  if (rawLocation.includes('trinidad') || rawLocation.includes('tobago')) return 'tt';

  return '';
};

const EventCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-white ring-1 ring-gray-200">
      <div className="h-28 w-full sm:h-40">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="flex flex-col p-3 sm:p-4">
        <Skeleton className="mb-3 h-5 w-5/6" />

        <div className="space-y-2">
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-10/12" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-full" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

const EventsView = () => {
  const { events, status, loading, error } = usePublicEventsList();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const isInitialLoading = status === 'idle' || loading;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const selectedCountryKey = country.trim().toLowerCase();

    return events.filter((e) => {
      const bySearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q);

      const eventCountryKey = resolveCountryKey(e);
      const byCountry = !selectedCountryKey || eventCountryKey === selectedCountryKey;

      return bySearch && byCountry;
    });
  }, [search, country, events]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bg-white px-2 py-8 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-6">
          <h2 className="text-xl text-gray-900 md:text-2xl lg:text-4xl">
            Discover Upcoming Sports Events Near You
          </h2>
          <p className="mt-2 mb-8 text-sm text-gray-500 md:text-base">
            Browse through a variety of sports events happening in your area and find the ones that
            interest you the most.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <div className="flex w-full max-w-7xl justify-between flex-col gap-3 sm:flex-row sm:items-center ">
            <div className="relative w-full sm:flex-1 justify-between max-w-2xl">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={handleSearch}
                placeholder="Search events..."
                aria-label="Search events"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-9 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
              />
            </div>

            <select
              value={country}
              onChange={handleCountryChange}
              aria-label="Filter by country"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none sm:w-60"
            >
              <option value="">All Countries</option>
              <option value="tt">Trinidad & Tobago</option>
              <option value="gy">Guyana</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && !isInitialLoading && (
          <p className="py-16 text-center text-red-500">Failed to load events. Please try again.</p>
        )}

        {/* Grid */}
        {!error && (
          <>
            {isInitialLoading && paginated.length === 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))}
              </div>
            ) : paginated.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {paginated.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-gray-500">
                {search.trim()
                  ? `No events found for "${search.trim()}".`
                  : 'No events available right now. Please check back soon.'}
              </p>
            )}

            {/* Pagination */}
            {filtered.length > ITEMS_PER_PAGE && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventsView;

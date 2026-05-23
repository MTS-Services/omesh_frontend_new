import { Link } from 'react-router-dom';
import EventCard from '../../../../components/common/EventCard';
import Skeleton from '../../../../components/common/Skeleton';
import { usePublicEventsList } from '../../../../features/public/events/hooks';

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

const EventsPreview = () => {
  const { events, status, loading } = usePublicEventsList();
  const previewEvents = events.slice(0, 8);
  const isInitialLoading = status === 'idle' || loading;
  const showSkeletons = isInitialLoading && previewEvents.length === 0;

  return (
    <section className="bg-white px-2 py-10 sm:px-4 md:py-24 lg:px-8">
      {/* Section heading */}
      <div className="mb-10 flex items-center justify-center gap-4">
        {/* Left tapered line */}
        <svg
          className="h-1 max-w-80 flex-1 md:max-w-35"
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
        >
          <polygon points="0,2 100,0 100,4" fill="#696969" />
        </svg>
        <h2 className="text-2xl text-gray-900 md:text-3xl lg:text-5xl">
          Events <span className="text-green-500">Preview</span>
        </h2>
        {/* Right tapered line */}
        <svg
          className="h-1 max-w-80 flex-1 md:max-w-35"
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 0,4 100,2" fill="#696969" />
        </svg>
      </div>

      {/* Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {showSkeletons
          ? Array.from({ length: 8 }).map((_, index) => <EventCardSkeleton key={index} />)
          : previewEvents.map((event) => <EventCard key={event.id} event={event} />)}
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          to="/events"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 md:text-base"
        >
          View All Events
        </Link>
      </div>
    </section>
  );
};

export default EventsPreview;

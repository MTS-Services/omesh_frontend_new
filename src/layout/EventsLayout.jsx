import { NavLink, Outlet, useMatch, useLocation } from 'react-router-dom';

const TABS = [
  { label: 'Requested Event', to: '/dash/events/requested' },
  { label: 'Approved event', to: '/dash/events/approved' },
  { label: 'Suspended event', to: '/dash/events/suspended' },
];

const EventsLayout = () => {
  const isDetailPage = useMatch('/dash/events/:id');
  const { state } = useLocation();
  const activeFromState = isDetailPage ? state?.from : null;

  return (
    <div>
      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-6 border-b border-gray-200 sm:gap-8">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive || activeFromState === tab.to
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default EventsLayout;

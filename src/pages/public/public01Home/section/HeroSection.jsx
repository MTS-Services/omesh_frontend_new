import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../../../features/auth/selectors';
import { ROLES, getDashboardPathByRole } from '../../../../utils/auth';

const HeroSection = () => {
  const navigate = useNavigate();
  const userRole = useSelector(selectUserRole);

  const handleOrganizeNow = () => {
    if (userRole === ROLES.ORGANIZER) {
      navigate(getDashboardPathByRole(userRole));
      return;
    }

    navigate('/auth/register', { state: { role: 'ORGANIZER' } });
  };

  return (
    <section
      className="relative min-h-[40vh] w-full overflow-hidden md:min-h-[60vh] lg:min-h-[80vh]"
      style={{
        backgroundImage: 'url(/img/home/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Content: bottom on mobile, vertically centered on desktop */}
      <div className="relative z-10 mx-auto flex min-h-[460px] max-w-7xl flex-col justify-end px-4 pb-10 md:px-4 lg:absolute lg:inset-0 lg:min-h-0 lg:justify-center lg:px-0 lg:pb-0">
        {/* Badge */}
        <span className="mb-4 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white ring-1 backdrop-blur-sm sm:text-sm">
          Host • Train • Discover • Race
        </span>

        {/* Heading */}
        <h1 className="text-5xl font-semibold text-white lg:text-9xl">
          Endura <br /> <span className="block text-[#1FB356] lg:inline">Events</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm font-medium text-white/90 sm:text-base lg:text-xl">
          Powered by Powerhouse
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/events"
            className="rounded-md bg-[#1FB356] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#22c55e] sm:px-8 sm:py-3"
          >
            Browse Events
          </Link>
          <button
            type="button"
            onClick={handleOrganizeNow}
            className="rounded-md border border-white bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:px-8 sm:py-3"
          >
            Organize an Event
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

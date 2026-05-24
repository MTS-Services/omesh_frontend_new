import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CircleUserRound, LayoutDashboard, Menu, X } from 'lucide-react';
import { useCurrentUser } from '../../../hooks/useRoleAccess.js';
import { ROLES } from '../../../utils/auth';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Organizer Toolkit', href: '/organizer-toolkit' },
  { name: 'Training Plans', href: '/training-plans' },
  { name: 'About Us', href: '/about' },
  { name: 'FAQ', href: '/faq' },
];

// Dashboard button config per role
const dashboardConfig = {
  [ROLES.ADMIN]: { label: 'Dashboard', href: '/dash', icon: LayoutDashboard },
  [ROLES.ORGANIZER]: { label: 'Dashboard', href: '/org', icon: LayoutDashboard },
  [ROLES.USER]: { label: 'My Profile', href: '/user', icon: CircleUserRound },
};

const AuthButton = ({ dashConfig, mobile = false, onClose }) => {
  if (dashConfig) {
    const Icon = dashConfig.icon;
    return (
      <Link
        to={dashConfig.href}
        onClick={onClose}
        className={`inline-flex items-center gap-2 rounded-md border border-[#4ade80] text-sm font-semibold text-[#4ade80] transition-colors hover:bg-[#113321] ${
          mobile ? 'w-full justify-center px-5 py-3 text-base' : 'px-3 py-2'
        }`}
        aria-label={`Go to ${dashConfig.label}`}
      >
        <Icon className="h-5 w-5" />
        <span>{dashConfig.label}</span>
      </Link>
    );
  }
  return (
    <div className="flex gap-2">
      <Link
        to="/auth/login"
        onClick={onClose}
        className={`rounded-md bg-[#4ade80] font-semibold text-black transition-colors hover:bg-[#22c55e] ${
          mobile ? 'block w-full px-5 py-3 text-center text-base' : 'px-4 py-2 text-sm'
        }`}
      >
        Sign In
      </Link>

      <Link
        to="/auth/register"
        state={{ role: 'ORGANIZER' }}
        onClick={onClose}
        className={`rounded-md bg-[#4ade80] font-semibold text-black transition-colors hover:bg-[#22c55e] ${
          mobile ? 'block w-full px-5 py-3 text-center text-base' : 'px-4 py-2 text-sm'
        }`}
      >
        Become an Organizer
      </Link>
    </div>
  );
};

const NavbarTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const authUser = useCurrentUser();
  const dashConfig = authUser ? dashboardConfig[authUser.role] : null;

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl px-4 lg:px-0">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Flex shrink prevent makes sure it stays its size */}
          <Link to="/" className="shrink-0">
            <div className="">
              <h2 className="text-xl text-white md:text-2xl lg:text-3xl">
                Endura <span className="text-[#4ade80]">Events</span>
              </h2>
            </div>
          </Link>

          {/* Desktop Navigation - Changed md:flex to lg:flex to avoid overflow */}
          <div className="hidden items-center lg:flex lg:space-x-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-2 py-5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(item.href)
                    ? 'text-[#4ade80] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#4ade80]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Action - Hidden on smaller screens, shown on LG */}
          <div className="hidden lg:block">
            <AuthButton dashConfig={dashConfig} />
          </div>

          {/* Mobile menu button - Shown on anything smaller than LG */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="border-t border-gray-800 bg-[#0d0d0d] lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'border-l-4 border-[#4ade80] bg-gray-900 text-[#4ade80]'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 border-t border-gray-800 pt-4">
              <AuthButton dashConfig={dashConfig} mobile onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarTemplate;

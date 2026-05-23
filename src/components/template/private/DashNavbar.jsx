import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../../hooks/useRoleAccess.js';
import { useLogout } from '../../../features/auth/hooks';
import { toast } from 'react-toastify';
import { resolveImageUrl } from '../../../utils/images';

const DashNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const authUser = useCurrentUser();
  const { logout } = useLogout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // Navigate based on role
    if (authUser?.role === 'ORGANIZER') {
      navigate('/org/profile');
    } else if (authUser?.role === 'ADMIN') {
      navigate('/dash/profile');
    } else {
      navigate('/user/profile');
    }
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    navigate('/dash/settings');
  };

  const avatarSrc =
    resolveImageUrl(authUser?.avatarUrl || authUser?.avatar || authUser?.profileImage || '') ||
    '/img/random/Avatar.png';

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-10">
      {/* Left: Mobile Menu + Search */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        {/* <div className="relative hidden sm:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm transition outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          />
        </div> */}
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1.5 transition hover:bg-gray-50"
          >
            <img
              src={avatarSrc}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200"
            />
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-gray-600">
                {authUser?.fullName || authUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {authUser?.role?.toLowerCase() || 'Participant'}
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-100 p-3">
                <p className="text-sm font-semibold text-gray-900">
                  {authUser?.fullName || authUser?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{authUser?.email || 'user@example.com'}</p>
              </div>

              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </button>

                {authUser?.role === 'ADMIN' && (
                  <button
                    onClick={handleSettingsClick}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                )}
              </div>

              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashNavbar;

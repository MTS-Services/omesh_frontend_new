import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Trophy,
  Dumbbell,
  DollarSign,
  Calendar,
  Settings,
  Users,
  ClipboardList,
  CreditCard,
  FileEdit,
  TicketPercent,
 
} from 'lucide-react';
import { useCurrentUser } from '../../../hooks/useRoleAccess.js';
import { ROLES } from '../../../utils/auth';

const adminMenuItems = [
  { name: 'Dashboard', path: '/dash', icon: Home, end: true },
  { name: 'Requested Events', path: '/dash/events', icon: Trophy, end: false },
  { name: 'Training plan', path: '/dash/training-plan', icon: Dumbbell, end: false },
  { name: 'Payout request', path: '/dash/payout-request', icon: DollarSign, end: false },
  { name: 'Organizer toolkit', path: '/dash/toolkit', icon: Calendar, end: false },
  { name: 'Settings', path: '/dash/settings', icon: Settings, end: false },
  { name: 'Profile', path: '/dash/profile', icon: Users, end: false },
];

const orgMenuItems = [
  { name: 'Dashboard', path: '/org', icon: Home, end: true },
  { name: 'Create Event', path: '/org/create', icon: FileEdit, end: false },
  { name: 'Events', path: '/org/events', icon: Trophy, end: false },
  { name: 'Coupon', path: '/org/coupon', icon: TicketPercent, end: false },
  { name: 'Bibs and Medal Design', path: '/org/toolkit', icon: ClipboardList, end: false },
  { name: 'Payment', path: '/org/payment', icon: CreditCard, end: false },
  { name: 'Profile', path: '/org/profile', icon: Users, end: false },
];

const DashSidebar = () => {
  const authUser = useCurrentUser();
  const menuItems = authUser?.role === ROLES.ORGANIZER ? orgMenuItems : adminMenuItems;

  return (
    <div className="flex h-screen w-full flex-col bg-white p-4 shadow-sm">
      {/* Logo */}
      <div className="mb-8">
        <Link to="/">
          <h1 className="text-2xl font-bold">
            Endura <span className="text-green-500">Events</span>
          </h1>
        </Link>
      </div>

      {/* Menu Label */}
      <p className="mb-4 text-sm text-gray-400">Main menu</p>

      {/* Menu Items */}
      <nav className="flex flex-col gap-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default DashSidebar;

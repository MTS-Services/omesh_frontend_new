import React from 'react';
import UserTable from './components/UserTable';

const UserPageView = () => {
  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Organizer List</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage all registered organizers.</p>
      </div>

      <UserTable initialRole="ORGANIZER" />
    </div>
  );
};

export default UserPageView;

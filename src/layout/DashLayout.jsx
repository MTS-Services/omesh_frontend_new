import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashSidebar from '../components/template/private/DashSidebar';
import DashNavbar from '../components/template/private/DashNavbar';

const DashLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
   
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto lg:block">
        <DashSidebar />
      </aside>

      {/* Sidebar - Mobile overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 h-full w-64 lg:hidden">
            <DashSidebar />
          </aside>
        </>
      )}

      {/* Main Content Area */}
      
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar */}
        <div className="sticky top-0 z-20">
          <DashNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Page Content - only this area scrolls */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminDashboard from '../components/AdminDashboard';

function Admin() {
  const [viewType, setViewType] = useState("mansions"); // Default to Mansions
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hamburger Menu for All Devices */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-[#00603A] text-white w-12 ml-4 mt-4"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-green-900 text-white transition-transform duration-300 ease-in-out z-40`}
      >
        <AdminSidebar setViewType={setViewType} />
      </div>

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Dashboard */}
      <div className="flex-1 bg-[#F9F9F8] pt-16">
        <AdminDashboard viewType={viewType} />
      </div>
    </div>
  );
}

export default Admin;
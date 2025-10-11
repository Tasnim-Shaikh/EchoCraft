// src/components/admin/AdminLayout.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaPoll, FaPodcast, FaUpload, FaEye, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../../firebase';

const SidebarLink = ({ icon, text, to }) => {
  const navigate = useNavigate();
  return (
    <li
      onClick={() => navigate(to)}
      className="flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </li>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#1F2937] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] p-4 flex flex-col">
        <div className="text-2xl font-bold mb-8 flex items-center gap-2 px-2">
            ⚙️ Admin Panel
        </div>
        <nav>
          <ul className="space-y-2">
            <SidebarLink icon={<FaTachometerAlt />} text="Dashboard" to="/admin/dashboard" />
            <SidebarLink icon={<FaUsers />} text="Manage Users" to="/admin/users" />
            <SidebarLink icon={<FaPoll />} text="Manage Polls" to="/admin/polls" />
            <SidebarLink icon={<FaPodcast />} text="Manage Podcasts" to="/admin/podcasts" />
            <SidebarLink icon={<FaUpload />} text="Upload Content" to="/admin/upload" />
          </ul>
        </nav>
        <div className="mt-auto">
            <SidebarLink icon={<FaEye />} text="View App" to="/dashboard" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex justify-end items-center p-4 bg-[#1F2937] border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">A</div>
            <button onClick={handleLogout} className="bg-red-500/50 p-2 rounded-full hover:bg-red-500">
                <FaSignOutAlt />
            </button>
          </div>
        </header>
        <div className="p-6 overflow-y-auto">
          <Outlet /> {/* This will render the specific admin page */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
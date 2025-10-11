import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaPoll, FaPodcast, FaUpload, FaEye, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../../firebase';

// Reusable Sidebar Link Component
const SidebarLink = ({ icon, text, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li
      onClick={() => navigate(to)}
      className={`flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${isActive ? 'bg-gray-700' : ''}`}
    >
      {icon}
      <span>{text}</span>
    </li>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#1F2937] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] p-4 flex flex-col flex-shrink-0">
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex justify-end items-center p-4 bg-[#1F2937] border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
              A
            </div>
            <button 
              onClick={handleLogout} 
              title="Logout" 
              className="p-2 rounded-full hover:bg-red-500/50 transition-colors"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <Outlet /> {/* Child routes (Dashboard, ManageUsers, etc.) will be rendered here */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
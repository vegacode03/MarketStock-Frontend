import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { seller } = useAuth();

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'V';
  };

  return (
    <div className="flex h-screen bg-[#f8faf8] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Topbar for Mobile */}
        <header className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <h1 className="font-display font-semibold text-brand-700">MarketStock</h1>
          
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm border border-brand-200">
            {getInitial(seller?.nome)}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
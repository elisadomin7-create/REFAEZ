
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { NAVIGATION_ITEMS, ADMIN_NAVIGATION } from '../constants';
import { UserRole } from '../types';
import { LogOut, Bell, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout, settings, notifications } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const navItems = isAdmin ? ADMIN_NAVIGATION : NAVIGATION_ITEMS;

  const handleNav = (path: string) => {
    setActiveTab(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Mobile Header with Hamburger */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <img src={settings.appLogoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-black text-lg tracking-tight truncate max-w-[150px]" style={{ color: settings.themeColor }}>{settings.appName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2">
            <Bell size={22} className="text-gray-600 dark:text-gray-300" />
            {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>}
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <>
            {/* Backdrop for Mobile */}
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              />
            )}
            
            {/* Sidebar Content */}
            <motion.aside 
              initial={{ x: -300 }} 
              animate={{ x: 0 }} 
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 border-r dark:border-gray-800 z-40 flex flex-col shadow-2xl md:translate-x-0 md:shadow-none md:z-0 pt-16 md:pt-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
              <div className="hidden md:flex p-6 items-center justify-between border-b dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <img src={settings.appLogoUrl} alt="Logo" className="w-10 h-10 rounded-xl shadow-md object-contain" />
                  <div>
                    <h1 className="font-black text-lg leading-none truncate max-w-[140px]" style={{ color: settings.themeColor }}>{settings.appName}</h1>
                    {isAdmin && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admin Panel</span>}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">Menu</p>
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 font-bold text-sm ${
                      activeTab === item.path 
                        ? 'text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    style={activeTab === item.path ? { backgroundColor: settings.themeColor } : {}}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t dark:border-gray-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-sm transition-colors"
                >
                  <LogOut size={20} />
                  Logout Account
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 font-mono">v2.5.0 • Build 2026</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 flex flex-col h-screen overflow-hidden">
        {/* Desktop Header (Hidden on Mobile) */}
        <header className="hidden md:flex bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 items-center justify-between sticky top-0 z-40 shrink-0">
          <h2 className="text-xl font-black dark:text-white">
            {navItems.find(i => i.path === activeTab)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell size={22} className="text-gray-500" />
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l dark:border-gray-800">
              <div className="text-right hidden lg:block">
                <p className="font-bold text-sm dark:text-white">{currentUser.name}</p>
                <p className="text-xs text-gray-400 font-mono">{currentUser.email}</p>
              </div>
              <img src={`https://picsum.photos/seed/${currentUser.id}/100/100`} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 dark:border-gray-700" />
            </div>
          </div>
        </header>

        {/* Notifications Modal */}
        {showNotifs && (
          <div className="fixed top-20 right-4 md:absolute md:top-16 md:right-8 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl z-[100] p-4 max-h-[70vh] overflow-y-auto animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black dark:text-white">Alerts</h4>
              <button onClick={() => setShowNotifs(false)}><X size={18} className="text-gray-400"/></button>
            </div>
            <div className="space-y-2">
              {notifications.length > 0 ? notifications.map(n => (
                <div key={n.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <p className="font-bold text-sm text-blue-900 dark:text-blue-200">{n.title}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 opacity-80">{n.message}</p>
                  <p className="text-[10px] mt-2 text-gray-400 font-mono">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              )) : <p className="text-center text-gray-400 py-8 italic text-sm">No notifications</p>}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

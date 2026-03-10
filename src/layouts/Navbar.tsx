import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Menu, X, User, Settings, BarChart2, FileText, MapPin, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Badge } from '../components/ui';
import { cn } from '../lib/utils';
import { timeAgo } from '../lib/utils';

interface NavbarProps {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, onSidebarToggle }) => {
  const { user, notifications, logout, markNotificationRead, markAllNotificationsRead } = useAuthStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const userNotifs = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  const roleColors: Record<string, string> = {
    citizen: 'info',
    admin: 'purple',
    department_manager: 'warning',
    field_worker: 'success',
  };

  const roleLabels: Record<string, string> = {
    citizen: 'Citizen',
    admin: 'Admin',
    department_manager: 'Dept. Manager',
    field_worker: 'Field Worker',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Logo + Menu Toggle */}
        <div className="flex items-center gap-3">
          {onSidebarToggle && (
            <button onClick={onSidebarToggle} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900 text-sm">PS-CRM</span>
              <span className="text-xs text-gray-400 block leading-none">Smart Public Service</span>
            </div>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                  <span className="font-semibold text-sm text-gray-900">Notifications</span>
                  <button onClick={markAllNotificationsRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {userNotifs.length === 0 ? (
                    <p className="text-sm text-gray-500 p-4 text-center">No notifications</p>
                  ) : userNotifs.slice(0, 10).map(n => (
                    <div
                      key={n.id}
                      onClick={() => { markNotificationRead(n.id); if (n.ticketId) navigate(`/ticket/${n.ticketId}`); setNotifOpen(false); }}
                      className={cn('px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0', !n.isRead && 'bg-blue-50')}
                    >
                      <div className="flex gap-2">
                        <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.type === 'emergency' ? 'bg-red-500' : n.isRead ? 'bg-gray-300' : 'bg-blue-500')} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
                <Badge variant={roleColors[user?.role || 'citizen'] as any} className="mt-0.5 text-[10px]">
                  {roleLabels[user?.role || 'citizen']}
                </Badge>
              </div>
              <ChevronDown size={16} className="hidden md:block text-gray-400" />
            </button>

            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <User size={15} /> Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={15} /> Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

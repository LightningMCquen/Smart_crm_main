import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FileText, PlusCircle, BarChart2, Map, Users, Settings, 
  Bell, Star, Eye, Briefcase, ClipboardList, HardHat, TrendingUp, Shield
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const citizenNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: PlusCircle, label: 'Submit Complaint', path: '/submit-complaint' },
  { icon: FileText, label: 'My Complaints', path: '/my-complaints' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Star, label: 'Rewards & Badges', path: '/rewards' },
  { icon: Eye, label: 'Transparency Portal', path: '/transparency' },
];

const adminNav = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/admin/command-center' },
  { icon: ClipboardList, label: 'All Complaints', path: '/admin/complaints' },
  { icon: Map, label: 'GIS Map View', path: '/admin/map' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
  { icon: Users, label: 'Departments', path: '/admin/departments' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Eye, label: 'Transparency Portal', path: '/transparency' },
];

const managerNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/provider/dashboard' },
  { icon: ClipboardList, label: 'Dept. Complaints', path: '/provider/complaints' },
  { icon: Users, label: 'Field Workers', path: '/provider/workers' },
  { icon: BarChart2, label: 'Performance', path: '/provider/analytics' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
];

const workerNav = [
  { icon: LayoutDashboard, label: 'My Tasks', path: '/worker/tasks' },
  { icon: Map, label: 'Task Map', path: '/worker/map' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user } = useAuthStore();

  const navItems = user?.role === 'citizen' ? citizenNav 
    : user?.role === 'admin' ? adminNav 
    : user?.role === 'department_manager' ? managerNav 
    : workerNav;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-30 overflow-y-auto',
          'lg:hidden'
        )}
        style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{user?.city}</p>
              <p className="text-[10px] text-gray-400">{user?.department || `Citizen · ${user?.ward || ''}`}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Desktop persistent sidebar
export const DesktopSidebar: React.FC = () => {
  const { user } = useAuthStore();

  const navItems = user?.role === 'citizen' ? citizenNav 
    : user?.role === 'admin' ? adminNav 
    : user?.role === 'department_manager' ? managerNav 
    : workerNav;

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto flex-shrink-0">
      <div className="p-4 space-y-1 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">{user?.city}</p>
            <p className="text-[10px] text-gray-400">{user?.department || `Citizen · ${user?.ward || ''}`}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Card, Button, Badge } from '../components/ui';
import { Bell, CheckCircle, AlertTriangle, User, FileText, Star } from 'lucide-react';
import { timeAgo } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const { user, notifications, markNotificationRead, markAllNotificationsRead } = useAuthStore();
  const navigate = useNavigate();

  const userNotifs = notifications.filter(n => n.userId === user?.id);
  const unread = userNotifs.filter(n => !n.isRead).length;

  const typeIcon = (type: string) => {
    switch (type) {
      case 'status_update': return <CheckCircle size={16} className="text-green-500" />;
      case 'emergency': return <AlertTriangle size={16} className="text-red-500" />;
      case 'assignment': return <User size={16} className="text-blue-500" />;
      case 'feedback_request': return <Star size={16} className="text-yellow-500" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unread > 0 && <p className="text-sm text-blue-600 mt-1">{unread} unread notification{unread !== 1 ? 's' : ''}</p>}
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>Mark all as read</Button>
        )}
      </div>

      {userNotifs.length === 0 ? (
        <Card className="p-10 text-center text-gray-400">
          <Bell size={40} className="mx-auto mb-3 opacity-40" />
          <p>No notifications yet</p>
        </Card>
      ) : (
        userNotifs.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-all ${
              !n.isRead ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'
            } ${n.type === 'emergency' ? 'border-red-300 bg-red-50' : ''}`}
            onClick={() => {
              markNotificationRead(n.id);
              if (n.ticketId) navigate(`/ticket/${n.ticketId}`);
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                n.type === 'emergency' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {typeIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-gray-900">{n.title}</p>
                  {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

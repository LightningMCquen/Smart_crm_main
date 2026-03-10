import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Edit2, Camera, Star, Award, Clock, CheckCircle, FileText } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTicketStore } from '../store/ticketStore';
import { cn } from '../lib/utils';

const ROLE_LABELS: Record<string, string> = {
  citizen: 'Citizen',
  admin: 'Administrator',
  department_manager: 'Department Manager',
  field_worker: 'Field Worker',
};

const ROLE_COLORS: Record<string, string> = {
  citizen: 'bg-blue-100 text-blue-700',
  admin: 'bg-red-100 text-red-700',
  department_manager: 'bg-purple-100 text-purple-700',
  field_worker: 'bg-green-100 text-green-700',
};

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { tickets } = useTicketStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!user) return null;

  const myTickets = tickets.filter(t => t.citizenId === user.id);
  const resolvedCount = myTickets.filter(t => t.status === 'resolved').length;
  const pendingCount = myTickets.filter(t => !['resolved', 'closed'].includes(t.status)).length;

  const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500'];
  const avatarColor = avatarColors[user.name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600" />
        
        {/* Avatar + Info */}
        <div className="px-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
            <div className="relative">
              <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md', avatarColor)}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className={cn(
                  'flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition-colors',
                  editing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                <Edit2 size={14} />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              {editing && (
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={14} /> Save
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            {editing ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
              />
            ) : (
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700')}>
                <Shield size={10} className="inline mr-1" />
                {ROLE_LABELS[user.role] || user.role}
              </span>
              {user.department && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                  {user.department}
                </span>
              )}
              <span className="text-xs text-gray-400">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="text-sm text-gray-800">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Phone size={14} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Phone Number</p>
                {editing ? (
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="text-sm text-gray-800 border-b border-blue-500 focus:outline-none bg-transparent w-full"
                  />
                ) : (
                  <p className="text-sm text-gray-800">+91 {user.phone}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <MapPin size={14} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm text-gray-800">{user.city}{user.ward ? `, ${user.ward}` : ''}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h2 className="font-semibold text-gray-900 mb-4">Activity Stats</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-blue-600" />
                <span className="text-sm text-gray-700">Complaints</span>
              </div>
              <span className="font-bold text-blue-600">{myTickets.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-sm text-gray-700">Resolved</span>
              </div>
              <span className="font-bold text-green-600">{resolvedCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-orange-600" />
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="font-bold text-orange-600">{pendingCount}</span>
            </div>
            {user.role === 'citizen' && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-600" />
                  <span className="text-sm text-gray-700">Points</span>
                </div>
                <span className="font-bold text-yellow-600">{user.points}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Badges (citizens only) */}
      {user.role === 'citizen' && user.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-yellow-500" />
            <h2 className="font-semibold text-gray-900">My Badges</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {user.badges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                <span className="text-3xl mb-1">{badge.icon}</span>
                <p className="text-xs font-semibold text-gray-800 text-center">{badge.name}</p>
                <p className="text-xs text-gray-400 text-center mt-0.5">{badge.description}</p>
                <p className="text-xs text-gray-300 mt-1">{new Date(badge.earnedAt).toLocaleDateString('en-IN')}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Account Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Account Security</h2>
        <div className="space-y-2">
          <button className="w-full text-left flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Change Password</p>
                <p className="text-xs text-gray-400">Update your account password</p>
              </div>
            </div>
            <span className="text-gray-300 text-lg">›</span>
          </button>
          <button className="w-full text-left flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400">Add extra security to your account</p>
              </div>
            </div>
            <span className="text-xs text-orange-600 font-medium">Enable</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

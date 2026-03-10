import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { Card, StatCard, Badge, Button } from '../../components/ui';
import { DualBarChart, DonutChart, ProgressBar } from '../../components/charts/Charts';
import { MOCK_ANALYTICS, MOCK_DEPARTMENTS } from '../../data/mockData';
import { CATEGORIES } from '../../data/categories';
import { TicketCard } from '../../components/tickets/TicketCard';
import {
  Activity, AlertTriangle, CheckCircle, Clock, MapPin, Users, TrendingUp, Zap,
  Bell, Shield, BarChart2, Phone
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const { user } = useAuthStore();
  const { getAllTickets } = useTicketStore();
  const tickets = getAllTickets();
  const analytics = MOCK_ANALYTICS;
  const [liveRefresh] = useState(true);

  const emergency = tickets.filter(t => t.isEmergency && !['resolved', 'closed'].includes(t.status));
  const recentTickets = [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const donutData = [
    { name: 'Resolved', value: analytics.resolvedComplaints, color: '#10B981' },
    { name: 'In Progress', value: analytics.inProgressComplaints, color: '#F59E0B' },
    { name: 'Pending', value: analytics.pendingComplaints, color: '#3B82F6' },
    { name: 'Emergency', value: analytics.emergencyComplaints, color: '#EF4444' },
  ];

  const categoryData = analytics.categoryDistribution.map((c, idx) => ({
    name: CATEGORIES[idx]?.icon + ' ' + c.category.split(' ')[0],
    value: c.count,
    color: CATEGORIES[idx]?.color || '#3B82F6',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity size={24} className="text-blue-600" /> Real-Time Command Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user?.city} Municipal Corporation · Live Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Emergency Alerts */}
      {emergency.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-600 text-white rounded-2xl p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={28} className="animate-bounce" />
              <div>
                <p className="font-bold text-lg">🚨 {emergency.length} Active Emergency Alert{emergency.length !== 1 ? 's' : ''}</p>
                <p className="text-red-100 text-sm">Immediate response required</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={<Phone size={14} />}>
              SOS Call
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {emergency.map(t => (
              <div key={t.id} className="bg-red-700/50 rounded-lg p-3 text-sm">
                <p className="font-medium">{t.title}</p>
                <p className="text-red-200 text-xs">{t.location.address} · {t.location.ward}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints" value={analytics.totalComplaints.toLocaleString()}
          icon={<BarChart2 size={20} className="text-blue-600" />} color="bg-blue-50"
          change="+47 today" changeType="up"
        />
        <StatCard
          title="Resolved" value={analytics.resolvedComplaints.toLocaleString()}
          icon={<CheckCircle size={20} className="text-green-600" />} color="bg-green-50"
          change={`${analytics.resolutionRate}% rate`}
        />
        <StatCard
          title="Pending" value={analytics.pendingComplaints.toLocaleString()}
          icon={<Clock size={20} className="text-yellow-600" />} color="bg-yellow-50"
          change="198 need attention" changeType="down"
        />
        <StatCard
          title="Avg Resolution" value={`${analytics.avgResolutionTime}h`}
          icon={<TrendingUp size={20} className="text-purple-600" />} color="bg-purple-50"
          change="-3h improved" changeType="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <DualBarChart data={analytics.weeklyTrend} title="7-Day Complaint Trend" height={250} />
        </Card>
        <Card className="p-5">
          <DonutChart data={donutData} title="Status Distribution" height={160} />
        </Card>
      </div>

      {/* GIS Hotspot Map + Recent Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mock GIS Map */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 relative" style={{ height: 300 }}>
            <div className="absolute top-3 left-3 bg-white/90 rounded-lg px-3 py-2 text-xs font-medium text-gray-700">
              📍 {user?.city} Hotspot Map
            </div>
            {/* Simulated hotspot circles */}
            {analytics.hotspots.map((spot, idx) => (
              <div
                key={idx}
                className={`absolute rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                style={{
                  width: Math.max(30, spot.intensity * 0.5) + 'px',
                  height: Math.max(30, spot.intensity * 0.5) + 'px',
                  left: `${10 + idx * 16}%`,
                  top: `${20 + (idx % 3) * 25}%`,
                  backgroundColor: spot.intensity > 80 ? '#EF4444' : spot.intensity > 60 ? '#F59E0B' : '#3B82F6',
                  opacity: 0.8,
                }}
                title={`${spot.category} - ${spot.ward}`}
              >
                {spot.intensity}
              </div>
            ))}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2">
              <div className="bg-white/90 rounded-lg px-2 py-1 text-xs flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" /> High ({'>'}80)
              </div>
              <div className="bg-white/90 rounded-lg px-2 py-1 text-xs flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500" /> Medium
              </div>
              <div className="bg-white/90 rounded-lg px-2 py-1 text-xs flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" /> Low
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">Issue Hotspots</p>
            <div className="space-y-1">
              {analytics.hotspots.slice(0, 4).map((spot, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: spot.intensity > 80 ? '#EF4444' : spot.intensity > 60 ? '#F59E0B' : '#3B82F6' }} />
                    <span className="text-gray-600">{spot.ward}</span>
                  </div>
                  <span className="text-gray-500">{spot.category} · {spot.intensity}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" /> Latest Complaints
          </h3>
          <div className="space-y-3">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="flex items-start gap-3 text-sm border-b border-gray-50 pb-3 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  ticket.isEmergency ? 'bg-red-500' : ticket.priority === 'high' ? 'bg-orange-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{ticket.title}</p>
                  <p className="text-xs text-gray-400">{ticket.ticketNumber} · {ticket.location.ward}</p>
                </div>
                <Badge variant={ticket.isEmergency ? 'emergency' : 'default'} className="text-[10px]">
                  {ticket.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Status */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-blue-600" /> Department Status Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_DEPARTMENTS.map(dept => (
            <div key={dept.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800 truncate">{dept.name.split(' ')[0]} Dept.</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  dept.efficiency >= 85 ? 'bg-green-100 text-green-700' :
                  dept.efficiency >= 70 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{dept.efficiency}%</span>
              </div>
              <ProgressBar value={dept.efficiency} color={dept.efficiency >= 85 ? '#10B981' : dept.efficiency >= 70 ? '#F59E0B' : '#EF4444'} showPercent={false} />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{dept.resolvedTickets} resolved</span>
                <span>{dept.pendingTickets} pending</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

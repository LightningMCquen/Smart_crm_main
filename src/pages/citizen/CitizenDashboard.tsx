import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { StatCard, Card, Badge } from '../../components/ui';
import { TicketCard } from '../../components/tickets/TicketCard';
import { DualBarChart, DonutChart } from '../../components/charts/Charts';
import {
  FileText, PlusCircle, CheckCircle, Clock, AlertTriangle, TrendingUp,
  Star, Trophy, MapPin, Bell
} from 'lucide-react';
import { MOCK_ANALYTICS } from '../../data/mockData';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getTicketsByUser } = useTicketStore();
  const navigate = useNavigate();

  const myTickets = getTicketsByUser(user?.id || '');
  const resolved = myTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const pending = myTickets.filter(t => !['resolved', 'closed', 'rejected'].includes(t.status)).length;
  const emergency = myTickets.filter(t => t.isEmergency).length;

  const analytics = MOCK_ANALYTICS;

  const donutData = [
    { name: 'Resolved', value: resolved, color: '#10B981' },
    { name: 'In Progress', value: myTickets.filter(t => t.status === 'in_progress').length, color: '#F59E0B' },
    { name: 'Pending', value: pending, color: '#3B82F6' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{user?.city} · {user?.ward}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/submit-complaint')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-blue-100"
        >
          <PlusCircle size={18} />
          <span className="hidden sm:inline">Report Issue</span>
          <span className="sm:hidden">Report</span>
        </motion.button>
      </div>

      {/* Points Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Your Civic Points</p>
            <p className="text-4xl font-bold mt-1">{user?.points?.toLocaleString()}</p>
            <p className="text-blue-200 text-xs mt-1">Keep reporting to earn more rewards!</p>
          </div>
          <div className="text-right">
            <div className="flex gap-1 justify-end mb-2">
              {user?.badges?.slice(0, 3).map(b => (
                <span key={b.id} className="text-2xl">{b.icon}</span>
              ))}
            </div>
            <button
              onClick={() => navigate('/rewards')}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg"
            >
              View Rewards →
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={myTickets.length} icon={<FileText size={20} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Resolved" value={resolved} icon={<CheckCircle size={20} className="text-green-600" />} color="bg-green-50" />
        <StatCard title="In Progress" value={pending} icon={<Clock size={20} className="text-yellow-600" />} color="bg-yellow-50" />
        <StatCard title="Emergency" value={emergency} icon={<AlertTriangle size={20} className="text-red-600" />} color="bg-red-50" />
      </div>

      {/* Recent Complaints + Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">My Recent Complaints</h2>
            <button onClick={() => navigate('/my-complaints')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          {myTickets.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No complaints yet</p>
              <button onClick={() => navigate('/submit-complaint')} className="mt-3 text-sm text-blue-600 hover:underline">
                Submit your first complaint →
              </button>
            </Card>
          ) : (
            myTickets.slice(0, 4).map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>

        <div className="space-y-4">
          {/* Mini chart */}
          {donutData.length > 0 && (
            <Card className="p-5">
              <DonutChart data={donutData} title="My Complaints Status" height={150} />
            </Card>
          )}

          {/* City stats */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" /> City Overview
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Total Complaints', value: analytics.totalComplaints.toLocaleString(), color: 'text-gray-900' },
                { label: 'Resolved This Week', value: '274', color: 'text-green-600' },
                { label: 'Avg. Resolution Time', value: `${analytics.avgResolutionTime}hrs`, color: 'text-blue-600' },
                { label: 'Resolution Rate', value: `${analytics.resolutionRate}%`, color: 'text-purple-600' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Leaderboard teaser */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" /> Leaderboard
            </h3>
            <div className="space-y-2">
              {[
                { rank: 1, name: 'Priya Mehta', points: 2150 },
                { rank: 2, name: 'Arjun Reddy', points: 1980 },
                { rank: 3, name: 'Sneha Kulkarni', points: 1750 },
                { rank: 4, name: user?.name || 'You', points: user?.points || 850 },
              ].map(entry => (
                <div key={entry.rank} className={`flex items-center gap-2 text-sm ${entry.name === user?.name ? 'bg-blue-50 rounded-lg px-2 py-1' : ''}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : entry.rank === 2 ? 'bg-gray-100 text-gray-600' : entry.rank === 3 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {entry.rank}
                  </span>
                  <span className="flex-1 text-gray-700">{entry.name}</span>
                  <span className="text-gray-500 font-medium text-xs">{entry.points} pts</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/rewards')} className="mt-3 text-xs text-blue-600 hover:underline w-full text-center">
              Full Leaderboard →
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

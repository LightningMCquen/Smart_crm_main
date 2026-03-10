import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { StatCard, Card, Badge, Button, Select } from '../../components/ui';
import { TicketCard, getStatusBadge } from '../../components/tickets/TicketCard';
import { DualBarChart, DonutChart, ProgressBar } from '../../components/charts/Charts';
import { MOCK_ANALYTICS, MOCK_DEPARTMENTS } from '../../data/mockData';
import { ClipboardList, CheckCircle, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getTicketsByDepartment, updateTicketStatus, assignTicket } = useTicketStore();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const dept = user?.department || '';
  const tickets = getTicketsByDepartment(dept);
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const pending = tickets.filter(t => t.status === 'assigned' || t.status === 'under_review' || t.status === 'submitted').length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const emergency = tickets.filter(t => t.isEmergency).length;

  const deptInfo = MOCK_DEPARTMENTS.find(d => d.name === dept);

  const donutData = [
    { name: 'Resolved', value: resolved, color: '#10B981' },
    { name: 'In Progress', value: inProgress, color: '#F59E0B' },
    { name: 'Pending', value: pending, color: '#3B82F6' },
    { name: 'Emergency', value: emergency, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const handleUpdateStatus = (ticketId: string, status: string) => {
    updateTicketStatus(ticketId, status as any, user?.name || 'Manager');
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{dept} · {user?.city}</p>
      </div>

      {/* Emergency Alert */}
      {emergency > 0 && (
        <div className="bg-red-600 text-white rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle size={24} />
          <div>
            <p className="font-bold">🚨 {emergency} Emergency Complaint{emergency !== 1 ? 's' : ''} Active</p>
            <p className="text-red-100 text-sm">Immediate action required</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assigned" value={tickets.length} icon={<ClipboardList size={20} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Resolved" value={resolved} icon={<CheckCircle size={20} className="text-green-600" />} color="bg-green-50" />
        <StatCard title="Pending" value={pending} icon={<Clock size={20} className="text-yellow-600" />} color="bg-yellow-50" />
        <StatCard title="Avg. Time" value={`${deptInfo?.avgResolutionTime || 38}hrs`} icon={<TrendingUp size={20} className="text-purple-600" />} color="bg-purple-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Department Complaints</h2>
            <Badge variant="info">{tickets.length} total</Badge>
          </div>
          
          {tickets.length === 0 ? (
            <Card className="p-8 text-center text-gray-400">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
              <p>No complaints assigned to your department</p>
            </Card>
          ) : (
            tickets.slice(0, 6).map(ticket => (
              <div key={ticket.id}>
                <TicketCard
                  ticket={ticket}
                  showActions
                  onAction={t => setSelectedTicket(t.id === selectedTicket ? null : t.id)}
                />
                {selectedTicket === ticket.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white border border-blue-200 rounded-xl mt-1 p-4 space-y-3"
                  >
                    <p className="text-sm font-semibold text-gray-800">Update Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {['in_progress', 'resolved', 'escalated'].map(s => (
                        <button
                          key={s}
                          onClick={() => handleUpdateStatus(ticket.id, s)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium"
                        >
                          → {s.replace('_', ' ').toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          {donutData.length > 0 && (
            <Card className="p-5">
              <DonutChart data={donutData} title="Status Distribution" height={140} />
            </Card>
          )}
          
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Department Performance</h3>
            <div className="space-y-3">
              <ProgressBar value={deptInfo?.efficiency || 75} label={`Efficiency: ${deptInfo?.efficiency || 75}%`} color="#10B981" />
              <ProgressBar value={resolved} max={tickets.length || 1} label={`Resolution: ${tickets.length > 0 ? Math.round((resolved/tickets.length)*100) : 0}%`} color="#3B82F6" />
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Avg Resolution Time</span>
                <span className="font-semibold">{deptInfo?.avgResolutionTime || 38} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dept. Head</span>
                <span className="font-semibold text-xs">{deptInfo?.head || 'N/A'}</span>
              </div>
            </div>
          </Card>

          {/* Priority breakdown */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">By Priority</h3>
            {(['emergency', 'high', 'medium', 'low'] as const).map(p => {
              const count = tickets.filter(t => t.priority === p).length;
              const colors = { emergency: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' };
              if (count === 0) return null;
              return (
                <div key={p} className="flex justify-between items-center mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[p]}`}>{p.toUpperCase()}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
};

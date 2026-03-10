import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, SortAsc } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { TicketCard, getStatusBadge, getPriorityBadge } from '../../components/tickets/TicketCard';
import { Input, Select } from '../../components/ui';
import { TicketStatus, TicketPriority } from '../../types';

export const MyComplaints: React.FC = () => {
  const { user } = useAuthStore();
  const { getTicketsByUser } = useTicketStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const navigate = useNavigate();

  const tickets = getTicketsByUser(user?.id || '');

  const filtered = tickets
    .filter(t => {
      if (search) {
        const s = search.toLowerCase();
        return t.title.toLowerCase().includes(s) || t.ticketNumber.toLowerCase().includes(s) || t.description.toLowerCase().includes(s);
      }
      return true;
    })
    .filter(t => !statusFilter || t.status === statusFilter)
    .filter(t => !priorityFilter || t.priority === priorityFilter)
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'priority') {
        const order = { emergency: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  const statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'escalated', label: 'Escalated' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'By Priority' },
  ];

  const stats = {
    total: tickets.length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    emergency: tickets.filter(t => t.isEmergency).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage all your submitted complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Resolved', value: stats.resolved, color: 'bg-green-50 text-green-700' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Emergency', value: stats.emergency, color: 'bg-red-50 text-red-700' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-3 text-center ${stat.color.split(' ')[0]}`}>
            <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Search by title or ticket ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          placeholder="All Status"
          className="w-40"
        />
        <Select
          options={sortOptions}
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="w-36"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">No complaints found</p>
          <p className="text-sm mt-1">
            {tickets.length === 0
              ? 'You haven\'t submitted any complaints yet.'
              : 'Try adjusting your search or filters.'}
          </p>
          {tickets.length === 0 && (
            <button onClick={() => navigate('/submit-complaint')} className="mt-4 text-blue-600 hover:underline text-sm">
              Submit your first complaint →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found</p>
          {filtered.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

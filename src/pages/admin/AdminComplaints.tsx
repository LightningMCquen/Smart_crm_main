import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, Eye, CheckCircle, ArrowUp, User, Building2, Clock } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { TicketStatus, TicketPriority } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-gray-100 text-gray-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-200 text-gray-500',
  escalated: 'bg-red-100 text-red-700',
  rejected: 'bg-red-50 text-red-400',
};

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-green-50 text-green-700',
  medium: 'bg-yellow-50 text-yellow-700',
  high: 'bg-orange-50 text-orange-700',
  emergency: 'bg-red-50 text-red-700',
};

export const AdminComplaints: React.FC = () => {
  const { tickets, updateTicketStatus } = useTicketStore();
  const { addNotification } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [selected, setSelected] = useState<string[]>([]);

  const categories = [...new Set(tickets.map(t => t.category))];

  const filtered = tickets
    .filter(t => {
      const q = search.toLowerCase();
      return (
        (statusFilter === 'all' || t.status === statusFilter) &&
        (priorityFilter === 'all' || t.priority === priorityFilter) &&
        (categoryFilter === 'all' || t.category === categoryFilter) &&
        (!q || t.title.toLowerCase().includes(q) || t.ticketNumber.toLowerCase().includes(q) || t.citizenName.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order: Record<string, number> = { emergency: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleBulkStatusUpdate = (status: TicketStatus) => {
    selected.forEach(id => updateTicketStatus(id, status, 'Admin bulk action'));
    setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Complaints</h1>
          <p className="text-gray-500 text-sm">{filtered.length} complaints found</p>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selected.length} selected</span>
            <button onClick={() => handleBulkStatusUpdate('under_review')} className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg">Mark Under Review</button>
            <button onClick={() => handleBulkStatusUpdate('resolved')} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">Mark Resolved</button>
            <button onClick={() => setSelected([])} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">Clear</button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Priorities</option>
            <option value="emergency">Emergency</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={e => setSelected(e.target.checked ? filtered.map(t => t.id) : [])}
                    className="rounded"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Ticket ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Complaint</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Citizen</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Priority</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    No complaints found matching your filters
                  </td>
                </tr>
              ) : (
                filtered.map(ticket => (
                  <tr key={ticket.id} className={cn('hover:bg-gray-50 transition-colors', selected.includes(ticket.id) && 'bg-blue-50')}>
                    <td className="px-4 py-3">
                      <input type="checkbox"
                        checked={selected.includes(ticket.id)}
                        onChange={() => toggleSelect(ticket.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-blue-600">{ticket.ticketNumber}</span>
                      {ticket.isEmergency && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <AlertTriangle size={10} className="text-red-500" />
                          <span className="text-xs text-red-500">EMERGENCY</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 max-w-48 truncate">{ticket.title}</p>
                      <p className="text-xs text-gray-400 max-w-48 truncate">{ticket.location.address}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={12} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800">{ticket.citizenName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{ticket.category}</span>
                      <p className="text-xs text-gray-400">{ticket.subCategory}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', PRIORITY_STYLES[ticket.priority])}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_STYLES[ticket.status])}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link to={`/ticket/${ticket.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => {
                            updateTicketStatus(ticket.id, 'escalated', 'Escalated by admin');
                            addNotification({
                              userId: ticket.citizenId,
                              type: 'escalation',
                              title: 'Complaint Escalated',
                              message: `Your complaint ${ticket.ticketNumber} has been escalated for priority attention.`,
                              ticketId: ticket.id,
                              isRead: false,
                            });
                          }}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Escalate"
                        >
                          <ArrowUp size={14} />
                        </button>
                        {ticket.status !== 'resolved' && (
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'resolved', 'Resolved by admin')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark Resolved"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaints;

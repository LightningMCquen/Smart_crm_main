import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { Card, Button, Badge, Select } from '../../components/ui';
import { TicketCard, getStatusBadge, getPriorityBadge } from '../../components/tickets/TicketCard';
import { formatDateTime } from '../../lib/utils';
import { Search, Filter, X, User, ChevronDown, SortAsc } from 'lucide-react';
import { TicketStatus } from '../../types';
import { DEPARTMENTS } from '../../data/categories';

export const ComplaintManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { getAllTickets, getTicketsByDepartment, updateTicketStatus, assignTicket, escalateTicket } = useTicketStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [managingTicket, setManagingTicket] = useState<string | null>(null);
  const [assignDept, setAssignDept] = useState('');
  const [assignWorker, setAssignWorker] = useState('');
  const [updateNote, setUpdateNote] = useState('');

  const isAdmin = user?.role === 'admin';
  const tickets = isAdmin ? getAllTickets() : getTicketsByDepartment(user?.department || '');

  const filtered = tickets
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.ticketNumber.toLowerCase().includes(search.toLowerCase()))
    .filter(t => !statusFilter || t.status === statusFilter)
    .filter(t => !priorityFilter || t.priority === priorityFilter);

  const statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'escalated', label: 'Escalated' },
  ];

  const priorityOpts = [
    { value: 'emergency', label: '🚨 Emergency' },
    { value: 'high', label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ];

  const MOCK_WORKERS = [
    { value: 'u4', label: 'Amit Singh (PWD)' },
    { value: 'w2', label: 'Ramesh Kumar (Sanitation)' },
    { value: 'w3', label: 'Priya Das (Electricity)' },
    { value: 'w4', label: 'Suresh Yadav (Water Dept.)' },
  ];

  const ticketBeingManaged = tickets.find(t => t.id === managingTicket);

  const handleStatusUpdate = (ticketId: string, status: TicketStatus) => {
    updateTicketStatus(ticketId, status, user?.name || 'Officer', updateNote);
    setManagingTicket(null);
    setUpdateNote('');
  };

  const handleAssign = (ticketId: string) => {
    const workerOption = MOCK_WORKERS.find(w => w.value === assignWorker);
    assignTicket(ticketId, assignDept || user?.department || '', assignWorker, workerOption?.label.split(' (')[0]);
    setManagingTicket(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? 'All Complaints' : 'Department Complaints'}</h1>
        <p className="text-gray-500 text-sm">{filtered.length} complaints</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search complaints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Select options={statusOptions} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} placeholder="All Status" className="w-36" />
        <Select options={priorityOpts} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} placeholder="All Priority" className="w-36" />
        {(statusFilter || priorityFilter || search) && (
          <button onClick={() => { setStatusFilter(''); setPriorityFilter(''); setSearch(''); }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filtered.map(ticket => (
          <div key={ticket.id}>
            <TicketCard
              ticket={ticket}
              showActions
              onAction={t => setManagingTicket(t.id === managingTicket ? null : t.id)}
            />
            
            <AnimatePresence>
              {managingTicket === ticket.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border border-blue-200 rounded-b-xl px-5 py-4 space-y-4 -mt-2 pt-6 shadow-inner"
                >
                  <p className="text-sm font-semibold text-gray-800 border-b pb-2">Manage: {ticket.ticketNumber}</p>
                  
                  {/* Update Status */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {(['under_review', 'assigned', 'in_progress', 'resolved', 'escalated', 'rejected'] as TicketStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(ticket.id, s)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                            s === 'resolved' ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' :
                            s === 'escalated' ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' :
                            'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                      ))}
                    </div>
                    <input
                      className="mt-2 w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Add a note (optional)..."
                      value={updateNote}
                      onChange={e => setUpdateNote(e.target.value)}
                    />
                  </div>

                  {/* Assign Worker */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Assign to Field Worker</p>
                    <div className="grid grid-cols-2 gap-2">
                      {isAdmin && (
                        <Select
                          options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                          value={assignDept}
                          onChange={e => setAssignDept(e.target.value)}
                          placeholder="Select Department"
                        />
                      )}
                      <Select
                        options={MOCK_WORKERS}
                        value={assignWorker}
                        onChange={e => setAssignWorker(e.target.value)}
                        placeholder="Select Worker"
                      />
                    </div>
                    <Button size="sm" className="mt-2" onClick={() => handleAssign(ticket.id)} disabled={!assignWorker && !assignDept}>
                      Assign Now
                    </Button>
                  </div>

                  <button onClick={() => setManagingTicket(null)} className="text-xs text-gray-400 hover:text-gray-600">✕ Close</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {filtered.length === 0 && (
          <Card className="p-10 text-center text-gray-400">
            <p>No complaints found</p>
          </Card>
        )}
      </div>
    </div>
  );
};

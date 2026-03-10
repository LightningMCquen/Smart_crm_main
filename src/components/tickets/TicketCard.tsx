import React from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../../types';
import { Badge } from '../ui';
import { formatDateTime, timeAgo } from '../../lib/utils';
import { MapPin, Clock, User, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function getStatusBadge(status: TicketStatus) {
  const map: Record<TicketStatus, { variant: any; label: string }> = {
    submitted: { variant: 'info', label: '📋 Submitted' },
    under_review: { variant: 'warning', label: '🔍 Under Review' },
    assigned: { variant: 'purple', label: '👤 Assigned' },
    in_progress: { variant: 'warning', label: '🔧 In Progress' },
    resolved: { variant: 'success', label: '✅ Resolved' },
    closed: { variant: 'default', label: '🔒 Closed' },
    escalated: { variant: 'danger', label: '⚠️ Escalated' },
    rejected: { variant: 'danger', label: '❌ Rejected' },
  };
  return map[status] || { variant: 'default', label: status };
}

export function getPriorityBadge(priority: TicketPriority) {
  const map: Record<TicketPriority, { variant: any; label: string }> = {
    low: { variant: 'default', label: '🟢 Low' },
    medium: { variant: 'warning', label: '🟡 Medium' },
    high: { variant: 'danger', label: '🔴 High' },
    emergency: { variant: 'emergency', label: '🚨 EMERGENCY' },
  };
  return map[priority] || { variant: 'default', label: priority };
}

interface TicketCardProps {
  ticket: Ticket;
  showActions?: boolean;
  onAction?: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, showActions, onAction }) => {
  const navigate = useNavigate();
  const statusBadge = getStatusBadge(ticket.status);
  const priorityBadge = getPriorityBadge(ticket.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${ticket.isEmergency ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
      onClick={() => navigate(`/ticket/${ticket.id}`)}
    >
      {ticket.isEmergency && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold mb-2 bg-red-100 px-2 py-1 rounded-md w-fit">
          <AlertTriangle size={12} /> EMERGENCY TICKET
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-mono">{ticket.ticketNumber}</span>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{ticket.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ticket.description}</p>
          
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={12} /> {ticket.location.address}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} /> {timeAgo(ticket.createdAt)}
            </div>
            {ticket.assignedDepartment && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <User size={12} /> {ticket.assignedDepartment}
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex flex-col gap-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onAction?.(ticket)}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 flex items-center gap-1"
            >
              Manage <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface TicketTimelineProps {
  ticket: Ticket;
}

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ ticket }) => {
  return (
    <div className="space-y-4">
      {ticket.timeline.map((event, idx) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
              idx === ticket.timeline.length - 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {idx + 1}
            </div>
            {idx < ticket.timeline.length - 1 && <div className="w-0.5 h-4 bg-gray-200 mt-1" />}
          </div>
          <div className="pb-4">
            <p className="font-medium text-sm text-gray-900">{event.event}</p>
            <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              by {event.actor} · {formatDateTime(event.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

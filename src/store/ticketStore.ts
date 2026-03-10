import { create } from 'zustand';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { MOCK_TICKETS, generateTicketNumber } from '../data/mockData';

interface TicketState {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'timeline' | 'createdAt' | 'updatedAt'>) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus, actor: string, note?: string) => void;
  assignTicket: (id: string, department: string, workerId?: string, workerName?: string) => void;
  escalateTicket: (id: string, to: string) => void;
  addFeedback: (id: string, rating: number, comment: string) => void;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByDepartment: (dept: string) => Ticket[];
  getTicketsByWorker: (workerId: string) => Ticket[];
  getAllTickets: () => Ticket[];
}

export const useTicketStore = create<TicketState>()((set, get) => ({
  tickets: MOCK_TICKETS,

  addTicket: (ticketData) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `t_${Date.now()}`,
      ticketNumber: generateTicketNumber(),
      timeline: [{
        id: `tl_${Date.now()}`,
        event: 'Ticket Submitted',
        description: 'Complaint successfully submitted by citizen',
        actor: ticketData.citizenName,
        actorRole: 'citizen',
        timestamp: new Date().toISOString(),
        status: 'submitted',
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set(state => ({ tickets: [newTicket, ...state.tickets] }));
    return newTicket;
  },

  updateTicketStatus: (id, status, actor, note) => {
    set(state => ({
      tickets: state.tickets.map(t => {
        if (t.id !== id) return t;
        const event = {
          id: `tl_${Date.now()}`,
          event: `Status: ${status.replace('_', ' ').toUpperCase()}`,
          description: note || `Ticket status updated to ${status}`,
          actor,
          actorRole: 'admin' as const,
          timestamp: new Date().toISOString(),
          status,
        };
        return {
          ...t,
          status,
          updatedAt: new Date().toISOString(),
          resolvedAt: status === 'resolved' ? new Date().toISOString() : t.resolvedAt,
          timeline: [...t.timeline, event],
        };
      })
    }));
  },

  assignTicket: (id, department, workerId, workerName) => {
    set(state => ({
      tickets: state.tickets.map(t => {
        if (t.id !== id) return t;
        const event = {
          id: `tl_${Date.now()}`,
          event: 'Assigned to Department',
          description: `Assigned to ${department}${workerName ? ` - ${workerName}` : ''}`,
          actor: 'Admin',
          actorRole: 'admin' as const,
          timestamp: new Date().toISOString(),
          status: 'assigned' as TicketStatus,
        };
        return {
          ...t,
          status: 'assigned' as TicketStatus,
          assignedDepartment: department,
          assignedWorkerId: workerId,
          assignedWorkerName: workerName,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, event],
        };
      })
    }));
  },

  escalateTicket: (id, to) => {
    set(state => ({
      tickets: state.tickets.map(t => {
        if (t.id !== id) return t;
        const event = {
          id: `tl_${Date.now()}`,
          event: '⚠️ Escalated',
          description: `Ticket escalated to ${to} due to delay`,
          actor: 'System',
          actorRole: 'admin' as const,
          timestamp: new Date().toISOString(),
          status: 'escalated' as TicketStatus,
        };
        return { ...t, status: 'escalated' as TicketStatus, escalatedTo: to, timeline: [...t.timeline, event], updatedAt: new Date().toISOString() };
      })
    }));
  },

  addFeedback: (id, rating, comment) => {
    set(state => ({
      tickets: state.tickets.map(t => {
        if (t.id !== id) return t;
        return { ...t, feedback: { rating, comment, submittedAt: new Date().toISOString() } };
      })
    }));
  },

  getTicketsByUser: (userId) => get().tickets.filter(t => t.citizenId === userId),
  getTicketsByDepartment: (dept) => get().tickets.filter(t => t.assignedDepartment === dept),
  getTicketsByWorker: (workerId) => get().tickets.filter(t => t.assignedWorkerId === workerId),
  getAllTickets: () => get().tickets,
}));

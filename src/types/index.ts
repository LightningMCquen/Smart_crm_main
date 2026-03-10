// ============================================================
// Smart PS-CRM Type Definitions
// ============================================================

export type UserRole = 'citizen' | 'admin' | 'department_manager' | 'field_worker';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string; // for service providers
  city: string;
  ward?: string;
  avatar?: string;
  points: number;
  badges: Badge[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export type TicketStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'escalated'
  | 'rejected';

export type TicketPriority = 'low' | 'medium' | 'high' | 'emergency';

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  status: TicketStatus;
  priority: TicketPriority;
  location: {
    address: string;
    lat: number;
    lng: number;
    ward?: string;
    pincode?: string;
  };
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  assignedDepartment?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  images: string[];
  aiDetectedCategory?: string;
  aiConfidence?: number;
  isEmergency: boolean;
  mergedWith?: string[]; // merged duplicate tickets
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  resolvedAt?: string;
  escalatedTo?: string;
}

export interface TimelineEvent {
  id: string;
  event: string;
  description: string;
  actor: string;
  actorRole: UserRole;
  timestamp: string;
  status?: TicketStatus;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  department: string;
  subCategories: SubCategory[];
  keywords: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  defaultPriority: TicketPriority;
  isEmergency: boolean;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  email: string;
  phone: string;
  totalTickets: number;
  resolvedTickets: number;
  pendingTickets: number;
  avgResolutionTime: number; // in hours
  efficiency: number; // percentage
}

export interface Notification {
  id: string;
  userId: string;
  type: 'status_update' | 'assignment' | 'escalation' | 'feedback_request' | 'emergency' | 'system';
  title: string;
  message: string;
  ticketId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Analytics {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  emergencyComplaints: number;
  avgResolutionTime: number;
  resolutionRate: number;
  departmentPerformance: DepartmentPerf[];
  categoryDistribution: CategoryDist[];
  weeklyTrend: WeeklyData[];
  hotspots: Hotspot[];
}

export interface DepartmentPerf {
  name: string;
  resolved: number;
  pending: number;
  efficiency: number;
  avgTime: number;
}

export interface CategoryDist {
  category: string;
  count: number;
  percentage: number;
}

export interface WeeklyData {
  day: string;
  submitted: number;
  resolved: number;
}

export interface Hotspot {
  lat: number;
  lng: number;
  intensity: number;
  category: string;
  ward: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  ticketsReported: number;
  ticketsResolved: number;
  badges: number;
}

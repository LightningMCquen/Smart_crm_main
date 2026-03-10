import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, User, AlertTriangle, Star, MessageSquare, Phone, Mail } from 'lucide-react';
import { useTicketStore } from '../store/ticketStore';
import { useAuthStore } from '../store/authStore';
import { Card, Button, Badge, Textarea } from '../components/ui';
import { TicketTimeline, getStatusBadge, getPriorityBadge } from '../components/tickets/TicketCard';
import { formatDateTime } from '../lib/utils';
import { CATEGORIES } from '../data/categories';

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAllTickets, addFeedback, updateTicketStatus } = useTicketStore();
  const { user } = useAuthStore();
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const ticket = getAllTickets().find(t => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Ticket not found</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">← Go Back</Button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(ticket.status);
  const priorityBadge = getPriorityBadge(ticket.priority);
  const category = CATEGORIES.find(c => c.id === ticket.category);
  const subCategory = category?.subCategories.find(s => s.id === ticket.subCategory);

  const canGiveFeedback = ticket.status === 'resolved' && user?.role === 'citizen' && user.id === ticket.citizenId && !ticket.feedback;

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0) return;
    addFeedback(ticket.id, feedbackRating, feedbackComment);
    setFeedbackSubmitted(true);
    setShowFeedback(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />}>Back</Button>
        <div className="flex-1" />
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
      </div>

      {ticket.isEmergency && (
        <div className="bg-red-600 text-white rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={24} />
          <div>
            <p className="font-bold">🚨 EMERGENCY TICKET</p>
            <p className="text-sm text-red-100">This is an emergency complaint. Authorities have been notified immediately.</p>
          </div>
        </div>
      )}

      {/* Main Info */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-1">{ticket.ticketNumber}</p>
            <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
          </div>
          {category && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xl">{category.icon}</span>
              <div>
                <p className="text-xs font-medium text-gray-700">{category.name}</p>
                {subCategory && <p className="text-xs text-gray-400">{subCategory.name}</p>}
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed">{ticket.description}</p>

        {ticket.aiDetectedCategory && (
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
            <span className="text-purple-600 text-sm">🤖 AI Detection: <strong>{CATEGORIES.find(c => c.id === ticket.aiDetectedCategory)?.name}</strong> — Confidence: {ticket.aiConfidence}%</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={15} className="text-gray-400" />
            {ticket.location.address}
            {ticket.location.ward && <span className="text-gray-400">· {ticket.location.ward}</span>}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={15} className="text-gray-400" />
            Submitted: {formatDateTime(ticket.createdAt)}
          </div>
          {ticket.assignedDepartment && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <User size={15} />
              Assigned to: <strong>{ticket.assignedDepartment}</strong>
            </div>
          )}
          {ticket.assignedWorkerName && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <User size={15} />
              Field Worker: <strong>{ticket.assignedWorkerName}</strong>
            </div>
          )}
          {ticket.deadline && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <Clock size={15} />
              Deadline: {formatDateTime(ticket.deadline)}
            </div>
          )}
          {ticket.escalatedTo && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle size={15} />
              Escalated to: <strong>{ticket.escalatedTo}</strong>
            </div>
          )}
        </div>
      </Card>

      {/* Images */}
      {ticket.images.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-3">📸 Evidence Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ticket.images.map((img, idx) => (
              <img key={idx} src={img} alt="evidence" className="rounded-lg w-full h-48 object-cover" />
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📋 Progress Timeline</h3>
        <TicketTimeline ticket={ticket} />
      </Card>

      {/* Feedback */}
      {canGiveFeedback && !feedbackSubmitted && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">🎉 Issue Resolved! Rate the service</h3>
          <p className="text-sm text-green-600 mb-4">Your issue has been resolved. How was your experience?</p>
          {showFeedback ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setFeedbackRating(star)} className="text-3xl">
                    {feedbackRating >= star ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Share your feedback (optional)"
                value={feedbackComment}
                onChange={e => setFeedbackComment(e.target.value)}
                rows={3}
              />
              <div className="flex gap-3">
                <Button onClick={handleFeedbackSubmit} size="sm" disabled={feedbackRating === 0}>Submit Feedback</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFeedback(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowFeedback(true)} size="sm" icon={<Star size={16} />}>Give Feedback</Button>
          )}
        </Card>
      )}

      {feedbackSubmitted && (
        <Card className="p-6 bg-green-50 border-green-200 text-center">
          <p className="text-green-700 font-medium">✅ Thank you for your feedback! +50 points earned.</p>
        </Card>
      )}

      {ticket.feedback && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-3">💬 Citizen Feedback</h3>
          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map(s => <span key={s}>{ticket.feedback!.rating >= s ? '⭐' : '☆'}</span>)}
            <span className="text-sm text-gray-500 ml-2">{ticket.feedback.rating}/5</span>
          </div>
          {ticket.feedback.comment && <p className="text-sm text-gray-600 italic">"{ticket.feedback.comment}"</p>}
        </Card>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { Card, Button, Badge } from '../../components/ui';
import { TicketCard } from '../../components/tickets/TicketCard';
import { MapPin, Navigation, CheckCircle, Clock, Camera, Upload, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FieldWorkerTasks: React.FC = () => {
  const { user } = useAuthStore();
  const { getTicketsByWorker, updateTicketStatus } = useTicketStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const navigate = useNavigate();

  const tickets = getTicketsByWorker(user?.id || '');
  const pending = tickets.filter(t => !['resolved', 'closed'].includes(t.status));
  const completed = tickets.filter(t => ['resolved', 'closed'].includes(t.status));

  const current = activeTab === 'pending' ? pending : completed;

  const handleMarkDone = (ticketId: string) => {
    updateTicketStatus(ticketId, 'resolved', user?.name || 'Field Worker', 'Issue resolved on-ground. Proof uploaded.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.department} · {user?.ward}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{tickets.length}</p>
          <p className="text-xs text-gray-500">Total Tasks</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{pending.length}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{completed.length}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['pending', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'pending' ? `Pending (${pending.length})` : `Completed (${completed.length})`}
          </button>
        ))}
      </div>

      {/* Task Map Teaser */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">View Tasks on Map</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/worker/map')} icon={<Navigation size={14} />}>
            Open Map
          </Button>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {current.length === 0 ? (
          <Card className="p-8 text-center text-gray-400">
            {activeTab === 'pending' ? (
              <>
                <CheckCircle size={40} className="mx-auto mb-3 text-green-300" />
                <p>All caught up! No pending tasks.</p>
              </>
            ) : (
              <>
                <Clock size={40} className="mx-auto mb-3 opacity-40" />
                <p>No completed tasks yet.</p>
              </>
            )}
          </Card>
        ) : (
          current.map(ticket => (
            <div key={ticket.id} className="space-y-2">
              <TicketCard ticket={ticket} />
              
              {activeTab === 'pending' && (
                <div className="flex gap-2 px-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Navigation size={14} />}
                    onClick={() => window.open(`https://maps.google.com/?q=${ticket.location.lat},${ticket.location.lng}`)}
                  >
                    Navigate
                  </Button>
                  <Button
                    size="sm"
                    icon={<Camera size={14} />}
                    variant="secondary"
                    onClick={() => alert('Upload proof of work (feature available in full version)')}
                  >
                    Upload Proof
                  </Button>
                  <Button
                    size="sm"
                    icon={<CheckCircle size={14} />}
                    onClick={() => handleMarkDone(ticket.id)}
                  >
                    Mark Done
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const WorkerMap: React.FC = () => {
  const { user } = useAuthStore();
  const { getTicketsByWorker } = useTicketStore();
  const tickets = getTicketsByWorker(user?.id || '');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Task Map</h1>
      
      <Card className="overflow-hidden">
        {/* Mock Map View */}
        <div className="bg-gradient-to-br from-green-100 to-blue-100 relative" style={{ height: 400 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-3">🗺️</p>
              <p className="font-semibold text-gray-700">Interactive Map View</p>
              <p className="text-sm text-gray-500 mt-2">Showing {tickets.length} task{tickets.length !== 1 ? 's' : ''} in your assigned zone</p>
            </div>
          </div>
          
          {/* Mock pins */}
          {tickets.map((t, idx) => (
            <div
              key={t.id}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-pointer ${
                t.priority === 'emergency' ? 'bg-red-600' : t.priority === 'high' ? 'bg-orange-500' : 'bg-blue-600'
              }`}
              style={{ left: `${20 + idx * 20}%`, top: `${30 + idx * 15}%` }}
              title={t.title}
            >
              <MapPin size={16} />
            </div>
          ))}
        </div>
        
        <div className="p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Your Assigned Locations</p>
          <div className="space-y-2">
            {tickets.map(t => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  t.priority === 'emergency' ? 'bg-red-600' : t.priority === 'high' ? 'bg-orange-500' : 'bg-blue-600'
                }`} />
                <span className="flex-1 text-gray-700">{t.title}</span>
                <span className="text-xs text-gray-400">{t.location.ward}</span>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${t.location.lat},${t.location.lng}`)}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Navigation size={12} /> Navigate
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

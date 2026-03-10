import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle, Clock, ZoomIn, ZoomOut, Filter } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { cn } from '../../lib/utils';

const CITY_WARDS = [
  { id: 'w1', name: 'Ward 1 - Colaba', lat: 18.906, lng: 72.815 },
  { id: 'w2', name: 'Ward 2 - Fort', lat: 18.932, lng: 72.834 },
  { id: 'w3', name: 'Ward 3 - Byculla', lat: 18.975, lng: 72.835 },
  { id: 'w4', name: 'Ward 4 - Kurla', lat: 19.073, lng: 72.879 },
  { id: 'w5', name: 'Ward 5 - Andheri', lat: 19.116, lng: 72.855 },
  { id: 'w6', name: 'Ward 6 - Borivali', lat: 19.228, lng: 72.856 },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Roads': '#EF4444',
  'Water Supply': '#3B82F6',
  'Sanitation': '#10B981',
  'Electricity': '#F59E0B',
  'Public Infrastructure': '#8B5CF6',
  'default': '#6B7280',
};

export const AdminMap: React.FC = () => {
  const { tickets } = useTicketStore();
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const filteredTickets = tickets.filter(t =>
    filterCategory === 'all' || t.category === filterCategory
  );

  const emergencyTickets = tickets.filter(t => t.isEmergency);
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');
  const pendingTickets = tickets.filter(t => !['resolved', 'closed'].includes(t.status));

  const categories = [...new Set(tickets.map(t => t.category))];

  // Mock hotspot data with relative positions on a grid
  const hotspots = [
    { id: 'h1', x: 20, y: 30, intensity: 5, ward: 'Ward 42', category: 'Roads', count: 12 },
    { id: 'h2', x: 40, y: 45, intensity: 8, ward: 'Ward 15', category: 'Water Supply', count: 18 },
    { id: 'h3', x: 60, y: 25, intensity: 3, ward: 'Ward 7', category: 'Sanitation', count: 7 },
    { id: 'h4', x: 75, y: 65, intensity: 6, ward: 'Ward 33', category: 'Electricity', count: 14 },
    { id: 'h5', x: 35, y: 70, intensity: 4, ward: 'Ward 22', category: 'Roads', count: 9 },
    { id: 'h6', x: 55, y: 50, intensity: 7, ward: 'Ward 18', category: 'Water Supply', count: 16 },
    { id: 'h7', x: 80, y: 40, intensity: 2, ward: 'Ward 5', category: 'Public Infrastructure', count: 4 },
    { id: 'h8', x: 25, y: 55, intensity: 9, ward: 'Ward 11', category: 'Roads', count: 22 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GIS Command Map</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time citywide complaint hotspot visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Active', value: pendingTickets.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
          { label: 'Emergencies', value: emergencyTickets.length, color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
          { label: 'Resolved Today', value: resolvedTickets.length, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
          { label: 'Hotspots', value: hotspots.filter(h => h.intensity >= 6).length, color: 'text-orange-600', bg: 'bg-orange-50', icon: MapPin },
        ].map((stat, i) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', stat.bg)}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Mumbai City — Complaint Hotspots</h2>
            <div className="flex gap-2">
              <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ZoomIn size={14} /></button>
              <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ZoomOut size={14} /></button>
              <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Filter size={14} /></button>
            </div>
          </div>

          {/* Mock Map Grid */}
          <div className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-green-50" style={{ height: '400px' }}>
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            {/* Ward labels */}
            {CITY_WARDS.map((ward, i) => (
              <div
                key={ward.id}
                className="absolute text-xs text-gray-400 font-medium"
                style={{ left: `${(i * 17) + 5}%`, top: `${(i % 3) * 25 + 5}%` }}
              >
                {ward.name.split(' - ')[1]}
              </div>
            ))}

            {/* Hotspot circles */}
            {hotspots
              .filter(h => filterCategory === 'all' || h.category === filterCategory)
              .map(spot => (
                <motion.div
                  key={spot.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedTicket(selectedTicket === spot.id ? null : spot.id)}
                  className="absolute cursor-pointer"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  {/* Pulse ring for high intensity */}
                  {spot.intensity >= 7 && (
                    <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping"
                      style={{ width: `${spot.intensity * 6}px`, height: `${spot.intensity * 6}px` }}
                    />
                  )}
                  <div
                    className="rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
                    style={{
                      width: `${Math.max(spot.intensity * 4, 24)}px`,
                      height: `${Math.max(spot.intensity * 4, 24)}px`,
                      backgroundColor: CATEGORY_COLORS[spot.category] || CATEGORY_COLORS.default,
                      opacity: 0.85 + (spot.intensity * 0.02),
                    }}
                  >
                    {spot.count}
                  </div>
                  {/* Tooltip */}
                  {selectedTicket === spot.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10"
                    >
                      <p className="font-medium">{spot.ward}</p>
                      <p className="text-gray-300">{spot.category}: {spot.count} issues</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-xl p-3 text-xs space-y-1.5 shadow-sm">
              <p className="font-medium text-gray-700 mb-2">Intensity Legend</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 opacity-90" />
                <span className="text-gray-600">Critical (8-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 opacity-80" />
                <span className="text-gray-600">High (5-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-70" />
                <span className="text-gray-600">Medium (3-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 opacity-60" />
                <span className="text-gray-600">Low (1-2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Category Legend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Category Map</h3>
            <div className="space-y-2">
              {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== 'default').map(([cat, color]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {hotspots.filter(h => h.category === cat).reduce((a, h) => a + h.count, 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hotspots */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">🔥 Top Hotspots</h3>
            <div className="space-y-2">
              {[...hotspots]
                .sort((a, b) => b.intensity - a.intensity)
                .slice(0, 5)
                .map((spot, i) => (
                  <div key={spot.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white',
                        i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                      )}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-gray-800">{spot.ward}</p>
                        <p className="text-xs text-gray-400">{spot.category}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{spot.count}</span>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2">AI Recommendations</h3>
            <p className="text-xs text-blue-100 mb-3">Based on current hotspot data:</p>
            <div className="space-y-2 text-xs text-blue-50">
              <div className="flex gap-2 items-start">
                <span>•</span>
                <span>Deploy 2 road repair teams to Ward 11 immediately</span>
              </div>
              <div className="flex gap-2 items-start">
                <span>•</span>
                <span>Schedule water pipeline inspection in Ward 15</span>
              </div>
              <div className="flex gap-2 items-start">
                <span>•</span>
                <span>Increase patrol frequency in high-density zones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { Card, StatCard } from '../../components/ui';
import { DualBarChart, DonutChart, ProgressBar } from '../../components/charts/Charts';
import { MOCK_ANALYTICS, MOCK_DEPARTMENTS } from '../../data/mockData';
import { TrendingUp, Award, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

export const ProviderAnalytics: React.FC = () => {
  const { user } = useAuthStore();
  const { getAllTickets, getTicketsByDepartment } = useTicketStore();
  const isAdmin = user?.role === 'admin';
  const analytics = MOCK_ANALYTICS;
  const tickets = isAdmin ? getAllTickets() : getTicketsByDepartment(user?.department || '');

  const weekData = analytics.weeklyTrend;

  const predictionData = [
    { issue: 'Pothole surge expected', area: 'Ward 45, 46 (Monsoon)', confidence: '87%', action: 'Pre-fill repair kits' },
    { issue: 'Water shortage probable', area: 'Ward 72 (Summer)', confidence: '92%', action: 'Schedule extra tankers' },
    { issue: 'Street light failures', area: 'Ward 98 (Post-monsoon)', confidence: '78%', action: 'Proactive inspection needed' },
    { issue: 'Drain overflow risk', area: 'Ward 105 (Pre-monsoon)', confidence: '85%', action: 'Clean drains immediately' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isAdmin ? 'Citywide analytics' : user?.department}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value={tickets.length || analytics.totalComplaints} icon={<AlertTriangle size={20} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Resolution Rate" value={`${analytics.resolutionRate}%`} icon={<CheckCircle size={20} className="text-green-600" />} color="bg-green-50" change="+2.3% this month" changeType="up" />
        <StatCard title="Avg. Resolution" value={`${analytics.avgResolutionTime}h`} icon={<Clock size={20} className="text-yellow-600" />} color="bg-yellow-50" change="-3hrs improved" changeType="up" />
        <StatCard title="Departments" value={MOCK_DEPARTMENTS.length} icon={<Users size={20} className="text-purple-600" />} color="bg-purple-50" />
      </div>

      {/* Weekly Trend */}
      <Card className="p-6">
        <DualBarChart data={weekData} title="Weekly Complaint Trend (Submitted vs Resolved)" height={260} />
      </Card>

      {/* Department Performance Table */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award size={18} className="text-yellow-500" /> Department Performance League
        </h3>
        <div className="space-y-4">
          {analytics.departmentPerformance
            .sort((a, b) => b.efficiency - a.efficiency)
            .map((dept, idx) => (
            <div key={dept.name} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-800 truncate">{dept.name}</span>
                  <span className={`text-sm font-bold ${dept.efficiency >= 85 ? 'text-green-600' : dept.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {dept.efficiency}%
                  </span>
                </div>
                <ProgressBar
                  value={dept.efficiency}
                  color={dept.efficiency >= 85 ? '#10B981' : dept.efficiency >= 70 ? '#F59E0B' : '#EF4444'}
                  showPercent={false}
                />
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span>✅ {dept.resolved} resolved</span>
                  <span>⏳ {dept.pending} pending</span>
                  <span>⏱️ {dept.avgTime}h avg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Predictive Analytics */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          🔮 Predictive Analytics
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-normal">AI-Powered</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">Based on historical data, AI predicts these potential issues:</p>
        <div className="space-y-3">
          {predictionData.map(pred => (
            <div key={pred.issue} className="bg-white border border-purple-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">⚠️ {pred.issue}</p>
                  <p className="text-xs text-gray-500 mt-1">📍 {pred.area}</p>
                  <p className="text-xs text-blue-600 mt-1">💡 Recommendation: {pred.action}</p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">{pred.confidence} confidence</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Category breakdown */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Complaints by Category</h3>
        <div className="space-y-3">
          {analytics.categoryDistribution.map(cat => (
            <div key={cat.category} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{cat.category}</span>
                  <span className="text-xs font-semibold text-gray-600">{cat.count} ({cat.percentage}%)</span>
                </div>
                <ProgressBar value={cat.percentage} max={30} color="#3B82F6" showPercent={false} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

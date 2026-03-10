import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { MOCK_ANALYTICS } from '../../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { cn } from '../../lib/utils';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const AdminAnalytics: React.FC = () => {
  const { tickets } = useTicketStore();
  const analytics = MOCK_ANALYTICS;
  const [activeTab, setActiveTab] = useState<'overview' | 'dept' | 'predict'>('overview');

  const weeklyData = analytics.weeklyTrend;
  const deptData = analytics.departmentPerformance;
  const categoryData = analytics.categoryDistribution;

  // Predictive data (mock)
  const predictiveData = [
    { month: 'Apr', predicted: 42, actual: 38 },
    { month: 'May', predicted: 48, actual: 45 },
    { month: 'Jun', predicted: 55, actual: 52 },
    { month: 'Jul', predicted: 50, actual: null },
    { month: 'Aug', predicted: 45, actual: null },
    { month: 'Sep', predicted: 40, actual: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-500 text-sm mt-1">Comprehensive performance metrics and predictive analysis</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['overview', 'dept', 'predict'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab === 'dept' ? 'Departments' : tab === 'predict' ? 'Predictive' : 'Overview'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Complaints', value: analytics.totalComplaints, change: '+12%', up: true, icon: BarChart2, color: 'text-blue-600 bg-blue-50' },
              { label: 'Resolution Rate', value: `${analytics.resolutionRate}%`, change: '+5%', up: true, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
              { label: 'Avg Resolution', value: `${analytics.avgResolutionTime}h`, change: '-3h', up: true, icon: Clock, color: 'text-purple-600 bg-purple-50' },
              { label: 'Emergencies', value: analytics.emergencyComplaints, change: '-2', up: true, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
            ].map((kpi, i) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', kpi.color)}>
                  <kpi.icon size={18} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                <div className={cn('flex items-center gap-1 mt-1 text-xs', kpi.up ? 'text-green-600' : 'text-red-600')}>
                  <TrendingUp size={10} />
                  <span>{kpi.change} this month</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Weekly Trend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Weekly Complaint Trend</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="submitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="submitted" stroke="#3B82F6" fill="url(#submitted)" name="Submitted" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" fill="url(#resolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, percentage }) => `${category}: ${percentage}%`}>
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Category Breakdown</h2>
              <div className="space-y-3">
                {categoryData.map((cat, i) => (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.category}</span>
                      <span className="font-medium text-gray-900">{cat.count} ({cat.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dept' && (
        <div className="space-y-5">
          {/* Department Performance Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Department Performance Comparison</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[0, 4, 4, 0]} />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency Scores */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Efficiency Scoreboard</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {[...deptData].sort((a, b) => b.efficiency - a.efficiency).map((dept, i) => (
                <div key={dept.name} className="px-5 py-3 flex items-center gap-4">
                  <span className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    i === 0 ? 'bg-yellow-100 text-yellow-700' :
                    i === 1 ? 'bg-gray-200 text-gray-600' :
                    i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                  )}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{dept.name}</p>
                    <p className="text-xs text-gray-400">Avg {dept.avgTime}h resolution</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${dept.efficiency}%` }} />
                    </div>
                    <span className={cn(
                      'text-sm font-semibold',
                      dept.efficiency >= 80 ? 'text-green-600' : dept.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'
                    )}>
                      {dept.efficiency}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predict' && (
        <div className="space-y-5">
          {/* AI Predictive Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={20} />
              <h2 className="font-semibold">AI-Powered Predictive Analytics</h2>
            </div>
            <p className="text-sm text-white/80">
              Machine learning models analyze historical complaint patterns to predict future trends and recommend preventive actions.
            </p>
          </div>

          {/* Predictive Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-1">Complaint Volume Forecast (Next 3 months)</h2>
            <p className="text-xs text-gray-400 mb-4">Solid = actual, Dashed = predicted</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} name="Actual" dot={{ r: 4 }} connectNulls={false} />
                <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" name="Predicted" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: '🚰 Water Supply', risk: 'HIGH', insight: 'Based on monsoon season patterns, expect 40% surge in water leakage reports in July-August. Pre-deploy 3 additional repair teams.', trend: 'Increasing' },
              { title: '🛣️ Road Damage', risk: 'HIGH', insight: 'Post-monsoon road damage typically peaks in September. Allocate ₹2.5L emergency repair budget for Ward 11, 15, 22.', trend: 'Seasonal spike' },
              { title: '💡 Electricity', risk: 'MEDIUM', insight: 'Summer load-shedding complaints expected to rise 25% in May. Coordinate with BEST for grid maintenance schedules.', trend: 'Gradual increase' },
              { title: '🗑️ Sanitation', risk: 'LOW', insight: 'Current trends stable. Festival season may cause 15% increase in solid waste complaints in October.', trend: 'Stable' },
            ].map(rec => (
              <div key={rec.title} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{rec.title}</h3>
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    rec.risk === 'HIGH' ? 'bg-red-100 text-red-700' :
                    rec.risk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  )}>
                    {rec.risk} RISK
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rec.insight}</p>
                <p className="text-xs text-blue-600 mt-2 font-medium">Trend: {rec.trend}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;

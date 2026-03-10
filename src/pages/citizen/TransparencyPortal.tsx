import React from 'react';
import { Card } from '../../components/ui';
import { MOCK_ANALYTICS, MOCK_DEPARTMENTS } from '../../data/mockData';
import { DonutChart, DualBarChart, ProgressBar } from '../../components/charts/Charts';
import { BarChart2, CheckCircle, Clock, AlertTriangle, Users, TrendingUp, Eye } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const TransparencyPortal: React.FC = () => {
  const analytics = MOCK_ANALYTICS;

  const donutData = [
    { name: 'Resolved', value: analytics.resolvedComplaints, color: '#10B981' },
    { name: 'In Progress', value: analytics.inProgressComplaints, color: '#F59E0B' },
    { name: 'Pending', value: analytics.pendingComplaints, color: '#3B82F6' },
    { name: 'Emergency', value: analytics.emergencyComplaints, color: '#EF4444' },
  ];

  const categoryData = analytics.categoryDistribution.map((c, i) => ({
    name: c.category.split(' ')[0],
    value: c.count,
    color: CATEGORIES[i % CATEGORIES.length]?.color || '#3B82F6',
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Eye size={24} className="text-blue-600" /> Public Transparency Portal
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Real-time public data on complaint management across {MOCK_DEPARTMENTS[0]?.name.split(' ')[0]} city
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Complaints', value: analytics.totalComplaints.toLocaleString(), icon: '📋', color: 'bg-blue-50 border-blue-200' },
          { label: 'Resolved', value: analytics.resolvedComplaints.toLocaleString(), icon: '✅', color: 'bg-green-50 border-green-200' },
          { label: 'Resolution Rate', value: `${analytics.resolutionRate}%`, icon: '📈', color: 'bg-purple-50 border-purple-200' },
          { label: 'Avg. Resolution', value: `${analytics.avgResolutionTime}hrs`, icon: '⏱️', color: 'bg-orange-50 border-orange-200' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-4 text-center ${stat.color}`}>
            <span className="text-3xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <DonutChart data={donutData} title="Overall Complaint Status" height={180} />
        </Card>
        <Card className="p-5">
          <DualBarChart data={analytics.weeklyTrend} title="Weekly Trend (Last 7 Days)" height={220} />
        </Card>
      </div>

      {/* Category Distribution */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Complaints by Category</h3>
        <div className="space-y-3">
          {analytics.categoryDistribution.map((cat, idx) => {
            const catInfo = CATEGORIES.find(c => c.name.includes(cat.category.split(' ')[0]));
            return (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="w-6 text-center">{catInfo?.icon || '📌'}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{cat.category}</span>
                    <span className="font-semibold text-gray-900">{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <ProgressBar value={cat.percentage} max={30} color={catInfo?.color || '#3B82F6'} showPercent={false} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Department Performance */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" /> Department Performance
        </h3>
        <div className="space-y-4">
          {MOCK_DEPARTMENTS.map(dept => (
            <div key={dept.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{dept.name}</p>
                  <p className="text-xs text-gray-500">Head: {dept.head}</p>
                </div>
                <div className={`text-lg font-bold px-3 py-1 rounded-lg ${
                  dept.efficiency >= 85 ? 'bg-green-100 text-green-700' :
                  dept.efficiency >= 70 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {dept.efficiency}%
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="font-bold text-blue-700">{dept.totalTickets}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="font-bold text-green-700">{dept.resolvedTickets}</p>
                  <p className="text-xs text-gray-500">Resolved</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2">
                  <p className="font-bold text-orange-700">{dept.pendingTickets}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
              <ProgressBar value={dept.efficiency} label={`Efficiency: ${dept.efficiency}%`} color={dept.efficiency >= 85 ? '#10B981' : dept.efficiency >= 70 ? '#F59E0B' : '#EF4444'} />
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center text-xs text-gray-400 pb-4">
        Data updated in real-time · Last refreshed: Just now · Source: Municipal CRM System
      </div>
    </div>
  );
};

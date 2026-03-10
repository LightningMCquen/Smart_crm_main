import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart2, Clock, CheckCircle, Phone, Mail, Plus, Edit2, TrendingUp, Award } from 'lucide-react';
import { MOCK_DEPARTMENTS } from '../../data/mockData';
import { cn } from '../../lib/utils';

const colors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
  'bg-red-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500'
];

export const DepartmentManagement: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const departments = MOCK_DEPARTMENTS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor all departments and their performance metrics</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Depts', value: departments.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Tickets', value: departments.reduce((a, d) => a + d.totalTickets, 0), icon: BarChart2, color: 'text-purple-600 bg-purple-50' },
          { label: 'Resolved', value: departments.reduce((a, d) => a + d.resolvedTickets, 0), icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'Avg Efficiency', value: `${Math.round(departments.reduce((a, d) => a + d.efficiency, 0) / departments.length)}%`, icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept, idx) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => setSelected(selected === dept.id ? null : dept.id)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-all"
          >
            {/* Dept Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold', colors[idx % colors.length])}>
                  {dept.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{dept.name}</h3>
                  <p className="text-xs text-gray-500">{dept.head}</p>
                </div>
              </div>
              <div className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                dept.efficiency >= 80 ? 'bg-green-100 text-green-700' :
                dept.efficiency >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              )}>
                {dept.efficiency}% eff.
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-900">{dept.totalTickets}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-xl">
                <p className="text-lg font-bold text-green-700">{dept.resolvedTickets}</p>
                <p className="text-xs text-gray-500">Resolved</p>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-xl">
                <p className="text-lg font-bold text-orange-700">{dept.pendingTickets}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Resolution Progress</span>
                <span>{dept.totalTickets > 0 ? Math.round((dept.resolvedTickets / dept.totalTickets) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.totalTickets > 0 ? (dept.resolvedTickets / dept.totalTickets) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>

            {/* Avg resolution time */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>Avg resolution: {dept.avgResolutionTime}h</span>
            </div>

            {/* Expanded Details */}
            {selected === dept.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-100 space-y-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-600">{dept.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-600">{dept.phone}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                    <Award size={12} /> Performance Report
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Department Leaderboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Rank</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Department</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Tickets</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Resolved</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Avg Time</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...departments]
                .sort((a, b) => b.efficiency - a.efficiency)
                .map((dept, i) => (
                  <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-50 text-gray-500'
                      )}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{dept.totalTickets}</td>
                    <td className="px-6 py-3 text-sm text-green-600">{dept.resolvedTickets}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{dept.avgResolutionTime}h</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-16">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${dept.efficiency}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{dept.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Department</h3>
            <div className="space-y-3">
              {['Department Name', 'Head of Department', 'Email', 'Phone'].map(f => (
                <div key={f}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">{f}</label>
                  <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">Create</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface SimpleBarChartProps {
  data: { name: string; value: number; color?: string }[];
  title?: string;
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title, height = 200 }) => (
  <div>
    {title && <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

interface DualBarChartProps {
  data: { day: string; submitted: number; resolved: number }[];
  title?: string;
  height?: number;
}

export const DualBarChart: React.FC<DualBarChartProps> = ({ data, title, height = 250 }) => (
  <div>
    {title && <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="submitted" name="Submitted" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  title?: string;
  height?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, title, height = 250 }) => (
  <div>
    {title && <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>}
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={height} height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}`, name]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 flex-1">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-gray-600 flex-1">{entry.name}</span>
            <span className="text-xs font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface AreaLineChartProps {
  data: { name: string; value: number }[];
  title?: string;
  color?: string;
  height?: number;
}

export const AreaLineChart: React.FC<AreaLineChartProps> = ({ data, title, color = '#3B82F6', height = 200 }) => (
  <div>
    {title && <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>}
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#colorGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Progress Bar component
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, label, color = '#3B82F6', showPercent = true }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-gray-600">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-gray-800">{pct}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button, Input } from '../components/ui';

const DEMO_ACCOUNTS = [
  { role: 'Citizen', email: 'citizen@demo.com', password: 'citizen123', color: 'blue', desc: 'Submit & track complaints' },
  { role: 'Admin', email: 'admin@demo.com', password: 'admin123', color: 'purple', desc: 'Command center access' },
  { role: 'Manager', email: 'manager@demo.com', password: 'manager123', color: 'amber', desc: 'Department management' },
  { role: 'Field Worker', email: 'worker@demo.com', password: 'worker123', color: 'green', desc: 'Task management' },
];

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'citizen') navigate('/dashboard');
      else if (user?.role === 'admin') navigate('/admin/command-center');
      else if (user?.role === 'department_manager') navigate('/provider/dashboard');
      else navigate('/worker/tasks');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-white space-y-6 hidden lg:block"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PS-CRM</h1>
              <p className="text-blue-200 text-sm">Smart Public Service CRM</p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Transforming Citizens<br />Into Change Makers
            </h2>
            <p className="text-blue-200 mt-4 text-lg leading-relaxed">
              Report issues, track resolutions, and participate in making your city better.
              One platform for citizens and government.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '12,847+', desc: 'Complaints Resolved' },
              { label: '47 Depts', desc: 'Connected' },
              { label: '98.2%', desc: 'User Satisfaction' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 backdrop-blur">
                <p className="font-bold text-lg">{stat.label}</p>
                <p className="text-blue-200 text-xs">{stat.desc}</p>
              </div>
            ))}
          </div>
          
          <div>
            <p className="text-blue-200 text-sm mb-3 font-medium">🎯 Quick Demo Access:</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc)}
                  className="text-left bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
                >
                  <p className="text-white text-xs font-semibold">{acc.role}</p>
                  <p className="text-blue-200 text-[10px]">{acc.email}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">PS-CRM</h1>
              <p className="text-xs text-gray-500">Smart Public Service CRM</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to access your dashboard</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading} icon={<LogIn size={18} />}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">Create Account</Link>
          </p>

          {/* Mobile demo accounts */}
          <div className="mt-6 lg:hidden">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick Demo:</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc)}
                  className="text-left bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors border border-gray-200"
                >
                  <p className="text-gray-800 text-xs font-semibold">{acc.role}</p>
                  <p className="text-gray-400 text-[10px]">{acc.email}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

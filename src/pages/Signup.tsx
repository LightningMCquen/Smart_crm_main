import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, UserCircle, Building2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button, Input, Select } from '../components/ui';
import { UserRole } from '../types';
import { DEPARTMENTS } from '../data/categories';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' as UserRole,
    department: '',
    city: 'Mumbai',
    ward: '',
  });

  const roleOptions: { value: UserRole; label: string; icon: string; desc: string }[] = [
    { value: 'citizen', label: 'Citizen / Public User', icon: '👤', desc: 'Report issues and track your complaints' },
    { value: 'department_manager', label: 'Department Manager', icon: '🏛️', desc: 'Manage department complaints and workers' },
    { value: 'field_worker', label: 'Field Worker', icon: '🔧', desc: 'Receive tasks and resolve on-ground issues' },
    { value: 'admin', label: 'Administrator', icon: '🛡️', desc: 'Full platform access and oversight' },
  ];

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.phone) return 'Please fill all required fields';
    if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (form.role !== 'citizen' && !form.department) {
      setError('Please select your department');
      return;
    }
    setLoading(true);
    const result = await signup(form);
    setLoading(false);
    if (result.success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'citizen') navigate('/dashboard');
      else if (user?.role === 'admin') navigate('/admin/command-center');
      else if (user?.role === 'department_manager') navigate('/provider/dashboard');
      else navigate('/worker/tasks');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Create Account</h1>
            <p className="text-xs text-gray-500">PS-CRM Smart Public Service</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
            <Input label="Full Name *" placeholder="Enter your full name" value={form.name} onChange={e => set('name', e.target.value)} />
            <Input label="Email Address *" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            <Input label="Phone Number *" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value)} />
            <Input label="Password *" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
            <Input label="Confirm Password *" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
            <Button className="w-full" size="lg" onClick={handleNext}>Continue →</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Select Your Role</h2>
            <p className="text-sm text-gray-500">Choose how you'll use the platform</p>
            
            <div className="space-y-2">
              {roleOptions.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => set('role', opt.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    form.role === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${form.role === opt.value ? 'text-blue-700' : 'text-gray-800'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {form.role !== 'citizen' && (
              <Select
                label="Department *"
                value={form.department}
                onChange={e => set('department', e.target.value)}
                options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                placeholder="Select your department"
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={form.city} onChange={e => set('city', e.target.value)} />
              <Input label="Ward (optional)" placeholder="e.g. Ward 42" value={form.ward} onChange={e => set('ward', e.target.value)} />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
              <Button className="flex-1" size="lg" loading={loading} onClick={handleSubmit}>Create Account</Button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', loading, icon, className, disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed gap-2';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    emergency: 'bg-red-600 hover:bg-red-700 text-white animate-pulse focus:ring-red-500 shadow-lg shadow-red-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </motion.button>
  );
};

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'emergency' | 'info' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    emergency: 'bg-red-600 text-white animate-pulse',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover, glass }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      'rounded-xl border shadow-sm',
      glass ? 'bg-white/80 backdrop-blur-sm border-white/50' : 'bg-white border-gray-200',
      hover && 'hover:shadow-md transition-shadow duration-200 cursor-pointer',
      className
    )}
  >
    {children}
  </motion.div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, color, subtitle }) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {change && (
          <p className={cn('text-xs mt-2 font-medium', changeType === 'up' ? 'text-green-600' : 'text-red-500')}>
            {changeType === 'up' ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
      <div className={cn('p-3 rounded-lg', color)}>{icon}</div>
    </div>
  </Card>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, helper, leftIcon, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500',
          error && 'border-red-500 focus:ring-red-500',
          leftIcon && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    {helper && !error && <p className="mt-1 text-xs text-gray-400">{helper}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      className={cn(
        'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
        error && 'border-red-500',
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, placeholder, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      className={cn(
        'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white',
        error && 'border-red-500',
        className
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export const Spinner = ({ className }: { className?: string }) => (
  <svg className={cn('animate-spin h-5 w-5', className)} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

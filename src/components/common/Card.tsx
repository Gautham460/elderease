import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'secondary';
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className,
  action,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-white border-neutral-100',
    primary: 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200',
    success: 'bg-gradient-to-br from-success-50 to-success-100 border-success-200',
    warning: 'bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200',
    secondary: 'bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl shadow-card p-6 border transition-all duration-300 hover:shadow-elegant hover:border-primary-200',
        variantClasses[variant],
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

interface BadgeProps {
  status: 'success' | 'warning' | 'danger' | 'default' | 'info' | 'secondary';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, children, size = 'md', className }) => {
  const statusClasses = {
    success: 'bg-success-100 text-success-800 border border-success-300',
    warning: 'bg-warning-100 text-warning-800 border border-warning-300',
    danger: 'bg-accent-100 text-accent-800 border border-accent-300',
    default: 'bg-neutral-100 text-neutral-800 border border-neutral-300',
    info: 'bg-primary-100 text-primary-800 border border-primary-300',
    secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-300',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={clsx(
        'inline-block rounded-full font-semibold',
        statusClasses[status],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  gradient?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendValue,
  color = 'blue',
  gradient = true,
}) => {
  const colorClasses = {
    blue: gradient ? 'bg-gradient-to-br from-primary-50 to-primary-100' : 'bg-primary-50',
    green: gradient ? 'bg-gradient-to-br from-success-50 to-success-100' : 'bg-success-50',
    purple: gradient ? 'bg-gradient-to-br from-secondary-50 to-secondary-100' : 'bg-secondary-50',
    orange: gradient ? 'bg-gradient-to-br from-warning-50 to-warning-100' : 'bg-warning-50',
    red: gradient ? 'bg-gradient-to-br from-accent-50 to-accent-100' : 'bg-accent-50',
    indigo: gradient ? 'bg-gradient-to-br from-indigo-50 to-indigo-100' : 'bg-indigo-50',
  };

  const iconColorClasses = {
    blue: 'text-primary-600',
    green: 'text-success-600',
    purple: 'text-secondary-600',
    orange: 'text-warning-600',
    red: 'text-accent-600',
    indigo: 'text-indigo-600',
  };

  const borderColorClasses = {
    blue: 'border-primary-200',
    green: 'border-success-200',
    purple: 'border-secondary-200',
    orange: 'border-warning-200',
    red: 'border-accent-200',
    indigo: 'border-indigo-200',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl p-6 border shadow-card hover:shadow-elegant transition-all duration-300',
        colorClasses[color],
        borderColorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-600">{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
          {trend && trendValue && (
            <p
              className={clsx('text-sm mt-2 font-semibold', {
                'text-success-600': trend === 'up',
                'text-accent-600': trend === 'down',
                'text-neutral-600': trend === 'neutral',
              })}
            >
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={clsx('text-4xl p-3 rounded-xl bg-white/50', iconColorClasses[color])}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

interface AlertBoxProps {
  type: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const AlertBox: React.FC<AlertBoxProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  const typeClasses = {
    error: 'bg-gradient-to-r from-accent-50 to-accent-100 border-accent-300 text-accent-800',
    warning: 'bg-gradient-to-r from-warning-50 to-warning-100 border-warning-300 text-warning-800',
    success: 'bg-gradient-to-r from-success-50 to-success-100 border-success-300 text-success-800',
    info: 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-300 text-primary-800',
  };

  const iconClasses = {
    error: '❌',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️',
  };

  return (
    <div className={clsx('border rounded-xl p-4', typeClasses[type])}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl">{iconClasses[type]}</span>
          <div>
            {title && <p className="font-bold">{title}</p>}
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-lg font-semibold opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

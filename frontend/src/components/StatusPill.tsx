import React from 'react';

interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-400 text-white';

  if (normalized.includes('approved') || normalized.includes('pass') || normalized.includes('deployed')) {
    colorClasses = 'bg-[#10b981] text-white';
  } else if (normalized.includes('submit') || normalized.includes('active') || normalized.includes('developer')) {
    colorClasses = 'bg-[#3b82f6] text-white';
  } else if (normalized.includes('fail') || normalized.includes('block') || normalized.includes('admin') || normalized.includes('duplicate')) {
    colorClasses = 'bg-[#ef4444] text-white';
  } else if (normalized.includes('related') || normalized.includes('staging')) {
    colorClasses = 'bg-[#f97316] text-white';
  } else if (normalized.includes('versions') || normalized.includes('warning')) {
    colorClasses = 'bg-[#b45309] text-white';
  } else if (normalized.includes('rolled') || normalized.includes('viewer') || normalized.includes('unrelated') || normalized.includes('dev')) {
    colorClasses = 'bg-[#64748b] text-white';
  }

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-4 py-1 text-xs font-medium',
    lg: 'px-5 py-1.5 text-sm font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full shadow-sm transition-all text-center tracking-wide ${sizeClasses} ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
};

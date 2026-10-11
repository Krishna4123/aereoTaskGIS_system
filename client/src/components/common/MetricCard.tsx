import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  iconName: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'error' | 'warning';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  iconName,
  badge,
  badgeType = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/20 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">{iconName}</span>
        </div>
      </div>
      <div className="mt-space-md flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-data-tabular">
            {value}
            {unit && <span className="font-body-sm text-body-sm text-secondary ml-1">{unit}</span>}
          </span>
          {badge && (
            <span
              className={`font-label-sm text-label-sm font-data-tabular ${
                badgeType === 'error'
                  ? 'text-error'
                  : badgeType === 'warning'
                  ? 'text-tertiary'
                  : 'text-primary'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtext && <span className="font-body-xs text-body-xs text-secondary mt-1">{subtext}</span>}
      </div>
    </div>
  );
};

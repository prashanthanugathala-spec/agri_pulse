import React from 'react';
import StatusBadge from './StatusBadge';

export const MetricCard = ({
  title,
  value,
  unit,
  icon,
  badgeText,
  badgeVariant = 'neutral',
  badgeIcon,
  subtext,
  className = '',
}) => {
  return (
    <div
      className={`animate-card bg-white rounded-[24px] p-5 lg:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-label-caps text-[11px] text-[#6E6E73] tracking-wider uppercase font-semibold">
          {title}
        </span>
        {icon && (
          <span className="material-symbols-outlined text-[#707972] text-[20px]">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1.5">
        <span className="font-metric-num text-[32px] text-[#1D1D1F] tracking-tight font-normal">
          {value}
        </span>
        {unit && (
          <span className="font-body-sm text-[13px] text-[#6E6E73] font-normal">
            {unit}
          </span>
        )}
      </div>

      <div className="pt-2">
        {badgeText ? (
          <StatusBadge variant={badgeVariant} icon={badgeIcon}>
            {badgeText}
          </StatusBadge>
        ) : subtext ? (
          <span className="text-[12px] text-[#6E6E73] truncate block">
            {subtext}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default MetricCard;

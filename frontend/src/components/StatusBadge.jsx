import React from 'react';

export const StatusBadge = ({ variant = 'neutral', icon, children, className = '' }) => {
  const variantStyles = {
    optimal: 'bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/20',
    warning: 'bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/20',
    critical: 'bg-[#FF453A]/10 text-[#FF453A] border border-[#FF453A]/20',
    eco: 'bg-[#E8F3EC] text-[#2F6B4F] border border-[#2F6B4F]/15 font-medium',
    neutral: 'bg-black/5 text-[#6E6E73] border border-black/5',
    primary: 'bg-[#2F6B4F] text-white',
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-tight whitespace-nowrap transition-colors ${style} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[13px]">{icon}</span>}
      {children}
    </span>
  );
};

export default StatusBadge;

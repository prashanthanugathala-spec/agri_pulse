import React from 'react';

export const LoadingState = ({ message = 'Synchronizing telemetry data...' }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 animate-pulse">
    <div className="w-12 h-12 rounded-full border-3 border-[#E8F3EC] border-t-[#2F6B4F] animate-spin mb-4" />
    <span className="text-sm font-medium text-[#6E6E73]">{message}</span>
  </div>
);

export const ErrorState = ({ message = 'Failed to load telemetry data.', onRetry }) => (
  <div className="bg-[#FFDAD6]/30 border border-[#BA1A1A]/20 rounded-[20px] p-6 text-center my-6 max-w-xl mx-auto">
    <span className="material-symbols-outlined text-[#BA1A1A] text-[36px] mb-2 inline-block">
      error
    </span>
    <h3 className="text-base font-medium text-[#1B1B1D] mb-1">Telemetry Interrupted</h3>
    <p className="text-xs text-[#6E6E73] mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-1.5 rounded-full bg-[#2F6B4F] text-white text-xs font-medium hover:bg-[#1F4D38] transition-colors cursor-pointer"
      >
        Retry Connection
      </button>
    )}
  </div>
);

export const EmptyState = ({
  icon = 'inbox',
  title = 'No records found',
  description = 'There is currently no telemetry or data available for this section.',
  actionText,
  onAction,
}) => (
  <div className="bg-white rounded-[24px] border border-black/[0.04] p-12 text-center my-6 flex flex-col items-center justify-center">
    <div className="w-14 h-14 rounded-full bg-[#F0EDEF] flex items-center justify-center text-[#707972] mb-3">
      <span className="material-symbols-outlined text-[28px]">{icon}</span>
    </div>
    <h3 className="text-base font-medium text-[#1D1D1F] mb-1">{title}</h3>
    <p className="text-xs text-[#6E6E73] max-w-md mb-4">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-5 py-2 rounded-full bg-[#E8F3EC] text-[#2F6B4F] text-xs font-medium hover:bg-[#d9ece0] transition-colors cursor-pointer"
      >
        {actionText}
      </button>
    )}
  </div>
);

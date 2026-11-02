import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-black/[0.04] ${
        hoverEffect ? 'transition-all duration-300 hover:shadow-[0_4px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

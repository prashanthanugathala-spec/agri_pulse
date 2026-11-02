import React from 'react';
import { buttonPressAnimation } from '../animations/gsapHelpers';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  isLoading = false,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all select-none focus:outline-none focus:ring-2 focus:ring-[#2F6B4F]/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'h-8 px-3.5 text-xs rounded-full gap-1.5',
    md: 'h-10 px-5 text-sm rounded-full gap-2',
    lg: 'h-12 px-6 text-base rounded-full gap-2.5',
    icon: 'w-9 h-9 p-0 rounded-full justify-center',
  };

  const variantStyles = {
    primary: 'bg-[#2F6B4F] text-white hover:bg-[#1F4D38] shadow-[0_1px_3px_rgba(47,107,79,0.15)]',
    secondary: 'bg-[#E8F3EC] text-[#2F6B4F] hover:bg-[#d9ece0] shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    ghost: 'bg-black/5 text-[#1D1D1F] hover:bg-black/10',
    outline: 'border border-black/10 text-[#1D1D1F] hover:bg-black/5',
    danger: 'bg-[#FF453A]/10 text-[#FF453A] hover:bg-[#FF453A]/20 border border-[#FF453A]/20',
    tertiary: 'bg-transparent text-[#2F6B4F] hover:underline p-0 h-auto',
  };

  const handleClick = (e) => {
    buttonPressAnimation(e);
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
      {!isLoading && iconRight && (
        <span className="material-symbols-outlined text-[18px]">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;

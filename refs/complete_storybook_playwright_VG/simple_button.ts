import React from 'react';
import { Zap } from 'lucide-react';

export interface SimpleButtonProps {
  /** Button text content */
  label: string;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Show icon */
  showIcon?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom CSS class */
  className?: string;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  showIcon = false,
  onClick,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white shadow-lg shadow-indigo-900/30',
    secondary: 'bg-slate-800/60 border border-slate-700/40 hover:bg-slate-700/60 hover:border-indigo-500/30 text-slate-300',
    danger: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-lg shadow-rose-900/30',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-xl
        font-medium
        transition-all
        duration-300
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        flex
        items-center
        gap-2
        justify-center
        ${className}
      `}
    >
      {loading && (
        <div className={`${iconSizes[size]} animate-spin rounded-full border-2 border-white border-t-transparent`} />
      )}
      {showIcon && !loading && (
        <Zap className={iconSizes[size]} />
      )}
      <span>{label}</span>
    </button>
  );
};

export default SimpleButton;
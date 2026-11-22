import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'sage' | 'amber' | 'outline' | 'ghost' | 'destructive' | 'tint'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-4.5 py-2.5 rounded-2xl gap-2',
    lg: 'text-base px-6 h-12 rounded-2xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#E06D53] hover:bg-[#C85A40] text-white shadow-md shadow-[#E06D53]/25 ring-1 ring-white/20 relative overflow-hidden',
    sage:
      'bg-[#5B8A72] hover:bg-[#4D7761] text-white shadow-md shadow-[#5B8A72]/25 ring-1 ring-white/20',
    amber:
      'bg-[#D98A3C] hover:bg-[#C0772E] text-white shadow-md shadow-[#D98A3C]/25 ring-1 ring-white/20',
    secondary:
      'bg-[#F5F0E6] hover:bg-[#EFEAE1] text-[#231F20] border border-[#E8E0D5] shadow-xs',
    tint:
      'bg-[#FDF2F0] text-[#E06D53] hover:bg-[#FAD8D2]/60 border border-[#FAD8D2]',
    outline:
      'border border-[#E8E0D5] bg-white/90 hover:bg-white text-[#231F20] shadow-xs',
    ghost:
      'text-[#E06D53] hover:bg-[#FDF2F0] bg-transparent',
    destructive:
      'bg-[#D34538] hover:bg-[#B9382C] text-white shadow-md shadow-[#D34538]/25 ring-1 ring-white/20',
    destructiveTint:
      'bg-[#FDF2F0] text-[#D34538] hover:bg-[#FAD8D2] border border-[#FAD8D2]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
    </button>
  );
};

export default Button;

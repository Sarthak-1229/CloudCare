import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'copper' | 'outline' | 'ghost' | 'destructive' | 'tint'
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
    'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] tracking-[-0.01em]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-5 h-11 sm:h-12 rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#1C1917] hover:bg-[#292524] text-white shadow-sm ring-1 ring-white/10 active:bg-black',
    copper:
      'bg-[#C85A32] hover:bg-[#B34E2A] text-white shadow-sm shadow-[#C85A32]/20',
    secondary:
      'bg-white hover:bg-[#F3F1ED] text-[#18181B] border border-[#ECE9E2] shadow-2xs',
    tint:
      'bg-[#FBF4EE] text-[#C85A32] hover:bg-[#F3DEC7]/60 border border-[#F3DEC7]',
    outline:
      'border border-[#ECE9E2] bg-transparent hover:bg-white text-[#18181B]',
    ghost:
      'text-[#18181B] hover:bg-[#F3F1ED] bg-transparent',
    destructive:
      'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-sm',
    destructiveTint:
      'bg-red-50 text-red-700 hover:bg-red-100/80 border border-red-200/60',
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

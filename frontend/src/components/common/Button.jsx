import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'tint'
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
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 ios-press-action select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-full gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-full gap-2 font-semibold',
    lg: 'text-base px-6 py-3 rounded-full gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-ios-blue text-white shadow-sm hover:bg-ios-blue-hover active:bg-ios-blue-hover',
    secondary: 'bg-ios-gray-200/80 text-ios-gray-900 hover:bg-ios-gray-300 active:bg-ios-gray-400',
    tint: 'bg-ios-blue-tint text-ios-blue hover:bg-blue-100/70',
    outline: 'border border-ios-gray-300 bg-white text-ios-gray-800 hover:bg-ios-gray-100',
    ghost: 'text-ios-blue hover:bg-ios-blue-tint bg-transparent',
    destructive: 'bg-ios-red text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
    destructiveTint: 'bg-ios-red-tint text-ios-red hover:bg-red-100/80',
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
      {loading ? (
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
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default Button;

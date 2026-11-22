import React from 'react';

const Card = ({
  children,
  className = '',
  glass = false,
  hoverable = false,
  padding = 'p-5 md:p-6',
  ...props
}) => {
  return (
    <div
      className={`
        rounded-[24px] transition-all duration-200
        ${
          glass
            ? 'warm-glass-card'
            : 'bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(60,45,30,0.05)] border border-[#E8E0D5]/80'
        }
        ${hoverable ? 'hover:shadow-[0_12px_28px_-6px_rgba(60,45,30,0.10)] hover:-translate-y-0.5 cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

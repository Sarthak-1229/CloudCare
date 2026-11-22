import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'p-6 sm:p-7',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-[20px] sm:rounded-[24px] border border-[rgba(28,25,23,0.08)] transition-all duration-200
        shadow-[0_1px_2px_rgba(0,0,0,0.03),0_24px_48px_-12px_rgba(28,25,23,0.06)]
        ${hoverable ? 'hover:border-[rgba(28,25,23,0.18)] hover:-translate-y-0.5 cursor-pointer' : ''}
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

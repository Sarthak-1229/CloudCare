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
        rounded-[20px] transition-all duration-200
        ${glass ? 'ios-glass-card shadow-ios' : 'bg-white shadow-ios border border-gray-100/80'}
        ${hoverable ? 'hover:shadow-ios-md hover:-translate-y-0.5 cursor-pointer' : ''}
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

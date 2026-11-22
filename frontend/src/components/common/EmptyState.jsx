import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-[24px] bg-[#F5F0E6]/50 border border-dashed border-[#E8E0D5] ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#7A7267] mb-3 border border-[#E8E0D5]">
          <Icon className="w-6 h-6 text-[#E06D53]" />
        </div>
      )}
      <h4 className="text-base font-bold text-[#231F20]">{title}</h4>
      {description && (
        <p className="text-xs text-[#7A7267] max-w-sm mt-1 mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="tint" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

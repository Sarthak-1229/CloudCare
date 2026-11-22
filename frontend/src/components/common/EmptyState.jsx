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
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#F3F1ED]/50 border border-dashed border-[#ECE9E2] ${className}`}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#18181B] mb-3 border border-[#ECE9E2]">
          <Icon className="w-5 h-5 text-[#C85A32]" />
        </div>
      )}
      <h4 className="text-sm font-bold text-[#18181B]">{title}</h4>
      {description && (
        <p className="text-xs text-[#6E6A63] max-w-sm mt-1 mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

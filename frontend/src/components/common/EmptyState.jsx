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
      className={`flex flex-col items-center justify-center p-8 text-center rounded-[20px] bg-ios-gray-50/60 border border-dashed border-ios-gray-300 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-ios-gray-400 mb-3 border border-gray-100">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="text-base font-bold text-ios-gray-900">{title}</h4>
      {description && (
        <p className="text-xs text-ios-gray-500 max-w-sm mt-1 mb-4">{description}</p>
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

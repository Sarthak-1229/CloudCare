import React from 'react';
import Card from './Card';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tint = 'blue', // 'blue' | 'green' | 'orange' | 'purple' | 'indigo' | 'red'
  badgeText,
  onClick,
}) => {
  const tintClasses = {
    blue: {
      bg: 'bg-ios-blue-tint',
      text: 'text-ios-blue',
    },
    green: {
      bg: 'bg-ios-green-tint',
      text: 'text-ios-green',
    },
    orange: {
      bg: 'bg-ios-orange-tint',
      text: 'text-ios-orange',
    },
    purple: {
      bg: 'bg-ios-purple-tint',
      text: 'text-ios-purple',
    },
    indigo: {
      bg: 'bg-ios-indigo-tint',
      text: 'text-ios-indigo',
    },
    red: {
      bg: 'bg-ios-red-tint',
      text: 'text-ios-red',
    },
  };

  const currentTint = tintClasses[tint] || tintClasses.blue;

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between"
      padding="p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ios-gray-500">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${currentTint.bg} ${currentTint.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-ios-gray-900">
            {value}
          </span>
          {badgeText && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${currentTint.bg} ${currentTint.text}`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-ios-gray-500 mt-1 line-clamp-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;

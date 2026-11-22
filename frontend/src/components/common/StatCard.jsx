import React from 'react';
import Card from './Card';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tint = 'blue', // 'blue' | 'green' | 'orange' | 'purple' | 'indigo' | 'rose'
  badgeText,
  onClick,
}) => {
  const tintClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200/60',
      glow: 'shadow-blue-500/20',
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      glow: 'shadow-emerald-500/20',
    },
    orange: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
      glow: 'shadow-amber-500/20',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-violet-600',
      badge: 'bg-purple-50 text-purple-700 border-purple-200/60',
      glow: 'shadow-purple-500/20',
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      glow: 'shadow-indigo-500/20',
    },
    rose: {
      bg: 'bg-gradient-to-br from-rose-500 to-pink-600',
      badge: 'bg-rose-50 text-rose-700 border-rose-200/60',
      glow: 'shadow-rose-500/20',
    },
  };

  const currentTint = tintClasses[tint] || tintClasses.blue;

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between relative overflow-hidden group border border-slate-200/70 bg-white/85 backdrop-blur-xl"
      padding="p-5 md:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${currentTint.bg} ${currentTint.glow} ring-1 ring-white/30 transition-transform duration-200 group-hover:scale-105`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </span>
          {badgeText && (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${currentTint.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;

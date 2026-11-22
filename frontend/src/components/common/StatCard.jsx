import React from 'react';
import Card from './Card';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  onClick,
}) => {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between relative overflow-hidden group bg-white border border-[rgba(28,25,23,0.08)]"
      padding="p-5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9C968E]">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#F3F1ED] text-[#1C1917] flex items-center justify-center border border-[#ECE9E2] transition-colors duration-200 group-hover:bg-[#1C1917] group-hover:text-white">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-[-0.03em] tabular-nums">
          {value}
        </div>
        {badgeText && (
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-[#6E6A63] font-normal leading-relaxed">
          {subtitle}
        </div>
      )}
    </Card>
  );
};

export default StatCard;

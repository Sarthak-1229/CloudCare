import React from 'react';
import Card from './Card';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tint = 'terracotta', // 'terracotta' | 'sage' | 'amber' | 'espresso' | 'linen'
  badgeText,
  onClick,
}) => {
  const tintClasses = {
    terracotta: {
      bg: 'bg-gradient-to-br from-[#F28B66] to-[#D95D43]',
      badge: 'bg-[#FDF2F0] text-[#E06D53] border-[#FAD8D2]',
      glow: 'shadow-[#E06D53]/20',
    },
    sage: {
      bg: 'bg-gradient-to-br from-[#72A68C] to-[#5B8A72]',
      badge: 'bg-[#EDF4F0] text-[#5B8A72] border-[#C4DDD0]',
      glow: 'shadow-[#5B8A72]/20',
    },
    amber: {
      bg: 'bg-gradient-to-br from-[#EDB36F] to-[#D98A3C]',
      badge: 'bg-[#FDF6ED] text-[#D98A3C] border-[#F5DDC0]',
      glow: 'shadow-[#D98A3C]/20',
    },
    espresso: {
      bg: 'bg-gradient-to-br from-[#524B43] to-[#231F20]',
      badge: 'bg-[#F5F0E6] text-[#231F20] border-[#E8E0D5]',
      glow: 'shadow-[#231F20]/15',
    },
    blue: {
      bg: 'bg-gradient-to-br from-[#F28B66] to-[#D95D43]', // Mapped to warm terracotta
      badge: 'bg-[#FDF2F0] text-[#E06D53] border-[#FAD8D2]',
      glow: 'shadow-[#E06D53]/20',
    },
    green: {
      bg: 'bg-gradient-to-br from-[#72A68C] to-[#5B8A72]',
      badge: 'bg-[#EDF4F0] text-[#5B8A72] border-[#C4DDD0]',
      glow: 'shadow-[#5B8A72]/20',
    },
    orange: {
      bg: 'bg-gradient-to-br from-[#EDB36F] to-[#D98A3C]',
      badge: 'bg-[#FDF6ED] text-[#D98A3C] border-[#F5DDC0]',
      glow: 'shadow-[#D98A3C]/20',
    },
    purple: {
      bg: 'bg-gradient-to-br from-[#A68095] to-[#8C657A]',
      badge: 'bg-[#F9F3F6] text-[#8C657A] border-[#EADBE3]',
      glow: 'shadow-[#8C657A]/20',
    },
    indigo: {
      bg: 'bg-gradient-to-br from-[#F28B66] to-[#D95D43]',
      badge: 'bg-[#FDF2F0] text-[#E06D53] border-[#FAD8D2]',
      glow: 'shadow-[#E06D53]/20',
    },
    rose: {
      bg: 'bg-gradient-to-br from-[#E06D53] to-[#C85A40]',
      badge: 'bg-[#FDF2F0] text-[#E06D53] border-[#FAD8D2]',
      glow: 'shadow-[#E06D53]/20',
    },
  };

  const currentTint = tintClasses[tint] || tintClasses.terracotta;

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between relative overflow-hidden group border border-[#E8E0D5]/80 bg-white/85 backdrop-blur-xl"
      padding="p-5 md:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7A7267]">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-[14px] ${currentTint.bg} flex items-center justify-center text-white shadow-md ${currentTint.glow} ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="w-5 h-5 drop-shadow-xs" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-black text-[#231F20] tracking-tight tabular-nums">
          {value}
        </div>
        {badgeText && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${currentTint.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-[#7A7267] font-medium leading-relaxed">
          {subtitle}
        </div>
      )}
    </Card>
  );
};

export default StatCard;

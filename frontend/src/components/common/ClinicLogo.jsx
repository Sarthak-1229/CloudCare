import React from 'react';

export const ClinicLogo = ({ size = 'md', className = '', showText = false }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 18, radius: 'rounded-[10px]' },
    md: { box: 'w-10 h-10', icon: 22, radius: 'rounded-[13px]' },
    lg: { box: 'w-14 h-14', icon: 30, radius: 'rounded-[18px]' },
    xl: { box: 'w-16 h-16', icon: 36, radius: 'rounded-[22px]' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* iOS 16 App Icon Squircle with Medical Pulse & Cross */}
      <div
        className={`relative ${current.box} ${current.radius} bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-white/30 overflow-hidden flex-shrink-0 group`}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />

        {/* Ambient radial glow */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-300/40 rounded-full blur-sm pointer-events-none" />

        {/* Custom Clinical Cross + Pulse Vector */}
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          {/* Medical Cross Stem */}
          <rect x="9.5" y="3" width="5" height="18" rx="2.5" fill="currentColor" opacity="0.35" />
          <rect x="3" y="9.5" width="18" height="5" rx="2.5" fill="currentColor" opacity="0.35" />

          {/* Dynamic Vital Pulse Line */}
          <path
            d="M3 12.5H7.5L9.5 8L13 16.5L15 11.5L16.5 12.5H21"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Leaf / Health Spark Accent */}
          <circle cx="17.5" cy="6.5" r="2" fill="#34D399" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
              CloudCare
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/80">
              v3.0
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium tracking-tight">
            Hospital Management System
          </span>
        </div>
      )}
    </div>
  );
};

export default ClinicLogo;

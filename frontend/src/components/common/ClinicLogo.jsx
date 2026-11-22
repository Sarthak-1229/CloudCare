import React from 'react';

export const ClinicLogo = ({ size = 'md', className = '', showText = false }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 18, radius: 'rounded-[22%]' },
    md: { box: 'w-10 h-10', icon: 22, radius: 'rounded-[22%]' },
    lg: { box: 'w-14 h-14', icon: 30, radius: 'rounded-[22%]' },
    xl: { box: 'w-16 h-16', icon: 36, radius: 'rounded-[22%]' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* iOS 16 Squircle App Icon (22% radius) with warm Coral-to-Amber gradient */}
      <div
        className={`relative ${current.box} ${current.radius} flex items-center justify-center overflow-hidden flex-shrink-0 group`}
        style={{
          background: 'linear-gradient(135deg, #F28B66 0%, #D95D43 100%)',
          boxShadow: '0 8px 20px -4px rgba(224, 109, 83, 0.35)',
        }}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

        {/* Ambient radial glow in warm peach */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FDE8D7]/40 rounded-full blur-sm pointer-events-none" />

        {/* Custom Clinical Cross + Vital Pulse Vector */}
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative text-white drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
        >
          {/* Medical Cross Stem with subtle translucency */}
          <rect x="9.5" y="3" width="5" height="18" rx="2.5" fill="currentColor" opacity="0.32" />
          <rect x="3" y="9.5" width="18" height="5" rx="2.5" fill="currentColor" opacity="0.32" />

          {/* Dynamic Vital Pulse Line in crisp white */}
          <path
            d="M3 12.5H7.5L9.5 8L13 16.5L15 11.5L16.5 12.5H21"
            stroke="white"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Health Spark / Leaf Accent in Warm Sage Green */}
          <circle cx="17.5" cy="6.5" r="2" fill="#5B8A72" stroke="white" strokeWidth="0.8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#231F20]">
              CloudCare
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EDF4F0] text-[#5B8A72] border border-[#C4DDD0]">
              v3.0
            </span>
          </div>
          <span className="text-[10px] text-[#7A7267] font-medium tracking-normal -mt-0.5">
            Hospital Management
          </span>
        </div>
      )}
    </div>
  );
};

export default ClinicLogo;

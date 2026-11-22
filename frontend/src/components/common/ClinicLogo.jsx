import React from 'react';

export const ClinicLogo = ({ size = 'md', className = '', showText = false }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 16, radius: 'rounded-[10px]' },
    md: { box: 'w-10 h-10', icon: 20, radius: 'rounded-xl' },
    lg: { box: 'w-11 h-11', icon: 22, radius: 'rounded-xl' },
    xl: { box: 'w-11 h-11 sm:w-12 sm:h-12', icon: 24, radius: 'rounded-xl' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Sleek Minimal Squircle (44px x 44px) in Warm Obsidian (#1C1917) with thin metallic/copper inner border */}
      <div
        className={`relative ${current.box} ${current.radius} bg-[#1C1917] flex items-center justify-center overflow-hidden flex-shrink-0 group shadow-sm`}
        style={{
          boxShadow: '0 4px 12px -2px rgba(28, 25, 23, 0.25)',
        }}
      >
        {/* Thin metallic copper inner ring */}
        <div className="absolute inset-0 rounded-[inherit] border border-[#C85A32]/35 pointer-events-none" />

        {/* Crisp White ECG Pulse Line with Copper Spark Accent */}
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative text-white transition-transform duration-200 group-hover:scale-105"
        >
          {/* Subtle clinical cross backdrop */}
          <rect x="10.5" y="4" width="3" height="16" rx="1.5" fill="white" fillOpacity="0.18" />
          <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="white" fillOpacity="0.18" />

          {/* Crisp ECG Pulse Vector */}
          <path
            d="M3 12H7L9 7.5L13 16.5L15 11L16.5 12H21"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision Signature Copper Spark */}
          <circle cx="17" cy="7" r="1.6" fill="#C85A32" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg sm:text-xl tracking-[-0.03em] text-[#18181B]">
              CloudCare
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
              PRO
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C968E] -mt-0.5">
            CLINICAL SUITE
          </span>
        </div>
      )}
    </div>
  );
};

export default ClinicLogo;

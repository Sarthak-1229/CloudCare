import React from 'react';
import logoImg from '../../assets/logo.png';

export const ClinicLogo = ({ size = 'md', className = '', showText = false }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', radius: 'rounded-[10px]' },
    md: { box: 'w-10 h-10', radius: 'rounded-xl' },
    lg: { box: 'w-12 h-12', radius: 'rounded-xl' },
    xl: { box: 'w-16 h-16 sm:w-20 sm:h-20', radius: 'rounded-2xl' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic Clinic Logo Container — matched to dark charcoal background */}
      <div
        className={`relative ${current.box} ${current.radius} bg-[#1A1A18] flex items-center justify-center overflow-hidden flex-shrink-0 group border border-[#C85A32]/25 p-1`}
        style={{
          boxShadow: '0 6px 16px -4px rgba(28, 25, 23, 0.28)',
        }}
      >
        <img
          src={logoImg}
          alt="CloudCare Clinic Logo"
          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
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

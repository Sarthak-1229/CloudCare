import React from 'react';
import ClinicLogo from '../components/common/ClinicLogo';
import { ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col justify-center items-center p-4 sm:p-6 relative font-sans selection:bg-[#1C1917] selection:text-white">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center text-center z-10">
        <ClinicLogo size="xl" showText={false} className="mb-4" />
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#18181B]">
          CloudCare
        </h1>
        <p className="text-xs font-normal text-[#6E6A63] tracking-normal mt-1">
          Hospital Information & Clinical Management Suite
        </p>
      </div>

      {/* Main Architectural Card: Crisp Ivory White with hair-thin border and multi-layer ambient shadow */}
      <div
        className="w-full max-w-[440px] bg-white rounded-[24px] border border-[rgba(28,25,23,0.08)] p-7 sm:p-9 z-10 relative"
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 24px 48px -12px rgba(28, 25, 23, 0.06)',
        }}
      >
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-[#18181B] tracking-[-0.02em]">{title}</h2>
          {subtitle && <p className="text-xs text-[#6E6A63] mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>

      {/* Clean Secure Footer */}
      <div className="mt-8 flex items-center justify-center gap-2 font-mono text-[11px] text-[#9C968E] z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-[#5B8A72]" />
        <span>CloudCare Clinical Management Suite • Secure Authentication</span>
      </div>
    </div>
  );
};

export default AuthLayout;

import React from 'react';
import ClinicLogo from '../components/common/ClinicLogo';
import { ShieldCheck, Cloud, Server } from 'lucide-react';

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

        {/* Minimalist Monochrome AWS Region Status Pill */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[rgba(28,25,23,0.08)] shadow-2xs text-[11px] font-mono text-[#18181B]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="text-[#6E6A63]">REGION:</span>
          <span className="font-semibold">ap-south-1</span>
        </div>
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

      {/* Minimal Architectural Footnote */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-3 font-mono text-[11px] text-[#9C968E] z-10">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-[#18181B]" />
          <span>EC2 HOST :3000</span>
        </div>
        <span>/</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>RDS MYSQL :3306</span>
        </div>
        <span>/</span>
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>S3 PRIVATE</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import React from 'react';
import ClinicLogo from '../components/common/ClinicLogo';
import { ShieldCheck, Cloud, Server } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#E06D53] selection:text-white">
      {/* Ambient Apple Health-style warm radial blooms in warm peach and soft sand */}
      <div className="absolute -top-36 -left-36 w-[520px] h-[520px] rounded-full bg-[#FDE8D7]/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -right-36 w-[520px] h-[520px] rounded-full bg-[#F3ECE1]/70 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#FDE8D7]/30 blur-3xl pointer-events-none" />

      {/* CloudCare Header Branding */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <ClinicLogo size="xl" showText={false} className="mb-3.5" />
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#231F20]">
          CloudCare
        </h1>
        <p className="text-xs text-[#7A7267] font-medium tracking-wide mt-1">
          Cloud-Native Hospital Management System
        </p>

        {/* Live Cloud Badge in Warm Sage Green */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4F0] border border-[#C4DDD0] text-[11px] font-semibold text-[#5B8A72] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#5B8A72] animate-pulse" />
          <span>AWS Region: <code>ap-south-1</code> (Mumbai)</span>
        </div>
      </div>

      {/* Main iOS 16 Warm Glass Card with rounded-[28px], delicate sand border, and diffused warm shadow */}
      <div
        className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-[28px] border border-[#E8E0D5]/80 p-6 sm:p-8 z-10 relative"
        style={{
          boxShadow: '0 20px 40px -15px rgba(60, 45, 30, 0.08)',
        }}
      >
        <div className="mb-5 text-center">
          <h2 className="text-xl font-bold text-[#231F20] tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-[#7A7267] mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>

      {/* Architecture Footnote in Warm Taupe */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-[11px] text-[#7A7267] font-medium z-10">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-[#E06D53]" />
          <span>Public EC2 App</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5B8A72]" />
          <span>Private RDS MySQL</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-[#D98A3C]" />
          <span>Private S3 Bucket</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

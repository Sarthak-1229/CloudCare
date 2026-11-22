import React from 'react';
import ClinicLogo from '../components/common/ClinicLogo';
import { ShieldCheck, Cloud, Server } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Ambient Apple-style multi-color gradient blooms */}
      <div className="absolute -top-36 -left-36 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300/30 via-blue-200/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -right-36 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-200/30 via-cyan-200/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-200/20 blur-3xl pointer-events-none" />

      {/* CloudCare Header Branding */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <ClinicLogo size="xl" showText={false} className="mb-3" />
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
          CloudCare
        </h1>
        <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">
          Cloud-Native Hospital Management System
        </p>

        {/* Live Cloud Badge */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-[11px] font-semibold text-slate-600 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AWS Region: <code>ap-south-1</code> (Mumbai)</span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.08)] border border-white/90 p-6 sm:p-8 z-10 relative">
        <div className="mb-5 text-center">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>

      {/* Architecture Footnote */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-[11px] text-slate-500 font-medium z-10">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-blue-600" />
          <span>Public EC2 App</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Private RDS MySQL</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-teal-600" />
          <span>Private S3 Bucket</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

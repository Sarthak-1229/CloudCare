import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-ios-bg flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Apple-style glowing gradient backdrops */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      {/* CloudCare Header branding */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <div className="w-14 h-14 rounded-[18px] bg-gradient-to-tr from-ios-blue to-blue-400 flex items-center justify-center text-white shadow-ios-md mb-3">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ios-gray-900">
          CloudCare
        </h1>
        <p className="text-xs text-ios-gray-500 font-medium tracking-wide mt-0.5">
          TY Cloud Computing Fundamentals Mini-Project
        </p>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[28px] shadow-ios-lg border border-white/80 p-6 sm:p-8 z-10">
        <div className="mb-5 text-center">
          <h2 className="text-xl font-bold text-ios-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-ios-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>

      {/* Architecture footnote */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-ios-gray-500 font-medium z-10">
        <ShieldCheck className="w-4 h-4 text-ios-green" />
        <span>AWS Public EC2 • Private RDS MySQL • Private S3</span>
      </div>
    </div>
  );
};

export default AuthLayout;

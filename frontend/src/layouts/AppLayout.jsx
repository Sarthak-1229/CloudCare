import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import ClinicLogo from '../components/common/ClinicLogo';
import {
  Activity,
  Calendar,
  FileText,
  Users,
  LogOut,
  Server,
  User,
  Shield,
  Stethoscope,
  Database,
  Cloud,
  CheckCircle2,
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user, logout, isMockMode, apiHealth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation based on role
  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'PATIENT') {
      return [
        { name: 'Dashboard', path: '/patient', icon: Activity },
        { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
        { name: 'Health Records', path: '/patient/records', icon: FileText },
      ];
    }
    if (user.role === 'DOCTOR') {
      return [
        { name: 'Patient Queue', path: '/doctor', icon: Activity },
        { name: 'Consultations', path: '/doctor/appointments', icon: Calendar },
        { name: 'Prescriptions & Reports', path: '/doctor/reports', icon: FileText },
      ];
    }
    if (user.role === 'ADMIN') {
      return [
        { name: 'Overview', path: '/admin', icon: Activity },
        { name: 'Doctors & Staff', path: '/admin/doctors', icon: Users },
        { name: 'Appointments Audit', path: '/admin/appointments', icon: Calendar },
        { name: 'Cloud Infrastructure', path: '/admin/infra', icon: Server },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'System Admin',
          icon: Shield,
          badge: 'bg-gradient-to-r from-purple-500/10 to-indigo-500/15 border-purple-200/70 text-purple-700',
          dot: 'bg-purple-500',
        };
      case 'DOCTOR':
        return {
          label: 'Doctor',
          icon: Stethoscope,
          badge: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/15 border-emerald-200/70 text-emerald-700',
          dot: 'bg-emerald-500',
        };
      case 'PATIENT':
      default:
        return {
          label: 'Patient',
          icon: User,
          badge: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/15 border-blue-200/70 text-blue-700',
          dot: 'bg-blue-500',
        };
    }
  };

  const roleMeta = getRoleBadge(user?.role);
  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient iOS 16 Color Atmosphere / Mesh Glows */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/20 via-blue-200/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-[450px] h-[450px] bg-gradient-to-br from-teal-200/20 via-emerald-200/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/15 via-rose-200/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Frosted Glass Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-2xl border-b border-slate-200/70 px-4 sm:px-6 py-2.5 transition-all duration-200 shadow-[0_1px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Clinic Brand & Live Service Telemetry */}
          <div className="flex items-center gap-4">
            <ClinicLogo size="md" showText={true} />

            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200/80">
              {/* Region Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 text-[11px] font-semibold text-slate-600 border border-slate-200/60 shadow-xs">
                <Cloud className="w-3.5 h-3.5 text-blue-600" />
                <span>ap-south-1 (Mumbai)</span>
              </div>

              {/* API Health Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>API & DB Live (200 OK)</span>
              </div>
            </div>
          </div>

          {/* User Profile, Role Badge & Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`flex items-center gap-2 py-1.5 px-3 rounded-full border shadow-xs ${roleMeta.badge}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <div className="text-left leading-tight">
                <span className="text-xs font-bold block">{user?.name || 'Authorized User'}</span>
                <span className="text-[10px] font-medium opacity-80 block">
                  {roleMeta.label} {user?.specialization ? `• ${user.specialization}` : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/70 hover:border-rose-200 transition-all duration-150 ios-press-action shadow-xs"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 flex flex-col md:flex-row gap-6 relative z-10">
        {/* Desktop Sidebar with Glass Aesthetic */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20 bg-white/80 backdrop-blur-2xl rounded-3xl p-3.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] border border-slate-200/80">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            <nav className="space-y-1.5 mt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ios-press-action
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20'
                          : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick System Architecture Info Pill */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 border border-indigo-100/60 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1.5">
                <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Server className="w-3 h-3" />
                </div>
                <span>AWS CloudCare Stack</span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 font-medium mt-2">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>VPC: <code>10.20.0.0/16</code></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Public EC2 App (Port 3000)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Private RDS MySQL (Port 3306)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>Private S3 Bucket (BPA ON)</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile iOS Floating Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-1.5 flex items-center justify-around shadow-lg shadow-slate-900/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-2 px-3 rounded-2xl text-[10px] font-bold transition-all duration-150 ios-press-action flex-1
                ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }
              `}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;

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
  Cloud,
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
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
        };
      case 'DOCTOR':
        return {
          label: 'Specialist Physician',
          icon: Stethoscope,
        };
      case 'PATIENT':
      default:
        return {
          label: 'Patient',
          icon: User,
        };
    }
  };

  const roleMeta = getRoleBadge(user?.role);
  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#18181B] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#1C1917] selection:text-white">
      {/* Top Precision Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[rgba(28,25,23,0.08)] px-4 sm:px-6 py-3 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Clinic Brand & Live Telemetry */}
          <div className="flex items-center gap-5">
            <ClinicLogo size="md" showText={true} />

            <div className="hidden lg:flex items-center gap-2 pl-5 border-l border-[#ECE9E2]">
              {user?.role === 'ADMIN' ? (
                <>
                  {/* Region Pill */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F1ED] border border-[#ECE9E2] text-[11px] font-mono text-[#18181B]">
                    <Cloud className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span className="text-[#6E6A63]">AWS:</span>
                    <span className="font-semibold">ap-south-1</span>
                  </div>

                  {/* API Health Pill with glowing Emerald dot */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#ECE9E2] text-[11px] font-mono text-[#18181B] shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                    </span>
                    <span className="font-semibold">200 OK</span>
                    <span className="text-[#9C968E]">|</span>
                    <span className="text-[#6E6A63]">RDS LIVE</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#ECE9E2] text-[11px] font-mono text-[#18181B] shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                  </span>
                  <span className="text-[#6E6A63]">SYSTEM STATUS:</span>
                  <span className="font-semibold text-[#065F46]">OPERATIONAL</span>
                </div>
              )}
            </div>
          </div>

          {/* User Profile, Role Badge & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 py-1 px-3 rounded-full bg-[#F3F1ED] border border-[#ECE9E2]">
              <RoleIcon className="w-3.5 h-3.5 text-[#18181B]" />
              <div className="text-left leading-tight">
                <span className="text-xs font-bold block text-[#18181B]">{user?.name || 'Authorized User'}</span>
                <span className="font-mono text-[10px] text-[#9C968E] block uppercase tracking-wider">
                  {roleMeta.label} {user?.specialization ? `• ${user.specialization}` : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-white hover:bg-[#F3F1ED] text-[#6E6A63] hover:text-[#18181B] border border-[#ECE9E2] transition-colors btn-press"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 flex flex-col md:flex-row gap-6 relative z-10">
        {/* Desktop Sidebar: Clean Luxury Minimalist */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl p-3.5 border border-[rgba(28,25,23,0.08)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#9C968E]">
              Navigation
            </div>
            <nav className="space-y-1 mt-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 btn-press
                      ${
                        isActive
                          ? 'bg-[#1C1917] text-white shadow-xs'
                          : 'text-[#6E6A63] hover:bg-[#F3F1ED] hover:text-[#18181B]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Context Widget: Architecture for Admin; Security & Confidentiality for Patients/Doctors */}
            {user?.role === 'ADMIN' ? (
              <div className="mt-6 p-4 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2]">
                <div className="flex items-center gap-2 text-[#18181B] font-bold text-xs mb-1.5">
                  <div className="w-4 h-4 rounded bg-[#1C1917] flex items-center justify-center text-white">
                    <Server className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider">AWS ARCHITECTURE</span>
                </div>
                <ul className="font-mono text-[10px] text-[#6E6A63] space-y-1.5 mt-2">
                  <li className="flex items-center justify-between">
                    <span>VPC</span>
                    <span className="font-semibold text-[#18181B]">10.20.0.0/16</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>PUBLIC EC2</span>
                    <span className="font-semibold text-[#18181B]">:3000</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>PRIVATE RDS</span>
                    <span className="font-semibold text-[#18181B]">:3306</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>STORAGE</span>
                    <span className="font-semibold text-[#10B981]">S3 PRIVATE</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2]">
                <div className="flex items-center gap-2 text-[#18181B] font-bold text-xs mb-1.5">
                  <div className="w-4 h-4 rounded bg-[#1C1917] flex items-center justify-center text-white">
                    <Shield className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider">SECURE DATA ENCLAVE</span>
                </div>
                <p className="font-mono text-[10px] text-[#6E6A63] leading-relaxed mt-2">
                  End-to-end encrypted clinical session and verified patient-doctor confidentiality.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-[rgba(28,25,23,0.08)] rounded-2xl p-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-2 px-3 rounded-xl text-[10px] font-bold transition-all duration-150 btn-press flex-1
                ${
                  isActive
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'text-[#6E6A63] hover:text-[#18181B]'
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

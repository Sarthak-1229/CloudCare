import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
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
        return { label: 'Admin', icon: Shield, bg: 'bg-ios-purple-tint text-ios-purple' };
      case 'DOCTOR':
        return { label: 'Doctor', icon: Stethoscope, bg: 'bg-ios-green-tint text-ios-green' };
      case 'PATIENT':
      default:
        return { label: 'Patient', icon: User, bg: 'bg-ios-blue-tint text-ios-blue' };
    }
  };

  const roleMeta = getRoleBadge(user?.role);
  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-ios-bg text-ios-gray-900 flex flex-col font-sans">
      {/* Top Glass Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-ios-gray-200/80 px-4 sm:px-6 py-3 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-ios-blue to-blue-400 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-ios-gray-900">
                  CloudCare
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  v3.0 CCF
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-ios-gray-500">
                <span
                  className={`w-2 h-2 rounded-full ${
                    apiHealth.healthy ? 'bg-ios-green animate-pulse' : 'bg-ios-orange'
                  }`}
                />
                <span>
                  {apiHealth.healthy
                    ? 'Live API (/api/health 200)'
                    : isMockMode
                    ? 'Synthetic Dev Mode'
                    : 'Backend Standby'}
                </span>
              </div>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-ios-gray-100/90 py-1.5 px-3 rounded-full border border-gray-200/60">
              <span className={`p-1 rounded-full ${roleMeta.bg}`}>
                <RoleIcon className="w-3.5 h-3.5" />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold leading-none text-ios-gray-900">{user?.name}</p>
                <p className="text-[10px] font-semibold text-ios-gray-500 leading-none mt-0.5">
                  {user?.role} {user?.specialization ? `• ${user.specialization}` : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2.5 rounded-full bg-ios-gray-100 hover:bg-ios-red-tint text-ios-gray-600 hover:text-ios-red transition-all duration-150 ios-press-action"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8 flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20 bg-white/70 backdrop-blur-md rounded-[24px] p-3 shadow-ios border border-gray-100/80">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-ios-gray-400">
              Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] text-sm font-semibold transition-all duration-150 ios-press-action
                      ${
                        isActive
                          ? 'bg-ios-blue text-white shadow-sm'
                          : 'text-ios-gray-700 hover:bg-ios-gray-100 hover:text-ios-gray-900'
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
            <div className="mt-6 p-3.5 rounded-[18px] bg-ios-gray-50 border border-gray-100 text-xs">
              <div className="flex items-center gap-1.5 text-ios-gray-900 font-bold mb-1">
                <Server className="w-3.5 h-3.5 text-ios-blue" />
                <span>AWS Topology</span>
              </div>
              <p className="text-[11px] text-ios-gray-500 leading-relaxed">
                VPC CIDR 10.20.0.0/16<br />
                Public EC2 (Port 3000)<br />
                Private RDS & Private S3
              </p>
            </div>
          </div>
        </aside>

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Mobile iOS Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-ios-gray-200/80 px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors duration-150
                ${isActive ? 'text-ios-blue font-bold' : 'text-ios-gray-500 hover:text-ios-gray-900'}
              `}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;

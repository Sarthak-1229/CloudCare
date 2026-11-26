import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import { Mail, Lock, UserCheck, AlertCircle, Shield, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Switch between portal roles
  const handleRoleTabChange = (newRole) => {
    setRoleTab(newRole);
    setError('');
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Sanitize input: strip leading/trailing and rogue whitespace from copy-paste
    const cleanEmail = (email || '').trim().replace(/\s+/g, '').toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both email address and password.');
      return;
    }

    try {
      const result = await login(cleanEmail, cleanPassword);
      if (result.success) {
        const userRole = result.user.role;
        if (userRole === 'PATIENT') navigate('/patient');
        else if (userRole === 'DOCTOR') navigate('/doctor');
        else if (userRole === 'ADMIN') navigate('/admin');
        else navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <AuthLayout
      title="Clinical Portal Sign In"
      subtitle="Sign in or use one-click demo credentials to explore"
    >
      {/* Role Picker Segmented Control */}
      <div className="flex justify-center mb-5">
        <SegmentedControl
          options={[
            { label: 'Patient', value: 'PATIENT' },
            { label: 'Doctor', value: 'DOCTOR' },
            { label: 'Admin', value: 'ADMIN' },
          ]}
          value={roleTab}
          onChange={handleRoleTabChange}
        />
      </div>

      {/* Quick Demonstration Fill Pills — Prevents Copy-Paste Errors */}
      <div className="mb-5 pb-4 border-b border-[#ECE9E2]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C968E] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C85A32]" />
            Quick Demo Fill
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C968E] px-1.5 py-0.5 rounded bg-[#F3F1ED]">
            ONE-CLICK
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {roleTab === 'PATIENT' && (
            <>
              <button
                type="button"
                onClick={() => handleQuickFill('aarav@cloudcare.test', 'Patient@123')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all btn-press ${
                  email === 'aarav@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Aarav Patil
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('neha.sharma@cloudcare.test', 'Patient@123')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all btn-press ${
                  email === 'neha.sharma@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Neha Sharma
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('sneha@cloudcare.test', 'Patient@123')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all btn-press ${
                  email === 'sneha@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Sneha Joshi
              </button>
            </>
          )}

          {roleTab === 'DOCTOR' && (
            <>
              <button
                type="button"
                onClick={() => handleQuickFill('rahul@cloudcare.test', 'Doctor@123')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all btn-press ${
                  email === 'rahul@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Dr. Rahul (Cardiology)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('sanjay@cloudcare.test', 'Doctor@123')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all btn-press ${
                  email === 'sanjay@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Dr. Sanjay (Neurology)
              </button>
            </>
          )}

          {roleTab === 'ADMIN' && (
            <button
              type="button"
              onClick={() => handleQuickFill('admin@cloudcare.test', 'Admin@123')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all btn-press ${
                email === 'admin@cloudcare.test'
                  ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                  : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
              }`}
            >
              System Administrator
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50/70 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form with Soft Stone Inputs and Obsidian CTA — noValidate prevents browser popup blocks */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email Address"
          type="text"
          inputMode="email"
          autoComplete="email"
          required
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/\s+/g, ''))}
          onBlur={() => setEmail((prev) => prev.trim().toLowerCase())}
          placeholder={
            roleTab === 'ADMIN'
              ? 'admin@cloudcare.test'
              : roleTab === 'DOCTOR'
              ? 'rahul@cloudcare.test'
              : 'aarav@cloudcare.test'
          }
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          icon={UserCheck}
          className="mt-2"
        >
          Sign In as {roleTab.charAt(0) + roleTab.slice(1).toLowerCase()}
        </Button>
      </form>

      {/* Role-specific contextual footer */}
      {roleTab === 'PATIENT' ? (
        <div className="mt-6 text-center text-xs text-[#6E6A63]">
          <span>New patient? </span>
          <Link
            to="/register"
            className="font-semibold text-[#18181B] hover:text-[#C85A32] underline underline-offset-4 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      ) : (
        <div className="mt-6 p-3 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] flex items-center justify-center gap-2 text-center text-[11px] text-[#6E6A63] font-mono">
          <Shield className="w-3.5 h-3.5 text-[#5B8A72]" />
          <span>Restricted {roleTab === 'ADMIN' ? 'Administrative' : 'Physician'} Access</span>
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;

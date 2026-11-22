import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import { Mail, Lock, UserCheck, AlertCircle, Compass } from 'lucide-react';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState('PATIENT');
  const [email, setEmail] = useState('aarav@cloudcare.test');
  const [password, setPassword] = useState('Patient@123');
  const [error, setError] = useState('');

  // Quick switch between roles and prefill demo accounts
  const handleRoleTabChange = (newRole) => {
    setRoleTab(newRole);
    setError('');
    if (newRole === 'PATIENT') {
      setEmail('aarav@cloudcare.test');
      setPassword('Patient@123');
    } else if (newRole === 'DOCTOR') {
      setEmail('rahul@cloudcare.test');
      setPassword('Doctor@123');
    } else if (newRole === 'ADMIN') {
      setEmail('admin@cloudcare.test');
      setPassword('Admin@123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(email, password);
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
      title="Welcome Back"
      subtitle="Select a workspace or choose a seeded demonstration persona"
    >
      {/* Role Picker Segmented Control */}
      <div className="flex justify-center mb-6">
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

      {/* Demo Persona Quick Select — Refined Editorial Inset */}
      <div className="mb-6 pb-5 border-b border-[#ECE9E2]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C968E] font-medium flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#C85A32]" />
            Quick Demo Personas
          </span>
          <span className="font-mono text-[10px] text-[#9C968E]">ONE-CLICK</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {roleTab === 'PATIENT' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setEmail('aarav@cloudcare.test');
                  setPassword('Patient@123');
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-150 btn-press ${
                  email === 'aarav@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Aarav Patil
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sneha@cloudcare.test');
                  setPassword('Patient@123');
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-150 btn-press ${
                  email === 'sneha@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Sneha Joshi
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('vikram@cloudcare.test');
                  setPassword('Patient@123');
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-150 btn-press ${
                  email === 'vikram@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Vikram Malhotra
              </button>
            </>
          )}

          {roleTab === 'DOCTOR' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setEmail('rahul@cloudcare.test');
                  setPassword('Doctor@123');
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-150 btn-press ${
                  email === 'rahul@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Dr. Rahul (Cardiology)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('priya@cloudcare.test');
                  setPassword('Doctor@123');
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-150 btn-press ${
                  email === 'priya@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Dr. Priya (Dermatology)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('arjun@cloudcare.test');
                  setPassword('Doctor@123');
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-150 btn-press ${
                  email === 'arjun@cloudcare.test'
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                    : 'bg-white hover:bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2]'
                }`}
              >
                Dr. Arjun (Orthopedics)
              </button>
            </>
          )}

          {roleTab === 'ADMIN' && (
            <button
              type="button"
              onClick={() => {
                setEmail('admin@cloudcare.test');
                setPassword('Admin@123');
              }}
              className="text-xs font-semibold px-3.5 py-1 rounded-lg bg-[#1C1917] text-white border border-[#1C1917] shadow-xs btn-press"
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

      {/* Form with Soft Stone Inputs and Obsidian CTA */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@cloudcare.test"
        />

        <Input
          label="Password"
          type="password"
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

      {/* Footer link for patient registration */}
      {roleTab === 'PATIENT' && (
        <div className="mt-6 text-center text-xs text-[#6E6A63]">
          <span>New patient? </span>
          <Link
            to="/register"
            className="font-semibold text-[#18181B] hover:text-[#C85A32] underline underline-offset-4 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import { Mail, Lock, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

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
      title="Welcome to CloudCare"
      subtitle="Sign in to your clinical or patient workspace"
    >
      {/* Role Picker Native iOS Segmented Control */}
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

      {/* Demo Persona Selector Box — iOS Grouped Inset Section (#F7F3EB, rounded-2xl) */}
      <div className="mb-5 p-3.5 rounded-2xl bg-[#F7F3EB] border border-[#E8E0D5] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#231F20] mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E06D53]" />
          <span>One-Click Demonstration Personas:</span>
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
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-150 ios-press-action ${
                  email === 'aarav@cloudcare.test'
                    ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                    : 'bg-white/90 hover:bg-white text-[#231F20] border-[#E8E0D5]'
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
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-150 ios-press-action ${
                  email === 'sneha@cloudcare.test'
                    ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                    : 'bg-white/90 hover:bg-white text-[#231F20] border-[#E8E0D5]'
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
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-150 ios-press-action ${
                  email === 'vikram@cloudcare.test'
                    ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                    : 'bg-white/90 hover:bg-white text-[#231F20] border-[#E8E0D5]'
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
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-150 ios-press-action ${
                  email === 'rahul@cloudcare.test'
                    ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                    : 'bg-white/90 hover:bg-white text-[#231F20] border-[#E8E0D5]'
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
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-150 ios-press-action ${
                  email === 'priya@cloudcare.test'
                    ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                    : 'bg-white/90 hover:bg-white text-[#231F20] border-[#E8E0D5]'
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
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-150 ios-press-action ${
                  email === 'arjun@cloudcare.test'
                    ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                    : 'bg-white/90 hover:bg-white text-[#231F20] border-[#E8E0D5]'
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
              className="text-[11px] font-semibold px-3.5 py-1 rounded-full bg-[#E06D53] text-white border border-[#E06D53] shadow-xs ios-press-action"
            >
              System Administrator
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#FAD8D2] flex items-start gap-2.5 text-xs text-[#D34538]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form with spacious tactile h-12 inputs and warm focus states */}
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
          className="mt-2 h-12 rounded-2xl font-bold tracking-tight text-white shadow-md shadow-[#E06D53]/25"
        >
          Sign In as {roleTab.charAt(0) + roleTab.slice(1).toLowerCase()}
        </Button>
      </form>

      {/* Footer link for patient registration */}
      {roleTab === 'PATIENT' && (
        <div className="mt-5 text-center text-xs text-[#7A7267]">
          <span>New patient? </span>
          <Link
            to="/register"
            className="font-bold text-[#E06D53] hover:text-[#C85A40] transition-colors"
          >
            Create an Account
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;

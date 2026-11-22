import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import { Mail, Lock, UserCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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

      {/* Demo Quick Select Pills */}
      <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-blue-50/40 to-slate-50 border border-indigo-100/70 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
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
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  email === 'aarav@cloudcare.test'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
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
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  email === 'sneha@cloudcare.test'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
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
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  email === 'vikram@cloudcare.test'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
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
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  email === 'rahul@cloudcare.test'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
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
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  email === 'priya@cloudcare.test'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
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
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  email === 'arjun@cloudcare.test'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
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
              className="text-[11px] font-semibold px-3 py-1 rounded-full bg-purple-600 text-white border border-purple-600 shadow-xs"
            >
              System Administrator
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-xs text-rose-700 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
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
        <div className="mt-5 text-center text-xs text-slate-500">
          <span>New patient? </span>
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-indigo-600 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default Login;

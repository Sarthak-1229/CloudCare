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
  const [email, setEmail] = useState('patient@cloudcare.local');
  const [password, setPassword] = useState('Patient123!');
  const [error, setError] = useState('');

  // Quick switch between roles and prefill demo accounts
  const handleRoleTabChange = (newRole) => {
    setRoleTab(newRole);
    setError('');
    if (newRole === 'PATIENT') {
      setEmail('patient@cloudcare.local');
      setPassword('Patient123!');
    } else if (newRole === 'DOCTOR') {
      setEmail('doctor.aakash@cloudcare.local');
      setPassword('Doctor123!');
    } else if (newRole === 'ADMIN') {
      setEmail('admin@cloudcare.local');
      setPassword('Admin123!');
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
      <div className="mb-5 p-3 rounded-[16px] bg-ios-gray-100/80 border border-gray-200/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ios-gray-600 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-ios-blue" />
          <span>One-Click Demo Credentials:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {roleTab === 'PATIENT' && (
            <button
              type="button"
              onClick={() => {
                setEmail('patient@cloudcare.local');
                setPassword('Patient123!');
              }}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-ios-blue hover:text-white border border-gray-200 text-ios-gray-700 transition-all"
            >
              Rahul Sharma (Patient)
            </button>
          )}

          {roleTab === 'DOCTOR' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setEmail('doctor.aakash@cloudcare.local');
                  setPassword('Doctor123!');
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-ios-blue hover:text-white border border-gray-200 text-ios-gray-700 transition-all"
              >
                Dr. Aakash (Cardiology)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('doctor.neha@cloudcare.local');
                  setPassword('Doctor123!');
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-ios-blue hover:text-white border border-gray-200 text-ios-gray-700 transition-all"
              >
                Dr. Neha (Neurology)
              </button>
            </>
          )}

          {roleTab === 'ADMIN' && (
            <button
              type="button"
              onClick={() => {
                setEmail('admin@cloudcare.local');
                setPassword('Admin123!');
              }}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-ios-blue hover:text-white border border-gray-200 text-ios-gray-700 transition-all"
            >
              CloudCare Admin
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-[14px] bg-ios-red-tint border border-ios-red/20 flex items-center gap-2 text-xs font-semibold text-ios-red">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="user@cloudcare.local"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          icon={UserCheck}
          size="lg"
          className="mt-2"
        >
          Sign In as {roleTab === 'PATIENT' ? 'Patient' : roleTab === 'DOCTOR' ? 'Doctor' : 'Administrator'}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="mt-5 pt-4 border-t border-gray-100 text-center">
        {roleTab === 'PATIENT' ? (
          <p className="text-xs text-ios-gray-500">
            First time booking with us?{' '}
            <Link to="/register" className="font-semibold text-ios-blue hover:underline">
              Register as Patient
            </Link>
          </p>
        ) : (
          <p className="text-[11px] text-ios-gray-400">
            Doctor & Admin accounts are securely pre-seeded in RDS. Self-registration is restricted.
          </p>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;

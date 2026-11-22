import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import { Mail, Lock, UserCheck, AlertCircle, Shield } from 'lucide-react';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Switch between portal roles without exposing or injecting passwords
  const handleRoleTabChange = (newRole) => {
    setRoleTab(newRole);
    setError('');
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
      title="Clinical Portal Sign In"
      subtitle="Enter your verified credentials to access your clinical dashboard"
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
          placeholder={
            roleTab === 'ADMIN'
              ? 'admin@hospital.com'
              : roleTab === 'DOCTOR'
              ? 'doctor@hospital.com'
              : 'patient@hospital.com'
          }
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

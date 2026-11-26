import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import { Mail, Lock, UserCheck, AlertCircle, Shield } from 'lucide-react';

const stripRogueChars = (val) =>
  typeof val === 'string' ? val.replace(/[\s"'`<>]+/g, '') : '';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleTabChange = (newRole) => {
    setRoleTab(newRole);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = stripRogueChars(email).toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your email address and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
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
      setError(err.message || 'Authentication failed. Please verify your credentials.');
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
        <div className="mb-5 p-3 rounded-xl bg-red-50/80 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Clean Login Form — noValidate disables native browser popup bubbles; input auto-strips quotes/spaces */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email Address"
          type="text"
          inputMode="email"
          autoComplete="email"
          required
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(stripRogueChars(e.target.value))}
          onBlur={() => setEmail((prev) => stripRogueChars(prev).toLowerCase())}
          placeholder="name@example.com"
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

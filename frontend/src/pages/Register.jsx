import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/patient');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create Patient Account"
      subtitle="Register to book clinical consultations and access records"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50/70 border border-red-200/80 flex items-center gap-2 text-xs font-semibold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Legal Name"
          placeholder="e.g. Rahul Sharma"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="patient@cloudcare.test"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimum 6 characters"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Informative Box */}
        <div className="p-3.5 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] text-xs text-[#6E6A63] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#5B8A72]" />
          <span className="leading-relaxed">
            Registered patients can book doctor consultations across 5 specialties and securely access diagnostic clinical records.
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          className="mt-3"
        >
          Create Patient Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#6E6A63]">
        <span>Already have an account? </span>
        <Link
          to="/login"
          className="font-semibold text-[#18181B] hover:text-[#C85A32] underline underline-offset-4 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;

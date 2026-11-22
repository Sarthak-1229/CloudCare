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
      title="Patient Registration"
      subtitle="Create your CloudCare health account"
    >
      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#FAD8D2] flex items-center gap-2 text-xs font-semibold text-[#D34538]">
          <AlertCircle className="w-4 h-4 shrink-0" />
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

        {/* Informative Grouped Inset Box in Warm Sage */}
        <div className="p-3.5 rounded-2xl bg-[#EDF4F0] border border-[#C4DDD0] text-xs text-[#5B8A72] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Registered patients can book doctor consultations across 5 specialties and securely download diagnostic ECG & clinical records.
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          className="mt-3 h-12 rounded-2xl font-bold tracking-tight text-white shadow-md shadow-[#E06D53]/25"
        >
          Create Patient Account
        </Button>
      </form>

      <div className="mt-5 text-center text-xs text-[#7A7267]">
        <span>Already have an account? </span>
        <Link
          to="/login"
          className="font-bold text-[#E06D53] hover:text-[#C85A40] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;

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
        <div className="mb-4 p-3 rounded-[14px] bg-ios-red-tint border border-ios-red/20 flex items-center gap-2 text-xs font-semibold text-ios-red">
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
          placeholder="patient@example.com"
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

        <div className="p-3 rounded-[14px] bg-ios-blue-tint/60 text-xs text-ios-blue flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Patients receive access to book appointments, review doctors, and securely download diagnostic reports.
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          size="lg"
          className="mt-2"
        >
          Create Patient Account
        </Button>
      </form>

      <div className="mt-5 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-ios-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-ios-blue hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;

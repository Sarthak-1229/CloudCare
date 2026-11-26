import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-[#FBF4EE] border border-[#F3DEC7] text-[#C85A32] flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#18181B] tracking-[-0.03em]">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-[#6E6A63] mt-2 max-w-md">
        The clinical route or view you are trying to access does not exist or has moved.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Return to CloudCare Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

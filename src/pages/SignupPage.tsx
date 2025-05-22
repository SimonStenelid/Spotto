import React from 'react';
import { Navigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import { BrandingSide } from '../components/auth/BrandingSide';
import { useAuthStore } from '../store/useAuthStore';

interface SignupPageProps {
  isNavMenuOpen?: boolean;
}

const SignupPage: React.FC<SignupPageProps> = ({ isNavMenuOpen = false }) => {
  const { authState } = useAuthStore();
  
  // Redirect if already logged in
  if (authState === 'SIGNED_IN') {
    return <Navigate to="/app" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <BrandingSide isNavMenuOpen={isNavMenuOpen} />

      {/* Right side - Auth */}
      <div className={`w-full lg:w-1/2 bg-white flex items-center justify-center min-h-screen lg:min-h-0 transition-all duration-300 ${
        isNavMenuOpen ? 'lg:pl-64' : ''
      }`}>
        <div className="w-full max-w-[400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { MapIllustration } from '../components/auth/MapIllustration';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage: React.FC = () => {
  const { authState } = useAuthStore();
  
  // Redirect if already logged in
  if (authState === 'SIGNED_IN') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="w-full lg:w-1/2 bg-black p-6 lg:p-12 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 lg:mb-16">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-lg flex items-center justify-center text-lg lg:text-xl font-bold">
            S
          </div>
          <span className="text-white text-xl lg:text-2xl font-bold">Spotto</span>
        </div>
        <div className="text-white max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            All the experiences. None of the noise. One place.
          </h2>
          <div className="relative h-[250px] sm:h-[300px] lg:h-[340px] -mx-6 lg:-mx-12 mb-6">
            <MapIllustration className="!w-auto scale-[0.85] sm:scale-100" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          </div>
          <div className="mt-auto pb-6">
            <h2 className="text-2xl lg:text-4xl font-bold mb-3">Discover Stockholm</h2>
            <p className="text-base lg:text-lg text-gray-300">
              Explore the best places, hidden gems, and local favorites in Stockholm. Everything in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 p-6 lg:p-0 flex items-center justify-center bg-white lg:bg-transparent min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md py-8 lg:py-0">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
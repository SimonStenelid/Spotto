import React from 'react';
import { Navigate } from 'react-router-dom';
import { Map } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage: React.FC = () => {
  const { authState } = useAuthStore();
  
  // Redirect if already logged in
  if (authState === 'SIGNED_IN') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col">
      {/* Logo area */}
      <div className="flex items-center justify-center p-6 mt-8">
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
          <Map size={24} className="text-white" />
        </div>
        <h1 className="ml-2 text-2xl font-bold text-purple-800">VibeMap</h1>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
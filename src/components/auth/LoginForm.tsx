import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthTabs } from './AuthTabs';

interface LoginFormProps {
  redirectTo?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm({ redirectTo = '/app' }: LoginFormProps) {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      // Always use production URL for deployment
      const isProduction = window.location.hostname === 'spotto-iota.vercel.app';
      const baseUrl = isProduction 
        ? 'https://spotto-iota.vercel.app' 
        : window.location.origin;
      
      console.log('Google OAuth - Base URL:', baseUrl);
      console.log('Google OAuth - Is Production:', isProduction);
      console.log('Google OAuth - Current hostname:', window.location.hostname);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${baseUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }
      
      if (data?.url) {
        console.log('Redirecting to Google OAuth URL:', data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Error signing in with Google');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(formData.email, formData.password);
      toast.success('Logged in successfully!');
      navigate('/app');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-7">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img src="/favicon.svg" alt="Spotto" className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
        <h1 className="text-2xl sm:text-[32px] font-bold text-[#0f0f0f] mb-1.5 sm:mb-2">Welcome to Spotto</h1>
        <p className="text-sm sm:text-base text-[#333333]">Sign in or create an account</p>
      </div>

      <AuthTabs />

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-[#e5e5e5] rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors"
      >
        <img src="/icons/google.svg" alt="Google" className="w-4 sm:w-5 h-4 sm:h-5" />
        <span className="text-sm sm:text-base font-medium text-[#333333]">Continue with Google</span>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e5e5e5]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white text-xs sm:text-sm text-[#666666]">OR</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#333333] mb-1 sm:mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#e5e5e5] rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-[#333333] mb-1 sm:mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#e5e5e5] rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0f0f0f] text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-xs sm:text-sm text-center text-[#666666]">
        Don't have an account?{' '}
        <Link to="/app/signup" className="font-medium text-[#0f0f0f] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
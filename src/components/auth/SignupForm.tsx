import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthTabs } from './AuthTabs';

interface SignupFormProps {
  redirectTo?: string;
}

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

export default function SignupForm({ redirectTo = '/app' }: SignupFormProps) {
  const navigate = useNavigate();
  const { signUp, signIn, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Error signing in with Google');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signUp(formData.email, formData.password);
      await signIn(formData.email, formData.password);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: formData.username,
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      toast.success('Account created successfully!');
      navigate('/app');
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('already registered')) {
        toast.error('This email is already registered. Please try logging in instead.');
      } else {
        toast.error('Error during signup: ' + (error instanceof Error ? error.message : 'An error occurred'));
      }
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-7">
      <div className="text-center">
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

      <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-[#333333] mb-1 sm:mb-1.5">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#e5e5e5] rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
            placeholder="Enter your username"
          />
        </div>

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
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-xs sm:text-sm text-center text-[#666666]">
        Already have an account?{' '}
        <Link to="/app/login" className="font-medium text-[#0f0f0f] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
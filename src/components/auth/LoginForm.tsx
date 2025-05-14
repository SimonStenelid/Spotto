import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from '../../store/useAuthStore';
import { createClient } from '@supabase/supabase-js';
import GoogleOneTap from './GoogleOneTap';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Get return URL from location state
  const from = location.state?.from?.pathname || '/app';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            redirectTo: window.location.origin + from,
          },
        },
      });
      
      if (error) throw error;
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };
  
  return (
    <div className="w-full max-w-[400px] mx-auto p-6">
      <GoogleOneTap />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Spotto</h1>
        <p className="text-muted-foreground">Sign in or create an account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button variant="link" className="px-0">
            Forgot password?
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button 
            variant="outline" 
            className="w-full" 
            type="button"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup">
          <Button variant="link" className="px-0">
            Sign up
          </Button>
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
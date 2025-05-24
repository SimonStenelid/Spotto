import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initialize } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed');
          navigate('/app/login');
          return;
        }

        if (data.session) {
          // User is authenticated, initialize the auth store
          await initialize();
          
          // Get the redirect URL from query params
          const redirectTo = searchParams.get('redirectTo') || '/app';
          
          toast.success('Successfully signed in!');
          navigate(redirectTo);
        } else {
          // No session found
          console.log('No session found in callback');
          navigate('/app/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast.error('Authentication failed');
        navigate('/app/login');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, initialize]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
} 
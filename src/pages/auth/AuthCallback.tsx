import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { initialize } = useAuthStore();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Handling OAuth callback...');
        console.log('Auth callback - Current URL:', window.location.href);
        console.log('Auth callback - Search params:', Object.fromEntries(searchParams.entries()));
        
        // Check for error in URL params
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('OAuth error from URL:', error, errorDescription);
          setStatus(`OAuth error: ${errorDescription || error}`);
          toast.error(`Authentication failed: ${errorDescription || error}`);
          setTimeout(() => navigate('/app/login'), 3000);
          return;
        }

        setStatus('Getting session...');
        
        // Handle the OAuth callback
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth callback session error:', sessionError);
          setStatus(`Session error: ${sessionError.message}`);
          toast.error('Authentication failed');
          setTimeout(() => navigate('/app/login'), 3000);
          return;
        }

        console.log('Auth callback - Session data:', data);

        if (data.session) {
          setStatus('Initializing user data...');
          
          // User is authenticated, initialize the auth store
          await initialize();
          
          // Get the redirect URL from query params
          const redirectTo = searchParams.get('redirectTo');
          const decodedRedirectTo = redirectTo ? decodeURIComponent(redirectTo) : '/app';
          
          console.log('Auth callback - Redirecting to:', decodedRedirectTo);
          
          setStatus('Success! Redirecting...');
          toast.success('Successfully signed in!');
          
          // Small delay to show success message
          setTimeout(() => navigate(decodedRedirectTo), 1000);
        } else {
          // No session found
          console.log('Auth callback - No session found');
          setStatus('No session found');
          toast.error('Authentication failed - no session');
          setTimeout(() => navigate('/app/login'), 3000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        toast.error('Authentication failed');
        setTimeout(() => navigate('/app/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, initialize]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-600 mb-4">{status}</p>
        <div className="text-xs text-gray-400">
          <p>Current URL: {window.location.href}</p>
          <p>Hostname: {window.location.hostname}</p>
        </div>
      </div>
    </div>
  );
} 
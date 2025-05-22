'use client'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { CredentialResponse } from '@/types/google-one-tap'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            config: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

interface GoogleOneTapProps {
  onSuccess?: (credentialResponse: CredentialResponse) => void;
  onError?: (error: Error) => void;
}

export function GoogleOneTap({ onSuccess, onError }: GoogleOneTapProps) {
  const navigate = useNavigate()

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Google Client ID not found');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: CredentialResponse) => {
          try {
            if (onSuccess) {
              onSuccess(response);
            } else {
              // Default handling if no onSuccess provided
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
              });

              if (error) throw error;

              // Redirect after successful sign in
              navigate('/dashboard');
            }
          } catch (error) {
            console.error('Error handling Google response:', error);
            onError?.(error instanceof Error ? error : new Error(String(error)));
          }
        },
        auto_select: true,
        cancel_on_tap_outside: false,
      });

      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error initializing Google One Tap:', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [navigate, onSuccess, onError]);

  return <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
}

export default GoogleOneTap 
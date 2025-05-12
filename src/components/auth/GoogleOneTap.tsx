'use client'

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    google: typeof google;
  }
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

const GoogleOneTap = () => {
  const navigate = useNavigate()

  // Generate nonce for security
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
  }

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      console.log('Initializing Google One Tap')
      window.addEventListener('load', async () => {
        const [nonce, hashedNonce] = await generateNonce()
        
        // Check for existing session
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session', error)
        }
        if (data.session) {
          navigate('/')
          return
        }

        // Load Google script
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        script.onload = () => {
          // Initialize Google One Tap
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
            callback: async (response: CredentialResponse) => {
              try {
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: response.credential,
                  nonce,
                })
                
                if (error) throw error
                
                console.log('Successfully logged in with Google One Tap')
                navigate('/')
              } catch (error) {
                console.error('Error logging in with Google One Tap', error)
              }
            },
            nonce: hashedNonce,
            use_fedcm_for_prompt: true,
          })

          window.google.accounts.id.prompt()
        }
      })
    }

    initializeGoogleOneTap()
    return () => window.removeEventListener('load', initializeGoogleOneTap)
  }, [])

  return <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
}

export default GoogleOneTap 
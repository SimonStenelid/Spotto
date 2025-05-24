import { supabase } from '../../../lib/supabase'

export async function createCheckoutSession(userId: string, userEmail?: string) {
  try {
    console.log('Creating checkout session for user:', userId, userEmail)
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('Session check:', {
      hasSession: !!session,
      hasAccessToken: !!session?.access_token,
      userId: session?.user?.id,
      sessionError
    })
    
    if (sessionError || !session?.access_token) {
      console.error('Session error:', sessionError)
      throw new Error('User not authenticated')
    }

    // Verify the session user matches the requested user
    if (session.user.id !== userId) {
      console.error('User ID mismatch:', { sessionUserId: session.user.id, requestedUserId: userId })
      throw new Error('User ID mismatch')
    }

    // Get the Supabase project URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured')
    }

    console.log('Making request to Edge function with token:', session.access_token.substring(0, 20) + '...')

    const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ 
        userId,
        userEmail: userEmail || session.user?.email 
      }),
    })

    console.log('Edge function response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Edge function error response:', errorData)
      throw new Error(errorData.error || 'Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    console.log('Checkout session created successfully:', sessionId)
    return { sessionId }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
} 
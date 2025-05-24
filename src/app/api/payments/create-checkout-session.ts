import { supabase } from '../../../lib/supabase'

export async function createCheckoutSession(userId: string, userEmail?: string) {
  try {
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.access_token) {
      throw new Error('User not authenticated')
    }

    // Get the Supabase project URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('Supabase URL not configured')
    }

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    return { sessionId }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
} 
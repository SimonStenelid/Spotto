import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cryptoProvider = Deno.env.get('DENO_DEPLOYMENT_ID') ? crypto : await import('node:crypto')

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')
  const body = await request.text()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  let event
  try {
    // Verify webhook signature
    const elements = signature.split(',')
    const signatureElements = elements.reduce((acc, element) => {
      const [key, value] = element.split('=')
      if (key === 't') {
        acc.timestamp = parseInt(value, 10)
      } else if (key.startsWith('v1')) {
        acc.signatures.push(value)
      }
      return acc
    }, { timestamp: 0, signatures: [] as string[] })

    const timestamp = signatureElements.timestamp
    const signatures = signatureElements.signatures

    const payloadForSignature = `${timestamp}.${body}`
    const expectedSignature = await cryptoProvider.subtle.importKey(
      'raw',
      new TextEncoder().encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(key => 
      cryptoProvider.subtle.sign('HMAC', key, new TextEncoder().encode(payloadForSignature))
    ).then(signature => 
      Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    )

    const isSignatureValid = signatures.some(signature => signature === expectedSignature)
    
    if (!isSignatureValid) {
      console.error('Invalid signature')
      return new Response('Invalid signature', { status: 400 })
    }

    event = JSON.parse(body)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  // Create Supabase client with service role key for admin operations
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.userId
      const userEmail = session.metadata?.userEmail || session.customer_email

      console.log('Processing payment completion:', {
        sessionId: session.id,
        userId,
        userEmail,
        amount: session.amount_total,
        currency: session.currency
      })

      if (!userId && !userEmail) {
        console.error('No user identifier found in session metadata')
        return new Response('No user identifier found', { status: 400 })
      }

      // First, try to find user by ID, then by email
      let targetUserId = userId
      if (!targetUserId && userEmail) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .single()
        
        if (profile) {
          targetUserId = profile.id
          console.log('Found user by email:', userEmail, '-> ID:', targetUserId)
        }
      }

      if (!targetUserId) {
        console.error('Could not find user with ID or email:', { userId, userEmail })
        return new Response('User not found', { status: 400 })
      }

      // Record the payment
      const { data: paymentData, error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert({
          user_id: targetUserId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          status: 'succeeded',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (paymentError) {
        console.error('Error recording payment:', paymentError)
        return new Response('Error recording payment', { status: 500 })
      }

      console.log('Payment recorded successfully:', paymentData)

      // Update or create membership - use the correct column names
      const { error: membershipError } = await supabaseAdmin
        .from('Membership')
        .upsert({
          id: targetUserId, // The id column references auth.users.id
          membership: 'paid', // Update the membership type to 'paid'
          payment_id: paymentData.id, // Link to the payment record
          email: userEmail,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id' // Use 'id' instead of 'user_id'
        })

      if (membershipError) {
        console.error('Error updating membership:', membershipError)
        return new Response('Error updating membership', { status: 500 })
      }

      console.log('Successfully processed payment and activated membership for user:', targetUserId)
      return new Response('Payment processed successfully', { status: 200 })
    }

    // For other event types, just acknowledge receipt
    return new Response('Event received', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }
}) 
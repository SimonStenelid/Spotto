import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (request) => {
  // Handle CORS and method checks
  if (request.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      } 
    })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const signature = request.headers.get('stripe-signature')
    const body = await request.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    console.log('Webhook attempt:', {
      hasSignature: !!signature,
      hasSecret: !!webhookSecret,
      bodyLength: body.length,
      headers: Object.fromEntries(request.headers.entries())
    })

    if (!signature) {
      console.error('No Stripe signature found')
      return new Response('No signature', { status: 400 })
    }

    if (!webhookSecret) {
      console.error('No webhook secret configured')
      return new Response('No webhook secret', { status: 500 })
    }

    // Simple signature verification (basic approach)
    const elements = signature.split(',')
    const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1]
    const sig = elements.find(el => el.startsWith('v1='))?.split('=')[1]

    if (!timestamp || !sig) {
      console.error('Invalid signature format')
      return new Response('Invalid signature format', { status: 400 })
    }

    // Create the payload for verification
    const payload = `${timestamp}.${body}`
    
    // Use Web Crypto API for HMAC verification
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature_bytes = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payload)
    )
    
    const expected_sig = Array.from(new Uint8Array(signature_bytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (sig !== expected_sig) {
      console.error('Signature verification failed')
      return new Response('Invalid signature', { status: 400 })
    }

    // Parse the event
    const event = JSON.parse(body)
    console.log(`✅ Verified webhook: ${event.id} - ${event.type}`)

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.userId
      const userEmail = session.metadata?.userEmail || session.customer_email

      console.log('Processing payment:', {
        sessionId: session.id,
        userId,
        userEmail,
        amount: session.amount_total
      })

      if (!userId && !userEmail) {
        console.error('No user identifier found')
        return new Response('No user identifier', { status: 400 })
      }

      // Create Supabase admin client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Find user ID if we only have email
      let targetUserId = userId
      if (!targetUserId && userEmail) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .single()
        
        if (profile) {
          targetUserId = profile.id
          console.log('Found user by email:', targetUserId)
        }
      }

      if (!targetUserId) {
        console.error('User not found')
        return new Response('User not found', { status: 400 })
      }

      // Insert payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: targetUserId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          amount: session.amount_total,
          currency: session.currency,
          status: 'succeeded'
        })
        .select()
        .single()

      if (paymentError) {
        console.error('Payment insert error:', paymentError)
        return new Response('Payment error', { status: 500 })
      }

      console.log('Payment recorded:', payment.id)

      // Update membership
      const { error: membershipError } = await supabase
        .from('Membership')
        .upsert({
          id: targetUserId,
          membership: 'paid',
          payment_id: payment.id,
          email: userEmail,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (membershipError) {
        console.error('Membership update error:', membershipError)
        return new Response('Membership error', { status: 500 })
      }

      console.log('✅ Payment processed successfully for user:', targetUserId)
      return new Response('Success', { status: 200 })
    }

    // Acknowledge other events
    console.log(`Event ${event.type} acknowledged`)
    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal error', { status: 500 })
  }
}) 
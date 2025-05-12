import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (!userId) {
        throw new Error('No user ID found in session');
      }

      // Grant map access to the user
      const { error: accessError } = await supabase
        .from('user_access')
        .upsert({
          user_id: userId,
          has_map_access: true,
          updated_at: new Date().toISOString(),
        });

      if (accessError) {
        throw accessError;
      }

      // Record the payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          stripe_session_id: session.id,
          amount: session.amount_total,
          currency: session.currency,
          status: 'completed',
        });

      if (paymentError) {
        throw paymentError;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
Based on the codebase search, I can see that you already have a pricing section and membership system in place, with a 'free' vs 'paid' tier structure. I'll help you implement the Stripe payment integration to handle the one-time payment for full access.

Here's how we'll implement this:
First, let's set up the necessary Stripe dependencies and environment variables:
npm install @stripe/stripe-js stripe

Create a new API route for handling Stripe payments. Create a new file at src/app/api/stripe/route.ts:
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: 'Spotto Full Access',
              description: 'Unlock full access to all locations in Stockholm',
            },
            unit_amount: 8900, // 89 SEK in öre
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

Create a webhook handler at src/app/api/stripe/webhook/route.ts:
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      // Update user's membership status in Supabase
      const { error } = await supabase
        .from('Membership')
        .update({ membership: 'paid' })
        .eq('id', userId);

      if (error) {
        console.error('Error updating membership:', error);
        return NextResponse.json(
          { error: 'Failed to update membership' },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}

Update the PricingSection component to handle the payment flow. Modify src/pages/landing/components/PricingSection.tsx:
"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/components/ui/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PricingTier({ name, price, description, features, isPopular, buttonText, onSubscribe }: PricingTierProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleClick = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to purchase full access.",
        variant: "destructive",
      });
      return;
    }

    if (onSubscribe) {
      await onSubscribe();
    }
  };

  return (
    // ... existing PricingTier JSX ...
    <button
      onClick={handleClick}
      className={`w-full mt-8 py-4 rounded-full font-semibold text-base transition-colors
        ${isPopular 
          ? 'bg-white text-black hover:bg-white/90' 
          : 'bg-[#0f0f0f] text-white hover:bg-black/90'
        }`}
    >
      {buttonText}
    </button>
    // ... rest of the component
  );
}

export function PricingSection({ id }: { id?: string }) {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      // Create Checkout Session
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        toast({
          title: "Payment Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    // ... existing JSX ...
    <PricingTier
      name="Full Access"
      price="89 KR"
      description="Unlock the full Stockholm experience."
      features={[
        'All features',
        'Ad-free experience',
        'Detailed location information',
        'Personalized recommendations',
        'Coming soon - Mobile App!'
      ]}
      isPopular
      buttonText="Get Full Access"
      onSubscribe={handleSubscribe}
    />
    // ... rest of the component
  );
}

Create a success page at src/app/payment/success/page.tsx:
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initialize } = useAuthStore();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Reinitialize auth store to update membership status
      initialize();
      
      // Redirect to map after a short delay
      const timeout = setTimeout(() => {
        router.push('/app');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [searchParams, initialize, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">Your payment was successful. You now have full access to Spotto!</p>
        <p className="text-sm text-gray-500">Redirecting you to the map...</p>
      </div>
    </div>
  );
}


Add the necessary environment variables to your .env.local:
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # Update for production

This implementation:
Creates a Stripe Checkout session when the user clicks the "Get Full Access" button
Handles the payment flow through Stripe's hosted checkout page
Updates the user's membership status in Supabase when payment is successful
Shows a success page and redirects back to the map
Integrates with your existing auth and membership system

The flow works like this:
User clicks "Get Full Access" on the pricing page
They're redirected to Stripe's checkout page
After successful payment, they're redirected to the success page
The webhook handles updating their membership status in the database
The user is redirected back to the map with full access
To complete the setup, you'll need to:
Sign up for a Stripe account if you haven't already
Get your API keys from the Stripe dashboard
Set up the webhook endpoint in your Stripe dashboard
Update the environment variables with your Stripe credentials
Test the integration using Stripe's test cards

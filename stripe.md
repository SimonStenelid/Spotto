# Stripe Integration Implementation Guide

## Overview

This guide implements Stripe for a single-time payment system where users can pay once to gain full access to all map locations. Users without payment will have preview access only.

## Current System Analysis

Your app already has:
- A `Membership` table with 'paid' | 'free' status
- Access control logic in `getPlaces()` that serves different data based on membership
- User authentication via Supabase
- Zustand store managing auth and membership state

Application Overview
Spotto is a location discovery app for Stockholm that provides users with curated places to visit. It's built with:
Frontend: React + Vite + TypeScript
Backend: Supabase (PostgreSQL database)
Authentication: Supabase Auth
State Management: Zustand
UI: Tailwind CSS + Radix UI components
Maps: Mapbox GL
Current Membership System
Your app already has a freemium model implemented:
Database Structure:
Membership table with paid | free status
places table (full data for paid users)
places_preview table (limited data for free users)
Access Control Logic:
Free users see limited places from places_preview
Paid users get full access to all places in places
Visual indicator shows "Preview user - upgrade for full access"
Pricing Model (from PricingSection.tsx):
Free: Preview access (0 KR)
Paid: Full access (89 KR one-time payment)
Payment Integration Needed
Based on your stripe.md file and current setup, you need:

1. Stripe One-Time Payment System
Product: "Full Access to Stockholm" (89 KR)
Payment Flow: Stripe Checkout for one-time payment
Post-Payment: Update user's membership from 'free' to 'paid'

2. Key Components to Build
Payment Button - Replace "Subscribe Now" in PricingSection
Stripe Checkout Integration - Handle payment flow
Webhook Handler - Process successful payments
Success/Cancel Pages - Handle post-payment redirects
Membership Upgrade Logic - Update database after payment


4. User Journey
User sees pricing page with "Subscribe Now" button
Click triggers Stripe Checkout session
User completes payment (89 KR)
Webhook updates membership status to 'paid'
User gains access to full place data immediately
Would you like me to implement this Stripe payment system for your application? I can start by:
Adding the required Stripe dependencies
Creating the payment components
Setting up the Stripe configuration
Building the checkout flow



## Implementation Steps

### 1. Install Dependencies

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
npm install --save-dev @types/stripe
```

### 2. Environment Variables

Add to your `.env.local`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PRICE_ID=price_...  # Your one-time payment price ID
```

### 3. Database Schema Updates

Create a new migration `migrations/add_payments_table.sql`:

```sql
-- Add payments tracking table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Update membership table if needed
ALTER TABLE "Membership" ADD COLUMN IF NOT EXISTS 
  payment_id UUID REFERENCES payments(id);
```

### 4. Create Stripe Configuration

Create `src/lib/stripe.ts`:

```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key');
}

export const stripePromise = loadStripe(stripePublishableKey);

export const STRIPE_CONFIG = {
  priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
  successUrl: `${window.location.origin}/payment/success`,
  cancelUrl: `${window.location.origin}/payment/canceled`,
} as const;
```

### 5. Create Payment API Helper

Create `src/app/api/payments/create-checkout-session.ts`:

```typescript
import { supabase } from '../../../lib/supabase';

export async function createCheckoutSession(userId: string) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return { sessionId };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
```

### 6. Backend API Endpoints (Supabase Edge Functions)

Create `supabase/functions/create-checkout-session/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { userId } = await req.json();

    // Create or get Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: Deno.env.get('VITE_STRIPE_PRICE_ID'),
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment/canceled`,
      customer_email: profile?.email,
      metadata: {
        userId: userId,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
```

### 7. Webhook Handler for Payment Completion

Create `supabase/functions/stripe-webhook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          // Update membership to paid
          await supabase
            .from('Membership')
            .upsert({
              id: userId,
              membership: 'paid',
              updated_at: new Date().toISOString(),
            });

          // Record payment
          await supabase
            .from('payments')
            .insert({
              user_id: userId,
              stripe_payment_intent_id: session.payment_intent as string,
              stripe_customer_id: session.customer as string,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'succeeded',
            });
        }
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update payment record to failed
        await supabase
          .from('payments')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        break;
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
});
```

### 8. Payment Components

Create `src/components/payment/PaymentModal.tsx`:

```typescript
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '../../store/useAuthStore';
import { createCheckoutSession } from '../../app/api/payments/create-checkout-session';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePayment = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { sessionId } = await createCheckoutSession(user.id);
      
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) throw new Error('Stripe failed to load');

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock Full Access</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Get unlimited access to all locations</h3>
            <p className="text-gray-600 mb-4">
              One-time payment • Lifetime access • All current and future locations
            </p>
            <div className="text-3xl font-bold text-green-600 mb-4">$29.99</div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Access to all map locations
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              No monthly fees
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Future updates included
            </div>
          </div>
          
          <Button 
            onClick={handlePayment} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Processing...' : 'Get Full Access'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### 9. Payment Success/Cancel Pages

Create `src/pages/payment/PaymentSuccess.tsx`:

```typescript
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { upgradeToPaid } = useAuthStore();
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Update membership status
      upgradeToPaid();
      
      // Redirect to main app after a few seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [searchParams, upgradeToPaid, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Welcome to full access! Redirecting you back to the app...
        </p>
      </div>
    </div>
  );
};
```

Create `src/pages/payment/PaymentCanceled.tsx`:

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export const PaymentCanceled: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold mb-2">Payment Canceled</h1>
        <p className="text-gray-600 mb-4">
          No worries! You can try again anytime.
        </p>
        <Button onClick={() => navigate('/')}>
          Back to App
        </Button>
      </div>
    </div>
  );
};
```

### 10. Update Auth Store

Add to `src/store/useAuthStore.ts`:

```typescript
interface AuthStore {
  // ... existing properties
  upgradeToPaid: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // ... existing code
  
  upgradeToPaid: async () => {
    const { user } = get();
    if (!user) return;

    try {
      // Update local state immediately for better UX
      set({ membership: 'paid' });
      
      // Verify with backend
      await get().initialize();
    } catch (error) {
      console.error('Error upgrading membership:', error);
      // Revert local state if backend fails
      set({ membership: 'free' });
    }
  },
}));
```

### 11. Integration with Existing Components

Update your map or main component to show the payment modal when needed:

```typescript
// Example integration in src/components/map/MapContainer.tsx
import { PaymentModal } from '../payment/PaymentModal';
import { useAuthStore } from '../../store/useAuthStore';

export const MapContainer: React.FC = () => {
  const { membership } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  
  const handleUpgradeClick = () => {
    setShowPaymentModal(true);
  };

  // Show upgrade prompt for free users
  if (membership === 'free') {
    return (
      <>
        {/* Your existing map component */}
        
        {/* Upgrade banner */}
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Preview Mode</h3>
              <p className="text-sm text-gray-600">
                Upgrade to see all locations
              </p>
            </div>
            <Button onClick={handleUpgradeClick}>
              Upgrade Now
            </Button>
          </div>
        </div>
        
        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)} 
        />
      </>
    );
  }

  return (
    // Your full map component for paid users
  );
};
```

### 12. Router Updates

Add payment routes to your router configuration:

```typescript
// In your router setup
import { PaymentSuccess } from './pages/payment/PaymentSuccess';
import { PaymentCanceled } from './pages/payment/PaymentCanceled';

// Add these routes
{
  path: '/payment/success',
  element: <PaymentSuccess />
},
{
  path: '/payment/canceled',
  element: <PaymentCanceled />
}
```

## Deployment Setup

### Supabase Edge Functions

1. Deploy the edge functions:
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

2. Set environment variables in Supabase dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Stripe Configuration

1. Create a product and price in Stripe Dashboard
2. Set up webhook endpoint pointing to your edge function:
   - URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
3. Copy webhook secret to environment variables

## Testing Strategy

1. **Development Testing**:
   - Use Stripe test keys
   - Test complete flow: signup → preview → payment → full access
   - Verify webhook handling with Stripe CLI

2. **Access Control Testing**:
   - Verify free users see preview data only
   - Verify paid users see full data
   - Test edge cases (expired sessions, failed payments)

3. **Payment Flow Testing**:
   - Test successful payments
   - Test canceled payments
   - Test failed payments
   - Verify database updates correctly

## Key Benefits

1. **Leverages Existing System**: Uses current membership infrastructure
2. **Secure**: Payments processed by Stripe, webhooks verify completion
3. **User-Friendly**: Clear upgrade paths and instant access after payment
4. **Maintainable**: Clean separation of concerns with dedicated components
5. **Scalable**: Easy to modify pricing or add features later

## Security Considerations

- All payment processing handled by Stripe
- Webhook signatures verified to prevent tampering
- Database updates only through secure webhooks
- User access controlled at database level
- Environment variables for sensitive keys

## Future Enhancements

- Add payment history page
- Implement refund handling
- Add promotional codes
- Multiple pricing tiers
- Subscription options

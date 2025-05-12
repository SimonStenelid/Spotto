'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentSession } from '../../api/create-payment';

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing Stripe publishable key');
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentButtonProps {
  priceId?: string; // Made optional since we're using a fixed price ID
}

export function PaymentButton({ priceId }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      console.log('Initializing payment...');

      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }
      console.log('Stripe initialized');

      // Create the payment session
      console.log('Creating payment session...');
      const { sessionId } = await createPaymentSession();
      console.log('Session created:', sessionId);

      // Redirect to Stripe Checkout
      console.log('Redirecting to checkout...');
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full sm:w-auto px-8 py-3"
    >
      {isLoading ? 'Processing...' : 'Get Access Now'}
    </Button>
  );
} 
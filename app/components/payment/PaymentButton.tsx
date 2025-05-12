'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentSession } from '@/api/create-payment';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentButtonProps {
  priceId: string;
}

export function PaymentButton({ priceId }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }

      // Create the payment session
      const { sessionId } = await createPaymentSession();
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
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
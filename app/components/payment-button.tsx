import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentSession } from '@/api/create-payment';
import { toast } from 'sonner';

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing Stripe publishable key');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentButtonProps {
  className?: string;
}

export function PaymentButton({ className }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Initialize Stripe first
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }

      // Create the payment session
      console.log('Creating payment session...');
      const { sessionId } = await createPaymentSession();
      console.log('Payment session created:', sessionId);

      // Redirect to checkout
      console.log('Redirecting to checkout...');
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(`Stripe checkout error: ${stripeError.message}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Payment failed: ${errorMessage}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
      variant="default"
      size="lg"
    >
      {isLoading ? 'Processing...' : 'Get Access Now'}
    </Button>
  );
} 
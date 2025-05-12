import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session) {
    redirect('/login');
  }

  if (!searchParams.session_id) {
    redirect('/');
  }

  try {
    // Verify the payment with Stripe
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions/' + searchParams.session_id, {
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const checkoutSession = await response.json();

    if (checkoutSession.payment_status === 'paid') {
      // Record the payment in our database
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: session.user.id,
          stripe_payment_id: checkoutSession.payment_intent,
          amount: checkoutSession.amount_total,
          currency: checkoutSession.currency,
          status: checkoutSession.payment_status,
        });

      if (paymentError) {
        console.error('Failed to record payment:', paymentError);
        throw new Error('Failed to record payment');
      }

      // Grant map access to the user
      const { error: accessError } = await supabase
        .rpc('grant_map_access', {
          user_id: session.user.id,
        });

      if (accessError) {
        console.error('Failed to grant map access:', accessError);
        throw new Error('Failed to grant map access');
      }

      redirect('/map');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Processing your payment...</h1>
        <p className="text-gray-600">
          Please wait while we verify your payment and set up your access.
        </p>
      </div>
    </div>
  );
} 
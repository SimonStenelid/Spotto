import Stripe from 'stripe';

if (!import.meta.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function createPaymentSession() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1RNMX0IHzpxHykvkJ7t6DroI',
          quantity: 1,
        },
      ],
      mode: 'payment',
      submit_type: 'pay',
      billing_address_collection: 'auto',
      success_url: `${import.meta.env.VITE_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.VITE_BASE_URL}`,
      locale: 'sv', // Swedish locale since we're using SEK
      allow_promotion_codes: true,
      customer_creation: 'always',
    });

    if (!session?.id) {
      throw new Error('No session ID returned from Stripe');
    }

    return { sessionId: session.id };
  } catch (error) {
    console.error('Stripe error details:', error);
    if (error instanceof Error) {
      throw new Error(`Payment session creation failed: ${error.message}`);
    }
    throw new Error('Unknown error during payment session creation');
  }
} 
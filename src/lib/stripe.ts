import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Validate the Stripe publishable key
if (!stripePublishableKey) {
  console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable')
  console.error('Available env vars:', Object.keys(import.meta.env))
  
  // In production, we'll handle this gracefully rather than throwing
  if (import.meta.env.PROD) {
    console.warn('Stripe will not be available due to missing configuration')
  } else {
    throw new Error('Missing Stripe publishable key')
  }
}

if (stripePublishableKey && typeof stripePublishableKey !== 'string') {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY must be a string, got:', typeof stripePublishableKey)
  throw new Error('Invalid Stripe publishable key type')
}

if (stripePublishableKey && !stripePublishableKey.startsWith('pk_')) {
  console.error('Invalid Stripe publishable key format. Expected to start with "pk_", got:', stripePublishableKey.substring(0, 10))
  throw new Error('Invalid Stripe publishable key format')
}

// Only create stripe promise if we have a valid key
export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

export const STRIPE_CONFIG = {
  priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1RRidMCM7Q3fmVNpIYWtVOwT', // Updated to correct price ID
  productId: 'prod_SMPy2RA6MKY3R5',
  successUrl: `${window.location.origin}/payment/success`,
  cancelUrl: `${window.location.origin}/payment/canceled`,
  isConfigured: !!stripePublishableKey,
} as const 
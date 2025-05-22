import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key')
}

export const stripePromise = loadStripe(stripePublishableKey)

export const STRIPE_CONFIG = {
  priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1RRh8gCM7Q3fmVNp5ws7LsXn', // Fallback to our created price
  productId: 'prod_SMPy2RA6MKY3R5',
  successUrl: `${window.location.origin}/payment/success`,
  cancelUrl: `${window.location.origin}/payment/canceled`,
} as const 
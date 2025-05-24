'use client'

import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuthStore } from '../../store/useAuthStore'
import { createCheckoutSession } from '../../app/api/payments/create-checkout-session'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { STRIPE_CONFIG } from '../../lib/stripe'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Check if Stripe is properly configured
  if (!STRIPE_CONFIG.isConfigured) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Temporarily Unavailable</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Payment processing is temporarily unavailable due to a configuration issue. 
                Please try again later or contact support.
              </p>
            </div>
            
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const handlePayment = async () => {
    if (!user) {
      setError('Please log in to continue with payment')
      return
    }

    // Validate Stripe publishable key
    const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!stripePublishableKey || typeof stripePublishableKey !== 'string' || !stripePublishableKey.startsWith('pk_')) {
      setError('Payment system configuration error. Please contact support.')
      console.error('Invalid Stripe publishable key:', stripePublishableKey)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Starting payment process for user:', user.id)
      
      const { sessionId } = await createCheckoutSession(user.id, user.email || undefined)
      
      if (!sessionId) {
        throw new Error('Failed to create payment session')
      }

      console.log('Loading Stripe with key:', stripePublishableKey.substring(0, 10) + '...')
      const stripe = await loadStripe(stripePublishableKey)
      
      if (!stripe) {
        throw new Error('Failed to load Stripe. Please check your internet connection and try again.')
      }

      console.log('Redirecting to Stripe checkout with session:', sessionId)
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      
      if (stripeError) {
        throw new Error(stripeError.message || 'Payment redirect failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock Full Access</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Get unlimited access to all Stockholm locations</h3>
            <p className="text-gray-600 mb-4">
              One-time payment • Lifetime access • All current and future locations
            </p>
            <div className="text-3xl font-bold text-purple-600 mb-4">59 KR</div>
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
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Support local Stockholm discoveries
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <Button 
            onClick={handlePayment} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Processing...' : 'Get Full Access'}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
'use client'

import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuthStore } from '../../store/useAuthStore'
import { createCheckoutSession } from '../../app/api/payments/create-checkout-session'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(false)

  const handlePayment = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { sessionId } = await createCheckoutSession(user.id, user.email || undefined)
      
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      if (!stripe) throw new Error('Stripe failed to load')

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) throw error
    } catch (error) {
      console.error('Payment error:', error)
      // Handle error (show toast, etc.)
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
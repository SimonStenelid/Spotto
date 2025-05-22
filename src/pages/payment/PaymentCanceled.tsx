import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'

export function PaymentCanceled() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-6">😔</div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Payment Canceled</h1>
        <p className="text-gray-600 mb-6 text-lg">
          No worries! You can try again anytime to unlock full access to all Stockholm locations.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">
            💡 Your account is still active
          </p>
          <p className="text-blue-600 text-sm">
            You can continue using the preview version while you decide.
          </p>
        </div>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/app')}
            size="lg"
            className="w-full"
          >
            Back to App
          </Button>
          <Button 
            onClick={() => navigate('/#pricing')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            View Pricing Again
          </Button>
        </div>
      </div>
    </div>
  )
} 
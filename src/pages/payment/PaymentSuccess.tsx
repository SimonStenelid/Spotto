import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../../components/ui/button'

export function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { initialize } = useAuthStore()
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      // Refresh auth state to get updated membership
      initialize()
      
      // Redirect to main app after a few seconds
      setTimeout(() => {
        navigate('/app')
      }, 4000)
    }
  }, [searchParams, initialize, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Payment Successful!</h1>
        <p className="text-gray-600 mb-6 text-lg">
          Welcome to full access! You can now explore all the amazing places Stockholm has to offer.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            ✓ Full access activated
          </p>
          <p className="text-green-600 text-sm">
            Redirecting you back to the app...
          </p>
        </div>
        <Button 
          onClick={() => navigate('/app')}
          size="lg"
          className="w-full"
        >
          Go to App Now
        </Button>
      </div>
    </div>
  )
} 
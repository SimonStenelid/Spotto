import React from 'react'

export function PaymentDebug() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      <div className="space-y-1">
        <div>
          <strong>Stripe Key:</strong> {stripeKey ? `${stripeKey.substring(0, 10)}...` : 'MISSING'}
        </div>
        <div>
          <strong>Supabase URL:</strong> {supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING'}
        </div>
        <div>
          <strong>Supabase Anon:</strong> {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'MISSING'}
        </div>
        <div>
          <strong>Environment:</strong> {import.meta.env.MODE}
        </div>
        <div>
          <strong>Origin:</strong> {window.location.origin}
        </div>
      </div>
    </div>
  )
} 
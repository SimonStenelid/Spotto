import React from 'react'
import { Button } from '../ui/button'

export function EnvironmentChecker() {
  const [isVisible, setIsVisible] = React.useState(false)
  
  const envVars = {
    'VITE_STRIPE_PUBLISHABLE_KEY': import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'MODE': import.meta.env.MODE,
    'PROD': import.meta.env.PROD,
  }

  const checkEnvVar = (key: string, value: any) => {
    if (!value) return { status: 'missing', color: 'text-red-600' }
    
    if (key === 'VITE_STRIPE_PUBLISHABLE_KEY') {
      if (typeof value === 'string' && value.startsWith('pk_')) {
        return { status: 'valid', color: 'text-green-600' }
      }
      return { status: 'invalid format', color: 'text-orange-600' }
    }
    
    if (key === 'VITE_SUPABASE_URL') {
      if (typeof value === 'string' && value.startsWith('https://')) {
        return { status: 'valid', color: 'text-green-600' }
      }
      return { status: 'invalid format', color: 'text-orange-600' }
    }
    
    return { status: 'present', color: 'text-blue-600' }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button 
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          Check Env
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white/95 backdrop-blur-sm border rounded-lg p-4 max-w-md shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Environment Variables</h3>
        <Button 
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-2 text-xs">
        {Object.entries(envVars).map(([key, value]) => {
          const check = checkEnvVar(key, value)
          return (
            <div key={key} className="flex justify-between items-center">
              <span className="font-mono text-gray-600">{key}:</span>
              <div className="flex items-center gap-2">
                <span className={check.color}>{check.status}</span>
                {value && (
                  <span className="text-gray-400 font-mono">
                    {typeof value === 'string' ? `${value.substring(0, 8)}...` : String(value)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
        <p>Environment: {import.meta.env.MODE}</p>
        <p>Host: {window.location.hostname}</p>
      </div>
    </div>
  )
} 
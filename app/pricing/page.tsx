import React from 'react';
import { PaymentButton } from '@/components/payment/PaymentButton';

export default function PricingPage() {
  // Using the price ID from your Stripe product
  const priceId = 'price_1RNKIVIHzpxHykvkaP8F9ekS'; // 49 SEK price

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Unlock Full Access</h1>
          <p className="mt-2 text-gray-600">
            Get access to our interactive map and discover all the hidden gems in Stockholm
          </p>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">One-time payment</span>
              <span className="text-2xl font-bold">49 SEK</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Full map access
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Discover hidden gems
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Lifetime access
              </li>
            </ul>
            <div className="mt-6">
              <PaymentButton priceId={priceId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
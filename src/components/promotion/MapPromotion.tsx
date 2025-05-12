import React from 'react';
import { PaymentButton } from '../payment/PaymentButton';
import { MapIcon, CheckIcon } from '@heroicons/react/24/outline';

interface MapPromotionProps {
  variant?: 'full' | 'compact';
}

export function MapPromotion({ variant = 'full' }: MapPromotionProps) {
  const priceId = 'price_1RNKIVIHzpxHykvkaP8F9ekS'; // 49 SEK price

  const features = [
    'Full access to the interactive map',
    'Discover curated local spots',
    'Find hidden gems in Stockholm',
    'Save your favorite places',
    'Get detailed place information',
    'Access from any device',
  ];

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <MapIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Unlock Full Map Access
            </h3>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Discover Stockholm's hidden gems
            </p>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">49 SEK</div>
              <div className="text-sm text-gray-500">One-time payment</div>
            </div>
          </div>
          <PaymentButton priceId={priceId} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <MapIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Unlock Full Map Access
              </h2>
            </div>
            <p className="text-xl text-gray-600">
              Discover all the hidden gems Stockholm has to offer
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900">49 SEK</div>
            <div className="text-gray-500">Lifetime access</div>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6">
                <CheckIcon className="h-6 w-6 text-green-500" />
              </div>
              <p className="ml-3 text-gray-600">{feature}</p>
            </li>
          ))}
        </ul>

        {/* Payment Button */}
        <div className="flex justify-center">
          <PaymentButton priceId={priceId} />
        </div>
      </div>

      {/* Money-back Guarantee */}
      <div className="bg-gray-50 px-8 py-6">
        <div className="text-center text-gray-600 text-sm">
          Not satisfied? Contact us within 24 hours for a full refund.
        </div>
      </div>
    </div>
  );
} 
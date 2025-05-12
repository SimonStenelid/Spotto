import React from 'react';
import { PaymentButton } from '../components/payment/PaymentButton';
import { MapIcon, CheckIcon } from '@heroicons/react/24/outline';

const PricingPage: React.FC = () => {
  // Using the price ID from your Stripe product
  const priceId = 'price_1RNKIVIHzpxHykvkaP8F9ekS'; // 49 SEK price

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full">
              <MapIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Full Map Access
          </h1>
          <p className="text-xl text-gray-600">
            Discover all the hidden gems Stockholm has to offer
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                One-time Payment
              </h2>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">49 SEK</div>
                <div className="text-gray-500">Lifetime access</div>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {[
                'Full access to the interactive map',
                'Discover curated local spots',
                'Find hidden gems in Stockholm',
                'Save your favorite places',
                'Get detailed place information',
                'Access from any device',
              ].map((feature) => (
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
      </div>
    </div>
  );
};

export default PricingPage; 
import React, { useState } from 'react'
import { PaymentModal } from '../../../components/payment/PaymentModal'

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  onButtonClick?: () => void;
}

function PricingTier({ name, price, description, features, isPopular, buttonText, onButtonClick }: PricingTierProps) {
  return (
    <div className={`relative rounded-3xl p-8 ${isPopular ? 'bg-[#0f0f0f] text-white' : 'bg-white border border-[#e5e5e5] text-black'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-[#5046e5] rounded-2xl px-6 py-2">
            <span className="text-white text-sm font-medium">MOST POPULAR</span>
          </div>
        </div>
      )}
      
      {/* Plan Header */}
      <div className="space-y-6">
        <h3 className={`text-2xl font-semibold ${isPopular ? 'text-white' : 'text-black'}`}>
          {name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline">
          <span className={`text-5xl font-bold ${isPopular ? 'text-white' : 'text-black'}`}>
            {price}
          </span>
          {price && (
            <span className={`ml-2 text-base ${isPopular ? 'text-white/80' : 'text-gray-600'}`}>
              /once
            </span>
          )}
        </div>

        {/* Description */}
        <p className={`text-base ${isPopular ? 'text-white' : 'text-gray-700'}`}>
          {description}
        </p>
      </div>

      {/* Features */}
      <div className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-5 h-5 flex items-center justify-center ${isPopular ? 'text-white' : 'text-black'}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={`text-base ${isPopular ? 'text-white' : 'text-gray-700'}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onButtonClick}
        className={`w-full mt-8 py-4 rounded-full font-semibold text-base transition-colors
          ${isPopular 
            ? 'bg-white text-black hover:bg-white/90' 
            : 'bg-[#0f0f0f] text-white hover:bg-black/90'
          }`}
      >
        {buttonText}
      </button>
    </div>
  );
}

export function PricingSection({ id }: { id?: string }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleGetStarted = () => {
    window.location.href = '/app'
  }

  const handleSubscribeNow = () => {
    setShowPaymentModal(true)
  }

  const handleLearnMore = () => {
    // Could open a contact form or redirect somewhere
    console.log('Learn more clicked')
  }

  return (
    <>
      <section id={id} className="w-full py-20 px-4 sm:px-6 lg:px-20 bg-white">
        <div className="max-w-[1240px] mx-auto">
          {/* Section Header */}
          <div className="max-w-[800px] mx-auto text-center space-y-6 mb-20">
            <span className="text-[#5046e5] font-medium text-base">PRICING</span>
            <h2 className="text-5xl font-bold text-black">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-700">
              Pay once for unlimited access—everything now and everything we add in the future.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PricingTier
              name="Preview"
              price="0 KR"
              description="Test our app, see our preview."
              features={[
                'Basic map features',
                'Limited location details',
                'Look around, see if you like it'
              ]}
              buttonText="Get Started"
              onButtonClick={handleGetStarted}
            />
            <PricingTier
              name="Full Access"
              price="89 KR"
              description="Unlock the full Stockholm experience."
              features={[
                'All features',
                'Ad-free experience',
                'Detailed location information',
                'Personalized recommendations',
                'Coming soon - Mobile App!'
              ]}
              isPopular
              buttonText="Subscribe Now"
              onButtonClick={handleSubscribeNow}
            />
            <PricingTier
              name="Coming Soon"
              price=""
              description="We're working on more ways to explore. Stay tuned for new passes and features."
              features={[
                'Expanding our locations',
                'Custom travel planning',
                'Any ideas for us? Feel free to share them'
              ]}
              buttonText="Learn More"
              onButtonClick={handleLearnMore}
            />
          </div>
        </div>
      </section>
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
} 
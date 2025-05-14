'use client';

import Image from 'next/image';

interface FeatureCardProps {
  iconSrc: string;
  title: string;
  description: string;
}

function FeatureCard({ iconSrc, title, description }: FeatureCardProps) {
  return (
    <div className="space-y-6">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
        <img 
          src={iconSrc}
          alt={title}
          className="w-8 h-8 object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-black">{title}</h3>
      <p className="text-base text-gray-700 leading-6">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-20 px-20">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="max-w-[800px] mx-auto text-center space-y-6 mb-20">
          <span className="text-indigo-600 font-medium text-base">FEATURES</span>
          <h2 className="text-5xl font-bold text-black">A new way to explore</h2>
          <p className="text-lg text-gray-700">
            Discover Stockholm's best places with our minimalist, intuitive map interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-10">
          <FeatureCard
            iconSrc="/icons/location.png"
            title="Real-time Location"
            description="See your position in real-time and discover places around you with precise accuracy."
          />
          <FeatureCard
            iconSrc="/icons/all-in-one.png"
            title="Everything in One Place"
            description="Find everything in one place—no more blogs, websites, or endless searching. Recommendations gathered by locals and our experts."
          />
          <FeatureCard
            iconSrc="/icons/info.png"
            title="Detailed Information"
            description="Access comprehensive details about each location, including reviews, hours, and insider tips."
          />
        </div>
      </div>
    </section>
  );
} 
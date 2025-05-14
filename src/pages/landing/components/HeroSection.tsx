import { useState } from 'react';
import { cn } from '@/lib/utils';
import mapPreview from '@/assets/images/map-preview.png';

interface HeroImageProps {
  src?: string;
  alt?: string;
}

function HeroImage({ src, alt = "Stockholm map preview" }: HeroImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-[500px] h-[500px] rounded-[300px] overflow-hidden bg-black">
      {src ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          className={cn(
            "w-full h-full object-cover",
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/50">
          <p className="text-sm">Add your map preview image here</p>
        </div>
      )}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-20">
      <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Hero Content */}
        <div className="w-full lg:w-[600px] text-center lg:text-left">
          {/* News Banner */}
          <div className="bg-gray-100 rounded-[20px] w-fit px-5 py-2.5 mb-8 mx-auto lg:mx-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium text-sm">Spotto launches in Stockholm</span>
              <a href="#" className="text-indigo-600 font-medium text-sm">• Read more</a>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] leading-tight lg:leading-[70px] font-extrabold text-black">
              Discover Stockholm like never before
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 leading-[30px]">
              Spotto helps you find the best places, hidden gems, and local favorites in Stockholm with our minimalist map experience.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
            <button className="px-10 py-4 rounded-full bg-black text-white font-semibold text-base hover:bg-black/90 transition-colors">
              Get Started
            </button>
            <button className="px-10 py-4 rounded-full border border-gray-200 text-black font-semibold text-base hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full lg:w-auto flex justify-center">
          <HeroImage src={mapPreview} alt="Stockholm interactive map preview" />
        </div>
      </div>
    </section>
  );
} 
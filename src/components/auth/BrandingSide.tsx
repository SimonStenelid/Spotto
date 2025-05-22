import React from 'react';
import { MapIllustration } from './MapIllustration';

interface BrandingSideProps {
  isNavMenuOpen?: boolean;
  className?: string;
}

export function BrandingSide({ isNavMenuOpen = false, className = '' }: BrandingSideProps) {
  return (
    <div 
      className={`relative w-full lg:w-1/2 bg-[#0f0f0f] min-h-[550px] lg:min-h-screen overflow-y-auto transition-all duration-300 ${
        isNavMenuOpen ? 'lg:pl-64' : ''
      } ${className}`}
    >
      <div className="h-full flex flex-col p-4 sm:p-6 lg:p-6 xl:p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4 lg:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-lg sm:text-xl font-bold text-[#0f0f0f]">S</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white">Spotto</span>
        </div>

        {/* Main content container with flex-grow */}
        <div className="flex-grow flex flex-col">
          {/* Top section */}
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white">
              Skip all the blogs, all in one place.
            </h2>
          </div>

          {/* Middle section - Map */}
          <div className="flex-1 min-h-0 mb-6 lg:mb-8">
            <div className="h-full bg-[#141414] rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="h-full max-h-[400px]">
                <MapIllustration />
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
              Discover Stockholm
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Explore the best places, hidden gems, and local favorites in Stockholm. Everything in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
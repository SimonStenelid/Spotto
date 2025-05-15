import { cn } from '@/lib/utils';

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

        {/* Hero Video */}
        <div className="w-full lg:w-auto flex justify-center relative z-10">
          <div className="relative w-[500px] h-[500px] rounded-[300px] overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/3d-spin-globe.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
} 
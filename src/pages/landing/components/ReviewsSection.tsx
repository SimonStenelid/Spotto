'use client';

import React from 'react';
import { imageLoader } from '@/lib/image-loader';

// Import images directly
import emma from '../../../public/images/reviews/emma.png';
import michael from '../../../public/images/reviews/michael.png';
import sofia from '../../../public/images/reviews/sofia.png';

interface ReviewCardProps {
  quote: string;
  name: string;
  role: string;
  image: any;
}

function ReviewCard({ quote, name, role, image }: ReviewCardProps) {
  return (
    <div className="bg-[#fafafa] p-8 rounded-3xl">
      <p className="text-lg text-[#333333] mb-8">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12">
          <img
            src={imageLoader({ src: image })}
            alt={`${name}'s profile picture`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="font-semibold text-black">{name}</h4>
          <p className="text-[#666666]">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const reviews: ReviewCardProps[] = [
    {
      quote: "Spotto has completely changed how I explore Stockholm. I've discovered so many hidden gems I never knew existed!",
      name: "Emma Andersson",
      role: "Local Guide",
      image: emma
    },
    {
      quote: "As a tourist, this app was invaluable. The minimalist design made it so easy to find interesting places around me.",
      name: "Michael Chen",
      role: "Tourist",
      image: michael
    },
    {
      quote: "I use Spotto daily to find new spots in the city. It's become an essential part of my Stockholm experience.",
      name: "Sofia Lindström",
      role: "Food Blogger",
      image: sofia
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-20 bg-[#fafafa]">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="max-w-[800px] mx-auto text-center space-y-6 mb-20">
          <span className="text-[#5046e5] font-medium text-base">TESTIMONIALS</span>
          <h2 className="text-5xl font-bold text-black">What people are saying</h2>
          <p className="text-lg text-[#333333]">
            Hear from our community of explorers and local experts about their Spotto experience.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
} 
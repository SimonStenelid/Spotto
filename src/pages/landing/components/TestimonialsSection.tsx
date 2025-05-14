'use client';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  image: string;
}

function TestimonialCard({ quote, author, role, image }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 space-y-8 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      {/* Quote */}
      <p className="text-lg text-[#333333] leading-relaxed">"{quote}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={`${author}'s profile picture`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-black">{author}</h4>
          <p className="text-[#666666]">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-20 bg-white">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="max-w-[800px] mx-auto text-center space-y-6 mb-20">
          <span className="text-[#5046e5] font-medium text-base">TESTIMONIALS</span>
          <h2 className="text-5xl font-bold text-black">What people are saying</h2>
          <p className="text-lg text-[#333333]">
            Hear from our community of explorers and local experts about their Spotto experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Spotto has completely changed how I explore Stockholm. I've discovered so many hidden gems I never knew existed!"
            author="Emma Andersson"
            role="Local Guide"
            image="/images/reviews/emma.png"
          />
          <TestimonialCard
            quote="As a tourist, this app was invaluable. The minimalist design made it so easy to find interesting places around me."
            author="Michael Chen"
            role="Tourist"
            image="/images/reviews/michael.png"
          />
          <TestimonialCard
            quote="I use Spotto daily to find new spots in the city. It's become an essential part of my Stockholm experience."
            author="Sofia Lindström"
            role="Food Blogger"
            image="/images/reviews/sofia.png"
          />
        </div>
      </div>
    </section>
  );
} 
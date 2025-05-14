interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  image: string;
}

function TestimonialCard({ quote, author, role, image }: TestimonialCardProps) {
  return (
    <div className="bg-gray-50 rounded-3xl p-8 space-y-8">
      {/* Quote */}
      <p className="text-lg text-gray-700 leading-relaxed">"{quote}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200">
          {/* Avatar image would go here */}
        </div>
        <div>
          <h4 className="font-semibold text-black">{author}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full py-20 px-20 bg-white">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="max-w-[800px] mx-auto text-center space-y-6 mb-20">
          <span className="text-indigo-600 font-medium text-base">TESTIMONIALS</span>
          <h2 className="text-5xl font-bold text-black">What our users say</h2>
          <p className="text-lg text-gray-700">
            Discover why people love using Spotto to explore Stockholm.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-3 gap-8">
          <TestimonialCard
            quote="Spotto has completely changed how I explore Stockholm. I've discovered so many hidden gems I never knew existed!"
            author="Emma Andersson"
            role="Local Guide"
            image="/testimonials/emma.jpg"
          />
          <TestimonialCard
            quote="As a tourist, this app was invaluable. The minimalist design made it so easy to find interesting places around me."
            author="Michael Chen"
            role="Tourist"
            image="/testimonials/michael.jpg"
          />
          <TestimonialCard
            quote="I use Spotto daily to find new spots in the city. It's become an essential part of my Stockholm experience."
            author="Sofia Lindström"
            role="Food Blogger"
            image="/testimonials/sofia.jpg"
          />
        </div>
      </div>
    </section>
  );
} 
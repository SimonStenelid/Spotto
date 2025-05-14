export function CTASection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-20 bg-white">
      <div className="max-w-[1240px] mx-auto">
        {/* CTA Content */}
        <div className="max-w-[800px] mx-auto text-center space-y-6">
          <h2 className="text-5xl font-bold text-black">
            Ready to explore Stockholm?
          </h2>
          <p className="text-lg text-gray-700">
            Join thousands of explorers discovering the best of Stockholm with Spotto.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button className="px-10 py-4 rounded-full bg-[#0f0f0f] text-white font-semibold text-base hover:bg-black/90 transition-colors">
              Sign Up Now
            </button>
            <button className="px-10 py-4 rounded-full border border-[#e5e5e5] text-black font-semibold text-base hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 
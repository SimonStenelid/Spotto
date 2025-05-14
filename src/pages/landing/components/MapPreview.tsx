export function MapPreview() {
  return (
    <section className="w-full py-20 px-20 bg-white">
      <div className="max-w-[1240px] mx-auto">
        <div className="w-full h-[540px] bg-black rounded-3xl relative overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-[#0f0f0f]" />

          {/* Map Markers */}
          <div className="absolute inset-0">
            {/* Current Location Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 rounded-full bg-white/10 animate-ping" />
              <div className="w-12 h-12 rounded-full bg-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="w-10 h-10 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-6 h-6 rounded-lg bg-black" />
              </div>
            </div>

            {/* Other Markers */}
            <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-2xl border border-white bg-[#1a1a1a]" />
            <div className="absolute bottom-1/3 left-1/3 w-8 h-8 rounded-2xl border border-white bg-[#1a1a1a]" />
            <div className="absolute top-1/4 left-1/2 w-8 h-8 rounded-2xl border border-white bg-[#1a1a1a]" />
          </div>

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-[#141414] px-6 py-6">
            <div className="w-9 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
            
            <div className="flex gap-6">
              <div className="w-20 h-20 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-medium">Gamla Stan</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white text-lg font-bold mb-2">Gamla Stan</h3>
                <p className="text-white/80 text-sm mb-2">Historic Old Town • 0.8 km away</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full" />
                  <span className="text-white text-sm font-medium">4.8</span>
                  <span className="text-white/60 text-sm">(2,543 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
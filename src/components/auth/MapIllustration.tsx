import mapImage from '@/assets/images/map-illustration.png';

interface MapIllustrationProps {
  className?: string;
}

export function MapIllustration({ className }: MapIllustrationProps) {
  return (
    <div 
      className={`
        flex flex-col justify-center items-center
        w-[592px] h-[400px]
        mx-auto
        ${className}
      `}
    >
      <div 
        className="
          w-full h-full 
          rounded-[24px] 
          overflow-hidden
          bg-[#141414]
        "
      >
        <img
          src={mapImage}
          alt="Map illustration"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </div>
  );
} 
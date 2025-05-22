"use client";

interface PreviewBannerProps {
  onUpgradeClick?: () => void;
}

export function PreviewBanner({ onUpgradeClick }: PreviewBannerProps) {
  return (
    <div 
      className="fixed top-4 left-4 z-[100] bg-zinc-800/80 backdrop-blur-md rounded-md border border-white/10 cursor-pointer hover:bg-zinc-800/90 transition-colors shadow-lg"
      onClick={onUpgradeClick}
      style={{ maxWidth: 'calc(100% - 2rem)' }}
    >
      <div className="px-3 py-1.5">
        <span className="text-xs text-white whitespace-nowrap">
          Preview user - upgrade for full access of Stockholm
        </span>
      </div>
    </div>
  )
} 
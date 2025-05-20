import React, { useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Phone,
  Globe,
  X
} from 'lucide-react';
import type { Place } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { addBookmark, removeBookmark } from '@/lib/supabase';
import { toast } from 'sonner';

// Add custom animation keyframes
const cardAnimationClass = `
  @keyframes card-entrance {
    0% {
      opacity: 0;
      transform: perspective(1000px) rotateX(10deg) scale(0.9) translateY(20px);
    }
    50% {
      opacity: 1;
      transform: perspective(1000px) rotateX(-5deg) scale(1.02) translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: perspective(1000px) rotateX(0) scale(1) translateY(0);
    }
  }

  .card-animate {
    animation: card-entrance 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    transform-origin: center bottom;
    backface-visibility: hidden;
  }
`;

interface PlaceDetailsSheetProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

function formatOpeningHours(weekdayText?: string[]) {
  if (!weekdayText?.length) return null;
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  
  const todayHours = weekdayText.find(text => text.startsWith(today));
  if (!todayHours) return null;
  
  const hours = todayHours.split(': ')[1];
  const isOpen = true; // This should be calculated based on current time
  const closingTime = hours.split(' - ')[1];
  
  return {
    isOpen,
    closingTime,
    hours: weekdayText
  };
}

export function PlaceDetailsSheet({ place, isOpen, onClose }: PlaceDetailsSheetProps) {
  const { user, updateUserBookmarks } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const openingHours = formatOpeningHours(place.opening_hours?.weekday_text);

  useEffect(() => {
    // Inject custom animation styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = cardAnimationClass;
    document.head.appendChild(styleSheet);

    if (user && place && user.bookmarks) {
      setIsBookmarked(user.bookmarks.includes(place.id));
    }

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [user, place]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error('Please log in to bookmark places');
      return;
    }

    setIsLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await removeBookmark(user.id, place.id);
        if (error) throw error;
        const newBookmarks = (user.bookmarks || []).filter(id => id !== place.id);
        updateUserBookmarks(newBookmarks);
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        const { error } = await addBookmark(user.id, place.id);
        if (error) throw error;
        const newBookmarks = [...(user.bookmarks || []), place.id];
        updateUserBookmarks(newBookmarks);
        setIsBookmarked(true);
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[100dvh] w-screen inset-0 p-6 bg-[#0f0f0f]/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300"
      >
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm fixed top-6 right-6 z-50 animate-in fade-in zoom-in duration-300"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-white" />
        </Button>

        <div className="w-full max-w-[1000px] mx-auto bg-white rounded-[24px] overflow-hidden max-h-[90dvh] card-animate">
          <ScrollArea className="h-[calc(90dvh-32px)]">
            <div className="pb-32">
              {/* Header */}
              <div className="px-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <Badge 
                  variant="secondary" 
                  className="bg-[#f5f5f5] text-[#333333] mb-1 px-4 py-2 rounded-2xl text-sm font-medium"
                >
                  {place.category?.replace(/_/g, ' ')}
                </Badge>
                <h2 className="text-[32px] font-bold text-black leading-[38px] mb-3">{place.name}</h2>
              </div>

              {/* Content Grid */}
              <div className="px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    {/* Hours Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-white to-[#f9f9f9] border border-[#f0f0f0]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-[#0f0f0f]">Opening Hours</h3>
                        <div className="h-8 w-8 rounded-2xl bg-[#f5f5f5] flex items-center justify-center">
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                      
                      {openingHours && (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-2 w-2 rounded-full bg-[#4caf50]" />
                            <span className="text-sm font-medium text-[#4caf50]">Open Now</span>
                            <span className="text-sm text-[#666666]">• Closes at {openingHours.closingTime}</span>
                          </div>
                          <div className="space-y-1">
                            {openingHours.hours.map((day, index) => {
                              const [dayName, hours] = day.split(': ');
                              return (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-[#666666] w-20">{dayName}</span>
                                  <span className="text-[#333333]">{hours}</span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Rating Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-white to-[#f9f9f9] border border-[#f0f0f0]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-[#0f0f0f]">Ratings & Reviews</h3>
                        <div className="h-8 w-8 rounded-2xl bg-[#f5f5f5] flex items-center justify-center">
                          <Star className="h-4 w-4" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[32px] font-bold text-[#0f0f0f]">{place.rating?.toFixed(1)}</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(place.rating || 0) 
                                  ? "text-yellow-400 fill-yellow-400" 
                                  : "text-gray-300 fill-gray-300"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {place.reviews?.length > 0 && (
                        <p className="text-sm text-[#666666]">
                          Based on {place.reviews.length} reviews
                        </p>
                      )}
                    </div>

                    {/* Tips Card */}
                    {place.reviews && place.reviews.length > 0 && (
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-white to-[#f9f9f9] border border-[#f0f0f0]">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-[#0f0f0f]">Local Tips</h3>
                          <div className="h-8 w-8 rounded-2xl bg-[#f5f5f5] flex items-center justify-center">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                        </div>

                        <div className="space-y-6">
                          {place.reviews.slice(0, 2).map((review, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="h-10 w-10 rounded-[20px] bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                                <span className="text-base font-medium text-[#333333]">
                                  {review.userName?.slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-[#0f0f0f] mb-1">
                                  {review.userName}
                                </h4>
                                <p className="text-sm leading-[21px] text-[#333333]">
                                  {review.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    {/* Description/About Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-white to-[#f9f9f9] border border-[#f0f0f0]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-[#0f0f0f]">About</h3>
                        <div className="h-8 w-8 rounded-2xl bg-[#f5f5f5] flex items-center justify-center">
                          <Globe className="h-4 w-4" />
                        </div>
                      </div>
                      
                      <p className="text-[15px] leading-6 text-[#333333] mb-6">
                        {place.ai_summary || place.description || 'No description available.'}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {place.types?.map((type) => (
                          <Badge 
                            key={type}
                            variant="secondary" 
                            className="bg-[#f5f5f5] text-[#333333] px-3 py-1.5 rounded-2xl text-xs"
                          >
                            {type.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="absolute bottom-8 right-8 flex gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <Button
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-3xl bg-[#f5f5f5] hover:bg-[#f0f0f0]"
              onClick={handleBookmarkToggle}
              disabled={isLoading}
            >
              <Bookmark 
                className={cn(
                  "h-5 w-5",
                  isBookmarked && "fill-current"
                )} 
              />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-3xl bg-[#f5f5f5] hover:bg-[#f0f0f0]"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 
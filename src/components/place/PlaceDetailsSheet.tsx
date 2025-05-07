import React, { useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  MapPin, 
  Store, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Phone,
  Globe,
  DollarSign,
  Camera,
  X,
  ChevronLeft
} from 'lucide-react';
import type { Place } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { addBookmark, removeBookmark } from '@/lib/supabase';
import { toast } from 'sonner';

interface PlaceDetailsSheetProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

export function PlaceDetailsSheet({ place, isOpen, onClose }: PlaceDetailsSheetProps) {
  const { user, updateUserBookmarks } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Check if place is bookmarked on mount and when user changes
  useEffect(() => {
    if (user && place) {
      setIsBookmarked(user.bookmarks.includes(place.id));
    }
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
        const newBookmarks = user.bookmarks.filter(id => id !== place.id);
        updateUserBookmarks(newBookmarks);
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        const { error } = await addBookmark(user.id, place.id);
        if (error) throw error;
        const newBookmarks = [...user.bookmarks, place.id];
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

  // Calculate stats
  const likesCount = place.reactions 
    ? Object.values(place.reactions).reduce((a, b) => a + b, 0)
    : 0;
  const reviewsCount = place.reviews?.length || 0;

  // Format price level
  const priceLevel = place.price_level 
    ? Array(place.price_level).fill('$').join('')
    : '$$';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] p-0 rounded-t-xl"
      >
        {/* Header with image carousel */}
        <div className="relative h-64 w-full">
          <img
            src={place.images?.[currentImageIndex] || '/placeholder-image.jpg'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation overlay */}
          {place.images?.length > 1 && (
            <div className="absolute inset-0 flex justify-between items-center px-4">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
                onClick={() => setCurrentImageIndex(i => (i - 1 + place.images.length) % place.images.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
                onClick={() => setCurrentImageIndex(i => (i + 1) % place.images.length)}
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          )}
          
          {/* Image counter */}
          {place.images?.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{place.images.length}
            </div>
          )}
          
          {/* Close button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(90vh-16rem)] px-6">
          {/* Title and actions */}
          <div className="flex justify-between items-start py-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {typeof place.rating === 'number' && (
                  <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                    <Star size={14} className="mr-1 fill-yellow-500" />
                    {place.rating.toFixed(1)}
                  </Badge>
                )}
                <span className="text-sm text-gray-500">•</span>
                <Badge variant="outline" className="text-gray-700">
                  {priceLevel}
                </Badge>
                <span className="text-sm text-gray-500">•</span>
                <Badge variant="outline" className="capitalize text-gray-700">
                  {place.category?.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="icon" variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline"
                onClick={handleBookmarkToggle}
                disabled={isLoading}
              >
                <Bookmark 
                  className={cn(
                    "h-4 w-4",
                    isBookmarked && "fill-current",
                    isLoading && "animate-pulse"
                  )} 
                />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 py-4">
            <div className="flex items-center gap-1">
              <Heart size={16} className="text-pink-500" />
              <span className="text-sm text-gray-600">{likesCount} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={16} className="text-purple-500" />
              <span className="text-sm text-gray-600">{reviewsCount} reviews</span>
            </div>
          </div>

          <Separator />

          {/* Key information */}
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Location</h3>
                <p className="text-gray-600">{place.formatted_address}</p>
              </div>
            </div>

            {place.opening_hours?.weekday_text && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Opening Hours</h3>
                  <div className="space-y-1 mt-1">
                    {place.opening_hours.weekday_text.map((hours, index) => (
                      <p key={index} className="text-sm text-gray-600">{hours}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {place.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <a href={`tel:${place.phone}`} className="text-gray-600 hover:text-gray-900">
                    {place.phone}
                  </a>
                </div>
              </div>
            )}

            {place.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Website</h3>
                  <a 
                    href={place.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 break-all"
                  >
                    {place.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* AI Summary */}
          {place.ai_summary && (
            <>
              <div className="py-4">
                <h3 className="font-medium text-gray-900 mb-2">TL;DR</h3>
                <p className="text-gray-600 whitespace-pre-line">{place.ai_summary}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Description */}
          {place.description && (
            <>
              <div className="py-4">
                <h3 className="font-medium text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 whitespace-pre-line">{place.description}</p>
              </div>
              <Separator />
            </>
          )}

          {/* Reviews */}
          <div className="py-4">
            <h3 className="font-medium text-gray-900 mb-4">Reviews</h3>
            {place.reviews?.length > 0 ? (
              <div className="space-y-4">
                {place.reviews.map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {review.userAvatar ? (
                          <img 
                            src={review.userAvatar} 
                            alt={review.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {review.userName[0] || '?'}
                          </div>
                        )}
                        <span className="font-medium">{review.userName}</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600 text-sm">{review.text}</p>
                      <span className="text-gray-400 text-xs">•</span>
                      <time className="text-gray-400 text-xs" dateTime={review.createdAt}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
            )}
          </div>
        </ScrollArea>

        {/* Bottom action bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleBookmarkToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating...
              </span>
            ) : isBookmarked ? (
              'Remove from bookmarks'
            ) : (
              'Save this place'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 
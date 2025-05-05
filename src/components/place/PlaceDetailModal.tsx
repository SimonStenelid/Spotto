import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Store, Star, Heart, MessageCircle, Share2, Bookmark, X } from 'lucide-react';
import type { Place } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { addBookmark, removeBookmark } from '@/lib/supabase';

interface PlaceDetailModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

export function PlaceDetailModal({ place, isOpen, onClose }: PlaceDetailModalProps) {
  const { user } = useAuthStore();
  const isBookmarked = user?.bookmarks.includes(place.id) || false;
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleBookmarkToggle = async () => {
    if (!user) return;
    
    try {
      if (isBookmarked) {
        await removeBookmark(user.id, place.id);
      } else {
        await addBookmark(user.id, place.id);
      }
      
      // Update the user's bookmarks in the store
      const updatedBookmarks = isBookmarked
        ? user.bookmarks.filter(id => id !== place.id)
        : [...user.bookmarks, place.id];
      
      useAuthStore.setState(state => ({
        user: state.user ? {
          ...state.user,
          bookmarks: updatedBookmarks
        } : null
      }));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Handle image carousel
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === place.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? place.images.length - 1 : prev - 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image carousel */}
        <div className="relative h-72 w-full">
          <img
            src={place.images[currentImageIndex]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation overlay */}
          <div className="absolute inset-0 flex justify-between items-center px-4">
            <button
              onClick={prevImage}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              &gt;
            </button>
          </div>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1}/{place.images.length}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{place.name}</h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleBookmarkToggle}
                size="icon"
                variant="ghost"
                className="h-10 w-10"
              >
                <Bookmark
                  size={20}
                  className={isBookmarked ? "fill-pink-500 text-pink-500" : "text-gray-600"}
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10"
              >
                <Share2 size={20} className="text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Rating & Reactions */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <Star size={18} className="text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-medium">{place.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Heart size={18} className="text-pink-500 mr-1" />
              <span className="font-medium">
                {Object.values(place.reactions).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            <div className="flex items-center">
              <MessageCircle size={18} className="text-purple-500 mr-1" />
              <span className="font-medium">{place.reviews.length}</span>
            </div>
          </div>

          {/* Mood tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {place.moods.map((mood) => (
              <Badge
                key={mood}
                variant="secondary"
                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                {mood}
              </Badge>
            ))}
          </div>

          {/* AI Summary */}
          {place.ai_summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">TL;DR</h3>
              <p className="text-gray-700 leading-relaxed">{place.ai_summary}</p>
            </div>
          )}

          {/* Full description */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">About this spot</h3>
            <p className="text-gray-700">{place.description}</p>
          </div>

          {/* Address & Hours */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-2">
              <MapPin size={18} className="mt-1 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800">Address</h3>
                <p className="text-gray-600">{place.formatted_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock size={18} className="mt-1 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800">Hours</h3>
                <p className="text-gray-600">
                  {place.opening_hours?.weekday_text?.[0] || 'Hours not available'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Store size={18} className="mt-1 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800">Category</h3>
                <p className="text-gray-600 capitalize">
                  {place.category?.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Reviews</h3>
              <Button variant="link" className="text-purple-600 p-0 h-auto">
                See all
              </Button>
            </div>

            {place.reviews.length > 0 ? (
              <div className="space-y-4">
                {place.reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                        {review.userAvatar && (
                          <img 
                            src={review.userAvatar} 
                            alt={review.userName}
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{review.userName}</div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No reviews yet. Be the first to share your experience!
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Bottom action button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleBookmarkToggle}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Bookmark size={18} className={`mr-2 ${isBookmarked ? "fill-white" : ""}`} />
            {isBookmarked ? "Saved to your collection" : "Save this place"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
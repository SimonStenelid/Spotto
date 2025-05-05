import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Star } from 'lucide-react';
import { Place } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { addBookmark, removeBookmark } from '../../lib/supabase';

interface PlaceCardProps {
  place: Place;
  variant?: 'preview' | 'full';
  onClose?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ 
  place, 
  variant = 'preview', 
  onClose 
}) => {
  const { user } = useAuthStore();
  const isBookmarked = user?.bookmarks?.includes(place.id) || false;

  // Safely calculate total reactions
  const totalReactions = place.reactions
    ? Object.values(place.reactions).reduce((a, b) => a + b, 0)
    : 0;

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
  
  if (variant === 'preview') {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <img 
            src={place.images?.[0] || '/placeholder-image.jpg'} 
            alt={place.name || 'Place image'}
            className="w-full h-full object-cover" 
          />
          
          {/* Overlay with name */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <h2 className="text-white font-bold text-xl p-3">{place.name || 'Unnamed Place'}</h2>
          </div>
          
          {/* Bookmark button */}
          <button
            onClick={handleBookmarkToggle}
            className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-full transition-colors hover:bg-white/40"
          >
            <Bookmark 
              size={18} 
              className={isBookmarked ? "fill-pink-500 text-pink-500" : "text-white"} 
            />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-3">
          {/* Mood tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {place.moods?.slice(0, 2).map((mood) => (
              <span 
                key={mood} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
              >
                {mood}
              </span>
            ))}
            {(place.moods?.length || 0) > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                +{place.moods.length - 2} more
              </span>
            )}
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center justify-between mb-2">
            {typeof place.rating === 'number' && (
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Heart size={16} className="text-pink-500" />
              <span className="text-sm font-medium">{totalReactions}</span>
            </div>
          </div>
          
          {/* Description */}
          {place.ai_summary && (
            <div className="mb-2">
              <p className="text-sm text-gray-600 line-clamp-2">
                <span className="font-medium text-purple-600">TL;DR:</span> {place.ai_summary}
              </p>
            </div>
          )}
          {place.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {place.description}
            </p>
          )}
          {!place.description && !place.ai_summary && (
            <p className="text-sm text-gray-500 italic">No description available</p>
          )}
          
          {/* View full button */}
          <Link
            to={`/place/${place.id}`}
            className="mt-3 inline-block w-full text-center py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            View Full Details
          </Link>
        </div>
      </motion.div>
    );
  }
  
  // Full variant (used in place detail page)
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
      <div className="p-4">
        <h2 className="text-xl font-bold">{place.name || 'Unnamed Place'}</h2>
        <p className="text-gray-600 mt-2">{place.description || place.ai_summary || 'No description available'}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
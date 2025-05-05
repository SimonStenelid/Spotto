import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, ArrowLeft, Star, MessageCircle, Share2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { getPlaceById, addBookmark, removeBookmark } from '../../lib/supabase';
import { Place } from '../../types';

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Check if place is bookmarked
  const isBookmarked = user?.bookmarks.includes(id || '') || false;
  
  React.useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await getPlaceById(id);
        if (error) throw error;
        
        setPlace(data as Place);
      } catch (error) {
        console.error('Error fetching place:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlace();
  }, [id]);
  
  const handleBookmarkToggle = async () => {
    if (!user || !id) return;
    
    try {
      if (isBookmarked) {
        await removeBookmark(user.id, id);
      } else {
        await addBookmark(user.id, id);
      }
      
      // Update the user's bookmarks in the store
      const updatedBookmarks = isBookmarked
        ? user.bookmarks.filter(bookmarkId => bookmarkId !== id)
        : [...user.bookmarks, id];
      
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
    if (!place) return;
    setCurrentImageIndex((prev) => 
      prev === place.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    if (!place) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? place.images.length - 1 : prev - 1
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (!place) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-4">
        <h2 className="text-xl font-bold mb-2">Oops! Place not found</h2>
        <p className="text-gray-600 mb-4">This spot doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-purple-500 text-white rounded-full"
        >
          Back to Explore
        </button>
      </div>
    );
  }
  
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
          >
            &lt;
          </button>
          <button
            onClick={nextImage}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
          >
            &gt;
          </button>
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{place.images.length}
        </div>
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold">{place.name}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookmarkToggle}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100"
            >
              <Bookmark
                size={20}
                className={isBookmarked ? "fill-pink-500 text-pink-500" : "text-gray-600"}
              />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
              <Share2 size={20} className="text-gray-600" />
            </button>
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
        <div className="flex flex-wrap gap-2 mb-4">
          {place.moods.map((mood) => (
            <span
              key={mood}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
            >
              {mood}
            </span>
          ))}
        </div>
        
        {/* AI Summary */}
        {place.ai_summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">TL;DR</h3>
            <p className="text-gray-700 leading-relaxed">{place.ai_summary}</p>
          </div>
        )}
        
        {/* TL;DR section */}
        <div className="mb-6 bg-pink-50 p-3 rounded-lg">
          <h3 className="font-bold text-pink-600 mb-1">TL;DR</h3>
          <p className="text-gray-800">{place.tldr}</p>
        </div>
        
        {/* Full description */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2">About this spot</h3>
          <p className="text-gray-700">{place.description}</p>
        </div>
        
        {/* Address & Hours */}
        {place.address && (
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-1">Address</h3>
            <p className="text-gray-700">{place.address}</p>
          </div>
        )}
        
        {place.hours && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-1">Hours</h3>
            <p className="text-gray-700">{place.hours}</p>
          </div>
        )}
        
        {/* Reviews section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Reviews</h3>
            <button className="text-sm text-purple-600 font-medium">See all</button>
          </div>
          
          {place.reviews.length > 0 ? (
            <div className="space-y-4">
              {place.reviews.slice(0, 2).map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-3">
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
            <p className="text-sm text-gray-500">No reviews yet. Be the first to share your experience!</p>
          )}
        </div>
      </div>
      
      {/* Bottom action button */}
      <div className="sticky bottom-0 w-full p-4 bg-white border-t border-gray-100 shadow-md">
        <button
          onClick={handleBookmarkToggle}
          className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium transition-colors flex items-center justify-center"
        >
          <Bookmark size={18} className={`mr-2 ${isBookmarked ? "fill-white" : ""}`} />
          {isBookmarked ? "Saved to your collection" : "Save this place"}
        </button>
      </div>
    </motion.div>
  );
};

export default PlaceDetail;
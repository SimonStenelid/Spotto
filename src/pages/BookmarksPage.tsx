import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Map } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getBookmarkedPlaces } from '../lib/supabase';
import { Place } from '../types';
import { PlaceListItem } from '../components/place/PlaceListItem';

const BookmarksPage: React.FC = () => {
  const { user } = useAuthStore();
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await getBookmarkedPlaces(user.id);
        if (error) throw error;
        
        setBookmarkedPlaces(data as Place[]);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [user]);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-xl font-bold mb-4">You need to log in to view bookmarks</h2>
        <Link
          to="/login"
          className="px-6 py-2 bg-purple-500 text-white rounded-full"
        >
          Log in
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center z-10">
        <Link to="/profile" className="mr-4">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold">Your Saved Spots</h1>
      </header>
      
      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : bookmarkedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {bookmarkedPlaces.map((place) => (
              <PlaceListItem key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center mt-8">
            <Map size={48} className="mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No saved spots yet</h3>
            <p className="text-gray-600 mb-6">
              Explore the map and save places you'd like to visit by tapping the bookmark icon.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-purple-500 text-white rounded-full font-medium"
            >
              Explore Map
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
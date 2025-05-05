import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, Map, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { getBookmarkedPlaces } from '../../lib/supabase';
import { Place } from '../../types';
import PlaceCard from '../place/PlaceCard';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuthStore();
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
        <h2 className="text-xl font-bold mb-4">You're not logged in</h2>
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
    <motion.div
      className="pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Profile header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {/* Navigate to settings */}}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => signOut()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-white mr-4 overflow-hidden">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-300 text-purple-700 text-xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-white/80">{user.email}</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex mt-6 bg-white/10 rounded-lg p-3">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold">{bookmarkedPlaces.length}</p>
            <p className="text-xs text-white/80">Saved spots</p>
          </div>
          <div className="flex-1 text-center border-l border-white/20">
            <p className="text-lg font-bold">0</p>
            <p className="text-xs text-white/80">Visited spots</p>
          </div>
        </div>
      </div>
      
      {/* Bookmarked places */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Your saved spots</h3>
          <Link to="/bookmarks" className="text-sm text-purple-600 font-medium">
            See all
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : bookmarkedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {bookmarkedPlaces.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Map size={40} className="mx-auto mb-2 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">No saved spots yet</h3>
            <p className="text-gray-600 mb-4">Start exploring and save places you want to visit!</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-purple-500 text-white rounded-full font-medium"
            >
              Explore Map
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
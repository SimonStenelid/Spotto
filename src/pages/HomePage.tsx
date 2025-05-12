import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { RestrictedMap } from '../components/map/RestrictedMap';
import { useMapStore } from '../store/useMapStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '@/lib/utils';
import { SearchField } from '../components/ui/SearchField';

const HomePage: React.FC = () => {
  const { 
    fetchPlaces, 
    selectedPlace, 
    selectPlace, 
    isLoading 
  } = useMapStore();
  
  const { user, authState } = useAuthStore();
  
  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Map Container */}
      <div className="w-full h-full transition-all duration-300">
        <RestrictedMap />
      </div>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      {/* Top search bar */}
      <div className="absolute top-4 left-0 right-0 px-4 z-50">
        <div className="relative max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <SearchField className="w-full" />
          </div>
          
          {authState === 'SIGNED_IN' && user && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 overflow-hidden shadow-md">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-300 text-purple-700 text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* "No places found" message */}
      {!isLoading && !selectedPlace && (
        <div className="absolute bottom-8 inset-x-0 flex justify-center">
          <motion.div
            className="bg-white px-4 py-3 rounded-full shadow-lg flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin size={18} className="text-pink-500 mr-2" />
            <span className="text-sm font-medium">Tap markers to view details</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
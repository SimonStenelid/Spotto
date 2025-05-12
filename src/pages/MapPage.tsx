import React from 'react';
import { RestrictedMap } from '../components/map/RestrictedMap';
import { SearchField } from '../components/ui/SearchField';

const MapPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Map Container */}
      <div className="w-full h-full transition-all duration-300">
        <RestrictedMap />
      </div>
      
      {/* Top search bar */}
      <div className="absolute top-4 left-0 right-0 px-4 z-50">
        <div className="relative max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <SearchField className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage; 
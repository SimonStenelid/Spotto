import React, { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Place } from '../../types';
import { PlaceDetailsSheet } from './PlaceDetailsSheet';

interface PlaceListItemProps {
  place: Place;
}

export function PlaceListItem({ place }: PlaceListItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin size={14} />
              <span className="truncate">{place.formatted_address}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {typeof place.rating === 'number' && (
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                  <Star size={12} className="mr-1 fill-yellow-500" />
                  {place.rating.toFixed(1)}
                </Badge>
              )}
              {place.types?.slice(0, 2).map((type) => (
                <Badge 
                  key={type}
                  variant="outline" 
                  className="bg-gray-50 text-gray-700"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          {place.images?.[0] && (
            <div className="w-20 h-20 flex-shrink-0">
              <img 
                src={place.images[0]} 
                alt={place.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <PlaceDetailsSheet
        place={place}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
} 
import React from 'react';
import { MapPin, ChevronRight, Star, Clock } from 'lucide-react';
import type { Place } from '../../types/index';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface PlacePopupProps {
  place: Place;
  onViewDetails: () => void;
}

function getTodayOpeningHours(weekdayText?: string[]): string | null {
  if (!weekdayText?.length) return null;
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  
  const todayHours = weekdayText.find(text => text.startsWith(today));
  if (!todayHours) return null;
  
  return todayHours.split(': ')[1];
}

export const PlacePopup: React.FC<PlacePopupProps> = ({ place, onViewDetails }) => {
  const todayHours = getTodayOpeningHours(place.opening_hours?.weekday_text);

  return (
    <div className="bg-white rounded-lg overflow-hidden w-[280px] shadow-lg">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-0.5 flex-1 min-w-0 line-clamp-2">
            {place.name || 'Unnamed Place'}
          </h3>
          {typeof place.rating === 'number' && (
            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 flex items-center gap-1 shrink-0">
              <Star size={12} className="fill-yellow-500" />
              {place.rating.toFixed(1)}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {place.types?.slice(0, 2).map((type) => (
            <Badge 
              key={type}
              variant="outline" 
              className="bg-gray-50 text-gray-700 border-gray-200"
            >
              {type}
            </Badge>
          ))}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="flex-shrink-0" />
            <span className="line-clamp-2">{place.formatted_address || 'Address not available'}</span>
          </div>
          
          {todayHours && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} className="flex-shrink-0" />
              <span>{todayHours}</span>
            </div>
          )}
        </div>

        <Button
          onClick={onViewDetails}
          className="w-full bg-black hover:bg-gray-800 text-white mt-2"
        >
          View details
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}; 
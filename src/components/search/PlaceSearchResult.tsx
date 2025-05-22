import React from 'react';
import { Place } from '@/types';
import { MapPin, Star, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PlaceSearchResultProps {
  place: Place;
  onViewDetails: () => void;
}

export function PlaceSearchResult({ place, onViewDetails }: PlaceSearchResultProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
      <Store className="h-5 w-5 mt-1 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{place.name}</h3>
          {place.rating && (
            <span className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 fill-yellow-500 mr-0.5" />
              {place.rating.toFixed(1)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{place.formatted_address}</span>
        </div>

        {place.types && place.types.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {place.types.slice(0, 3).map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="text-[10px] py-0 px-1.5 bg-gray-50 text-gray-700 border-gray-200"
              >
                {type}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </div>
    </div>
  );
} 
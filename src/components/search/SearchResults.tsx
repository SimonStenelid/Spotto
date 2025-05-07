import React from 'react';
import { Place } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceSearchResult } from '@/components/search/PlaceSearchResult';

interface SearchResultsProps {
  results: Place[];
  onSelectPlace: (place: Place) => void;
  onClose: () => void;
}

export function SearchResults({ results, onSelectPlace, onClose }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No places found
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4 p-4">
        {results.map((place) => (
          <div key={place.id}>
            <PlaceSearchResult
              place={place}
              onViewDetails={() => {
                onSelectPlace(place);
                onClose();
              }}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 
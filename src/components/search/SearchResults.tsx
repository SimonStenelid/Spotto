import React from 'react';
import { MapPin, Store } from 'lucide-react';
import { Place } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <ScrollArea className="h-[300px]">
      <div className="space-y-1 p-1">
        {results.map((place) => (
          <Button
            key={place.id}
            variant="ghost"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => {
              onSelectPlace(place);
              onClose();
            }}
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-start gap-2">
                <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{place.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground truncate">
                      {place.formatted_address}
                    </p>
                  </div>
                </div>
              </div>
              {place.types && place.types.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {place.types.slice(0, 3).map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="text-xs py-0 px-1.5"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
} 
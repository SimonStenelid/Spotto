import * as React from "react"
import { SearchIcon, X, Store, MapPin, Star } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { searchPlaces } from "@/app/actions/place"
import { Place } from "@/types"
import { useMapStore } from "@/store/useMapStore"
import { Badge } from "@/components/ui/badge"
import { FilterButton } from "@/components/ui/FilterButton"
import mapboxgl from 'mapbox-gl'

import { cn } from "@/lib/utils"
import {
  SearchField as BaseSearchField,
  SearchFieldInput,
  SearchFieldClear,
} from "@/components/ui/searchfield-base"

// Extend Window interface
declare global {
  interface Window {
    mapInstance: mapboxgl.Map;
    popupsRef: React.MutableRefObject<{ [key: string]: mapboxgl.Popup }>;
  }
}

interface CustomSearchFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const SearchField = ({ className, ...props }: CustomSearchFieldProps) => {
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [places, setPlaces] = React.useState<Place[]>([])
  const [isFocused, setIsFocused] = React.useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const { selectPlace } = useMapStore()

  // Common place types for suggestions
  const commonPlaceTypes = [
    "restaurant",
    "bar",
    "cafe",
    "museum",
    "park",
    "shopping",
    "nightlife",
  ]

  // Filter suggestions based on input
  const filteredSuggestions = React.useMemo(() => {
    if (!query) return commonPlaceTypes
    return commonPlaceTypes.filter(type => 
      type.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  React.useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setPlaces([])
        return
      }

      setIsLoading(true)
      try {
        const { results, error } = await searchPlaces(debouncedQuery)
        if (error) throw error
        setPlaces(results || [])
      } catch (error) {
        console.error('Error searching places:', error)
        setPlaces([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  const handleSelect = React.useCallback((place: Place) => {
    if (!place.location) return;
    
    const map = window.mapInstance;
    if (!map) return;

    // Update store state first - this will trigger the map's selectedPlaceId effect
    selectPlace(place.id);
    
    // Fly to location
    map.flyTo({
      center: [place.location.lng, place.location.lat],
      zoom: 16,
      duration: 1500,
      essential: true,
      pitch: 45
    });

    // Clear search state
    setQuery("");
    setIsFocused(false);
  }, [selectPlace]);

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="py-6 text-center text-sm">
          Searching...
        </div>
      )
    }

    if (places.length === 0) {
      // If no places found but query matches one of the suggestions
      if (filteredSuggestions.length > 0 && query.length > 0) {
        return (
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              Suggested categories
            </div>
            <div className="space-y-1">
              {filteredSuggestions.map((type) => (
                <button
                  key={type}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => {
                    setQuery(type)
                  }}
                >
                  <SearchIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>
        )
      }

      return (
        <div className="py-6 text-center text-sm">
          No places found.
        </div>
      )
    }

    return (
      <div className="p-2">
        <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
          Places
        </div>
        <div className="space-y-1">
          {places.map((place) => (
            <button
              key={place.id}
              className="flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-accent group"
              onClick={() => handleSelect(place)}
            >
              <Store className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium truncate">{place.name}</span>
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
                  <div className="flex flex-wrap gap-1 mt-1.5">
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
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <div className="flex items-center gap-2">
        <BaseSearchField className="flex-1">
          <div className="flex w-full items-center rounded-md border bg-background px-3 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <SearchFieldInput 
              placeholder="Search places or types (e.g. bar, restaurant)..." 
              className="h-10 flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
            {query && (
              <SearchFieldClear 
                onClick={() => setQuery("")}
                className="h-4 w-4 opacity-50"
              >
                <X className="h-4 w-4" />
              </SearchFieldClear>
            )}
          </div>
        </BaseSearchField>
        
        <FilterButton />
      </div>

      {(isFocused && (query.length > 0 || isLoading || filteredSuggestions.length > 0)) && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[40] max-h-[400px] overflow-y-auto rounded-md border bg-background shadow-lg">
          {renderResults()}
        </div>
      )}
    </div>
  )
}

export { SearchField }

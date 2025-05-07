import { Place, MapSettings } from './index';
import { PlaceCategory } from '@/store/useMapStore';

export interface Location {
  longitude: number;
  latitude: number;
}

export interface MapState {
  mapSettings: MapSettings;
  places: Place[];
  filteredPlaces: Place[];
  selectedPlaceId: string | null;
  selectedPlace: Place | null;
  selectedCategories: PlaceCategory[];
  isLoading: boolean;
  error: string | null;
  selectPlace: (id: string | null) => void;
  setMapSettings: (settings: Partial<MapSettings>) => void;
  setFilteredPlaces: (places: Place[]) => void;
  toggleCategory: (category: PlaceCategory) => void;
  clearCategories: () => void;
  fetchPlaces: () => Promise<void>;
}
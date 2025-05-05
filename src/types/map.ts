import { Place, Mood, MapSettings } from './index';

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
  selectedMoods: Mood[];
  isLoading: boolean;
  error: string | null;
  selectPlace: (id: string | null) => void;
  setMapSettings: (settings: Partial<MapSettings>) => void;
  setFilteredPlaces: (places: Place[]) => void;
  toggleMood: (mood: Mood) => void;
  clearMoods: () => void;
  fetchPlaces: () => Promise<void>;
} 
import { create } from 'zustand';
import type { Place, MapSettings } from '../types';
import { getPlaces, getPlaceById } from '../lib/supabase';

const DEFAULT_CENTER: [number, number] = [18.0773, 59.3168]; // Average location of all places
const DEFAULT_ZOOM = 13;

// Define available place categories
export const PLACE_CATEGORIES = ['cafe', 'restaurant', 'bar', 'cultural', 'activity', 'shopping'] as const;
export type PlaceCategory = typeof PLACE_CATEGORIES[number];

interface State {
  mapSettings: MapSettings;
  places: Place[];
  filteredPlaces: Place[];
  selectedPlaceId: string | null;
  selectedPlace: Place | null;
  selectedCategories: PlaceCategory[];
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  selectPlace: (id: string | null) => Promise<void>;
  setMapSettings: (settings: Partial<MapSettings>) => void;
  setFilteredPlaces: (places: Place[]) => void;
  toggleCategory: (category: PlaceCategory) => void;
  clearCategories: () => void;
  fetchPlaces: () => Promise<void>;
  flyToPlace: (place: Place) => void;
}

type Store = State & Actions;

export const useMapStore = create<Store>((set, get) => ({
  mapSettings: {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  },
  places: [],
  filteredPlaces: [],
  selectedPlaceId: null,
  selectedPlace: null,
  selectedCategories: [],
  isLoading: false,
  error: null,
  
  selectPlace: async (id: string | null) => {
    if (!id) {
      set({ selectedPlaceId: null, selectedPlace: null });
      return;
    }
    
    try {
      const { data: place, error } = await getPlaceById(id);
      if (error) throw error;
      
      set({ 
        selectedPlaceId: id,
        selectedPlace: place,
      });

      // Fly to the place if it has a location
      if (place?.location) {
        get().flyToPlace(place);
      }
    } catch (error) {
      console.error('Error fetching place:', error);
      set({ error: (error as Error).message });
    }
  },
  
  flyToPlace: (place: Place) => {
    if (!place.location) return;
    
    const map = (window as any).mapInstance;
    if (!map) return;

    map.flyTo({
      center: [place.location.lng, place.location.lat],
      zoom: 16,
      duration: 1500,
      essential: true
    });
  },
  
  setMapSettings: (settings: Partial<MapSettings>) => set((state: State) => ({
    mapSettings: {
      ...state.mapSettings,
      ...settings,
    },
  })),
  
  setFilteredPlaces: (places: Place[]) => set({ 
    places,
    filteredPlaces: places 
  }),
  
  toggleCategory: (category: PlaceCategory) => {
    set((state: State) => {
      const isSelected = state.selectedCategories.includes(category);
      const newSelectedCategories = isSelected
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category];
      
      // Filter places based on selected categories
      const newFilteredPlaces = newSelectedCategories.length === 0
        ? state.places
        : state.places.filter((place: Place) => 
            newSelectedCategories.includes(place.category as PlaceCategory)
          );
      
      return {
        selectedCategories: newSelectedCategories,
        filteredPlaces: newFilteredPlaces,
      };
    });
  },
  
  clearCategories: () => {
    set((state: State) => ({
      selectedCategories: [],
      filteredPlaces: state.places,
    }));
  },
  
  fetchPlaces: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await getPlaces();
      if (error) throw error;
      
      set({ 
        places: data || [], 
        filteredPlaces: data || [],
        isLoading: false 
      });
      
      // Apply any existing category filters
      const { selectedCategories } = get();
      if (selectedCategories.length > 0) {
        get().toggleCategory(selectedCategories[0]); // Re-filter
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      set({
        error: (error as Error).message,
        isLoading: false,
      });
    }
  },
}));
import { create } from 'zustand';
import { MapState, MapSettings, Place, Mood } from '../types/map';
import { getPlaces, getPlaceById } from '../lib/supabase';

const DEFAULT_CENTER: [number, number] = [18.0773, 59.3168]; // Average location of all places
const DEFAULT_ZOOM = 13;

export const useMapStore = create<MapState>((set, get) => ({
  mapSettings: {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  },
  places: [],
  filteredPlaces: [],
  selectedPlaceId: null,
  selectedPlace: null,
  selectedMoods: [],
  isLoading: false,
  error: null,
  
  selectPlace: async (id) => {
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
      
      // Update map view to focus on selected place
      if (place) {
        set((state) => ({
          mapSettings: {
            ...state.mapSettings,
            center: [place.location.longitude, place.location.latitude],
            zoom: 15,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching place:', error);
      set({ error: (error as Error).message });
    }
  },
  
  setMapSettings: (settings) => set((state) => ({
    mapSettings: {
      ...state.mapSettings,
      ...settings,
    },
  })),
  
  setFilteredPlaces: (places) => set({ 
    places,
    filteredPlaces: places 
  }),
  
  toggleMood: (mood: Mood) => {
    set((state) => {
      const isSelected = state.selectedMoods.includes(mood);
      const newSelectedMoods = isSelected
        ? state.selectedMoods.filter(m => m !== mood)
        : [...state.selectedMoods, mood];
      
      // Filter places based on selected moods
      const newFilteredPlaces = newSelectedMoods.length === 0
        ? state.places
        : state.places.filter(place => 
            place.moods?.some(m => newSelectedMoods.includes(m)) ?? false
          );
      
      return {
        selectedMoods: newSelectedMoods,
        filteredPlaces: newFilteredPlaces,
      };
    });
  },
  
  clearMoods: () => {
    set((state) => ({
      selectedMoods: [],
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
      
      // Apply any existing mood filters
      const { selectedMoods } = get();
      if (selectedMoods.length > 0) {
        get().toggleMood(selectedMoods[0]); // Re-filter
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
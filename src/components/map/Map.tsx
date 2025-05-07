'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../styles/map.css';
import { useMapStore } from '../../store/useMapStore';
import { useNavigation } from '../ui/Navigation';
import type { Place, Mood } from '../../types/index';
import { cn } from '../../lib/utils';
import { PlacePopup } from '../place/PlacePopup';
import { createRoot } from 'react-dom/client';
import { 
  Coffee, 
  UtensilsCrossed, 
  Beer, 
  Landmark, 
  MapPin,
  ShoppingBag,
  Dumbbell
} from 'lucide-react';
import { PlaceDetailsSheet } from '../place/PlaceDetailsSheet';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltb25zdGVuZWxpZCIsImEiOiJjbWE2cmhxcHkwc2hvMmlzNm9xdGloOTF3In0.DO89L9nl0vo1PVzv6M_20w';

// Custom map style that matches the app's vibe
const MAP_STYLE = 'mapbox://styles/simonstenelid/cma8hw47d00gm01sd2xza22nf';

// Icon components for different categories
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'cafe': Coffee,
  'restaurant': UtensilsCrossed,
  'bar': Beer,
  'cultural': Landmark,
  'activity': Dumbbell,
  'shopping': ShoppingBag,
};

interface MapProps {
  className?: string;
}

// Add this helper function before the Map component
function isValidCoordinate(location: { longitude: number; latitude: number } | null | undefined): boolean {
  if (!location) return false;
  const { longitude, latitude } = location;
  return (
    typeof longitude === 'number' && 
    typeof latitude === 'number' && 
    !isNaN(longitude) && 
    !isNaN(latitude) &&
    longitude >= -180 && 
    longitude <= 180 &&
    latitude >= -90 && 
    latitude <= 90
  );
}

// Add this helper function before the Map component
function centerMapOnPlace(map: mapboxgl.Map, place: Place) {
  if (!place.location || !isValidCoordinate(place.location)) return;
  
  // Get the map container dimensions
  const mapContainer = map.getContainer();
  const mapHeight = mapContainer.offsetHeight;
  
  // Calculate vertical offset to account for popup height and UI elements
  // Popup height is approximately 200px, and we want it centered in the viewport
  const popupHeight = 200;
  const verticalOffset = (popupHeight / 2) / (111320 * Math.cos(place.location.latitude * Math.PI / 180));
  
  map.easeTo({
    center: [
      place.location.longitude,
      place.location.latitude + verticalOffset // Add offset to move point down
    ],
    duration: 500,
    zoom: Math.max(map.getZoom() || 13, 14),
    padding: { top: 0, bottom: 0, left: 0, right: 0 } // Reset any existing padding
  });
}

const Map: React.FC<MapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isPlaceDetailsOpen, setIsPlaceDetailsOpen] = useState(false);
  
  const { 
    mapSettings, 
    filteredPlaces, 
    selectedPlaceId,
    selectPlace 
  } = useMapStore();

  const { isCollapsed } = useNavigation();
  
  // Safe resize function
  const safeResize = useCallback(() => {
    const map = mapInstance.current;
    if (map && mapContainer.current) {
      try {
        map.resize();
      } catch (error) {
        console.warn('Map resize failed:', error);
      }
    }
  }, []);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;
    
    // Create the map instance with custom style
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: mapSettings.center,
      zoom: mapSettings.zoom,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });
    
    mapInstance.current = map;
    
    // Expose map instance to window for search field
    (window as any).mapInstance = map;
    (window as any).popupsRef = popupsRef;
    
    // Add custom navigation control with 3D rotation
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true
    });
    map.addControl(nav, 'top-right');
    
    // Set up resize observer
    if (mapContainer.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        safeResize();
      });
      resizeObserverRef.current.observe(mapContainer.current);
    }
    
    // Add 3D building layer for depth
    map.on('load', () => {
      // Add 3D building layer
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
      
      // Initial resize after load
      safeResize();
    });
    
    // Add smooth zoom on double click
    map.on('dblclick', (e) => {
      e.preventDefault();
      map.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
        zoom: Math.min((map.getZoom() || 13) + 1, 18),
        duration: 1000,
        essential: true
      });
    });
    
    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapSettings.center, mapSettings.zoom, safeResize]);
  
  // Handle navigation collapse state changes
  useEffect(() => {
    if (!mapInstance.current || !mapContainer.current) return;

    // Use a RAF to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        safeResize();
      });
    }, 350); // Slightly longer than the CSS transition

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCollapsed, safeResize]);
  
  // Update markers when filteredPlaces change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    
    // Remove old markers and popups
    Object.values(markersRef.current).forEach(marker => marker.remove());
    Object.values(popupsRef.current).forEach(popup => popup.remove());
    markersRef.current = {};
    popupsRef.current = {};
    
    // Add new markers with custom styling and animations
    filteredPlaces.forEach(place => {
      // Validate coordinates before creating marker
      if (!isValidCoordinate(place.location)) {
        console.warn(`Invalid coordinates for place: ${place.name}`);
        return;
      }

      // Get the icon based on place category
      const IconComponent = CATEGORY_ICONS[place.category] || MapPin;
      
      // Create marker element with icon
      const el = document.createElement('div');
      el.className = 'marker';
      el.setAttribute('data-category', place.category);
      
      // Create icon element
      const iconContainer = document.createElement('div');
      iconContainer.className = 'marker-content';
      
      // Create and render the icon using React
      const iconRoot = createRoot(iconContainer);
      iconRoot.render(
        <IconComponent
          size={24}
          className="marker-icon"
          strokeWidth={2}
        />
      );
      
      el.appendChild(iconContainer);
      
      // Create popup
      const popupContainer = document.createElement('div');
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: 'none',
        className: 'place-popup',
        offset: [0, -30],
        anchor: 'bottom',
        focusAfterOpen: false
      });

      // Create a root for the popup content
      const root = createRoot(popupContainer);
      
      const handleViewDetails = () => {
        // Close all popups first
        Object.values(popupsRef.current).forEach(popup => popup.remove());
        
        setSelectedPlace(place);
        setIsPlaceDetailsOpen(true);
      };

      root.render(
        <PlacePopup 
          place={place}
          onViewDetails={handleViewDetails}
        />
      );

      popup.setDOMContent(popupContainer);
      
      // Add marker with custom options
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
        offset: [0, 0],
        rotationAlignment: 'viewport',
        pitchAlignment: 'viewport'
      })
        .setLngLat([place.location!.longitude, place.location!.latitude])
        .addTo(map);

      // Store references
      markersRef.current[place.id] = marker;
      popupsRef.current[place.id] = popup;
      
      // Add click handler to marker
      el.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        
        // Close any open popups
        Object.values(popupsRef.current).forEach(p => p.remove());
        
        // Show this popup
        popup
          .setLngLat([place.location!.longitude, place.location!.latitude])
          .addTo(map);
        
        // Center the map on the place
        centerMapOnPlace(map, place);
      });
    });
  }, [filteredPlaces]);
  
  // Handle selected place changes
  useEffect(() => {
    if (selectedPlaceId) {
      const place = filteredPlaces.find(p => p.id === selectedPlaceId);
      if (place && mapInstance.current) {
        setSelectedPlace(place);
        setIsPlaceDetailsOpen(true);
        centerMapOnPlace(mapInstance.current, place);
      }
    } else {
      setSelectedPlace(null);
      setIsPlaceDetailsOpen(false);
    }
  }, [selectedPlaceId, filteredPlaces]);
  
  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapContainer} className="w-full h-full" />

      {/* Place Details Sheet */}
      {selectedPlace && (
        <PlaceDetailsSheet
          place={selectedPlace}
          isOpen={isPlaceDetailsOpen}
          onClose={() => {
            setIsPlaceDetailsOpen(false);
            selectPlace(null);
          }}
        />
      )}
    </div>
  );
};

export default Map;
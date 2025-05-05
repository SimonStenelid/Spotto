'use client';

import React, { useEffect, useRef, useState } from 'react';
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

const Map: React.FC<MapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { 
    mapSettings, 
    filteredPlaces, 
    selectedPlaceId,
    selectPlace 
  } = useMapStore();

  const { isCollapsed } = useNavigation();
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;
    
    // Create the map instance with custom style
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: mapSettings.center,
      zoom: mapSettings.zoom,
      pitch: 45, // Add a slight tilt for 3D effect
      bearing: -17.6,
      antialias: true
    });
    
    mapInstance.current = map;
    
    // Add custom navigation control with 3D rotation
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true
    });
    map.addControl(nav, 'top-right');
    
    // Add geolocate control with custom styling
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
    });
    map.addControl(geolocate, 'bottom-right');
    geolocateControl.current = geolocate;
    
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
      
      // Trigger geolocation
      geolocate.trigger();
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
      map.remove();
      mapInstance.current = null;
      geolocateControl.current = null;
    };
  }, [mapSettings.center, mapSettings.zoom]);
  
  // Handle navigation collapse state changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Create a ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    // Observe the map container
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    // Trigger an immediate resize
    map.resize();

    // Also trigger a delayed resize to handle CSS transitions
    const timer = setTimeout(() => {
      map.resize();
    }, 350); // Slightly longer than the CSS transition

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [isCollapsed]);
  
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
        setSelectedPlace(place);
        setIsDetailsOpen(true);
        popup.remove();
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
        offset: [0, 0]
      })
        .setLngLat([place.location!.longitude, place.location!.latitude])
        .setPopup(popup)
        .addTo(map);
      
      // Add click handler to both marker element and icon
      const handleClick = (e: Event) => {
        e.stopPropagation(); // Prevent event bubbling
        
        // Close any open popups except this one
        Object.entries(popupsRef.current).forEach(([id, p]) => {
          if (id !== place.id) {
            p.remove();
          }
        });
        
        // Show this popup
        popup.addTo(map);
        
        // Pan map to center the marker and popup with offset
        const bounds = map.getBounds();
        const offset = (bounds.getNorth() - bounds.getSouth()) / 6;
        
        map.easeTo({
          center: [
            place.location!.longitude,
            place.location!.latitude - offset
          ],
          duration: 500,
          zoom: Math.max(map.getZoom() || 13, 14)
        });
      };
      
      el.addEventListener('click', handleClick);
      
      // Store references
      markersRef.current[place.id] = marker;
      popupsRef.current[place.id] = popup;
    });
  }, [filteredPlaces]);
  
  return (
    <>
      <style>
        {`
          .mapboxgl-map {
            width: 100% !important;
            height: 100% !important;
            transition: all 300ms ease-in-out;
          }
          
          .mapboxgl-ctrl-logo {
            display: none !important;
          }
          
          .marker {
            cursor: pointer;
            transform-origin: bottom;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1;
          }
          
          .marker:hover {
            transform: scale(1.2) translateY(-5px);
            z-index: 2;
          }
          
          .marker-content {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: auto;
          }
          
          .marker-icon {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
            transform-origin: bottom;
            animation: bounce 2s infinite;
            cursor: pointer;
            user-select: none;
          }
          
          .marker-name {
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255,255,255,0.9);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            color: #4B5563;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
          }
          
          .marker:hover .marker-name {
            opacity: 1;
          }
          
          .marker-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.3);
            animation: pulse 2s infinite;
            pointer-events: none;
          }
          
          .mapboxgl-popup {
            z-index: 3;
          }
          
          .mapboxgl-popup-content {
            padding: 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .mapboxgl-popup-close-button {
            padding: 6px 8px;
            color: #6B7280;
            font-size: 18px;
            font-weight: 500;
            right: 4px;
            top: 4px;
            border-radius: 50%;
            transition: all 0.2s ease;
            z-index: 1;
          }
          
          .mapboxgl-popup-close-button:hover {
            background-color: rgba(0,0,0,0.05);
            color: #374151;
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.95);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
          
          /* Custom control styling */
          .mapboxgl-ctrl-group {
            background: rgba(255,255,255,0.9) !important;
            backdrop-filter: blur(8px);
            border: none !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
            border-radius: 12px !important;
            overflow: hidden;
          }
          
          .mapboxgl-ctrl-group button {
            width: 36px !important;
            height: 36px !important;
            border-radius: 0 !important;
          }
          
          .mapboxgl-ctrl-group button:hover {
            background: rgba(139, 92, 246, 0.1) !important;
          }
        `}
      </style>
      <div 
        ref={mapContainer} 
        className={cn(
          "w-full h-full relative",
          "transition-all duration-300 ease-in-out",
          className
        )}
      />
      
      {selectedPlace && (
        <PlaceDetailsSheet
          place={selectedPlace}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedPlace(null);
          }}
        />
      )}
    </>
  );
};

export default Map;
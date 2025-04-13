'use client';

import { useEffect, useRef } from 'react';

interface RouteCoordinate {
  lat: number;
  lng: number;
}

interface RouteMarker {
  position: [number, number];
  title: string;
  desc?: string;
  carbonSaved?: string;
  // Allow other properties without explicitly defining them
  [key: string]: any;
}

interface RouteMapProps {
  coordinates?: RouteCoordinate[];
  startPoint?: string;
  destination?: string;
  className?: string;
  markers?: RouteMarker[];
}

export default function RouteMap({ 
  coordinates, 
  startPoint, 
  destination, 
  className = 'h-64 md:h-96',
  markers
}: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    
    // Check if we should use coordinates or markers
    const useMarkers = markers && markers.length > 0;
    const useCoordinates = coordinates && coordinates.length > 0;
    
    // Return if we don't have any data to display
    if (!useMarkers && !useCoordinates) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Clear any existing map instance
      mapRef.current!.innerHTML = '';
      
      // Create a container with specific id for the map
      const mapContainer = document.createElement('div');
      mapContainer.style.width = '100%';
      mapContainer.style.height = '100%';
      mapRef.current!.appendChild(mapContainer);

      // Initialize the map
      const map = L.map(mapContainer);

      // Add OpenStreetMap tile layer (no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      if (useCoordinates && coordinates) {
        // Create a polyline for the route
        const routePath = L.polyline(
          coordinates.map(coord => [coord.lat, coord.lng]),
          { color: '#3B82F6', weight: 5, opacity: 0.7 }
        ).addTo(map);

        // Create custom start & end icons
        const greenIcon = L.divIcon({
          html: `<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>`,
          className: 'custom-div-icon',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const redIcon = L.divIcon({
          html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md"></div>`,
          className: 'custom-div-icon',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        // Add start marker with popup
        const startMarker = L.marker([coordinates[0].lat, coordinates[0].lng], { icon: greenIcon })
          .addTo(map)
          .bindPopup(`<div class="text-center font-medium">
            <span class="text-green-600">Start:</span> ${startPoint || 'Starting Point'}
            <div class="text-xs text-gray-500">
              ${coordinates[0].lat.toFixed(4)}, ${coordinates[0].lng.toFixed(4)}
            </div>
          </div>`);

        // Add end marker with popup
        const endMarker = L.marker([coordinates[coordinates.length - 1].lat, coordinates[coordinates.length - 1].lng], { icon: redIcon })
          .addTo(map)
          .bindPopup(`<div class="text-center font-medium">
            <span class="text-red-600">Destination:</span> ${destination || 'Destination'}
            <div class="text-xs text-gray-500">
              ${coordinates[coordinates.length - 1].lat.toFixed(4)}, ${coordinates[coordinates.length - 1].lng.toFixed(4)}
            </div>
          </div>`);

        // Add waypoint markers if there are intermediate points
        if (coordinates.length > 2) {
          const waypointIcon = L.divIcon({
            html: `<div class="w-2 h-2 bg-blue-400 rounded-full border border-white"></div>`,
            className: 'custom-div-icon',
            iconSize: [10, 10],
            iconAnchor: [5, 5]
          });

          // Add markers for intermediate waypoints
          for (let i = 1; i < coordinates.length - 1; i++) {
            L.marker([coordinates[i].lat, coordinates[i].lng], { icon: waypointIcon })
              .addTo(map);
          }
        }

        // Fit the map to the route bounds with some padding
        const bounds = routePath.getBounds();
        map.fitBounds(bounds, { padding: [30, 30] });

        // Open the start marker popup
        setTimeout(() => {
          startMarker.openPopup();
        }, 500);
      } else if (useMarkers && markers) {
        // Create custom marker icon
        const markerIcon = L.divIcon({
          html: `<div class="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">R</div>`,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        // Create a bounds object to fit all markers
        const bounds = L.latLngBounds();
        
        // Add markers for each route
        markers.forEach((marker, index) => {
          // Extract latitude and longitude from the position array
          const [lat, lng] = marker.position;
          
          // Add marker to map
          const routeMarker = L.marker([lat, lng], { icon: markerIcon })
            .addTo(map)
            .bindPopup(`
              <div class="text-center p-1">
                <div class="font-medium text-emerald-800">${marker.title}</div>
                ${marker.desc ? `<div class="text-xs text-gray-600 mt-1">${marker.desc}</div>` : ''}
                ${marker.carbonSaved ? `<div class="text-xs font-medium text-emerald-600 mt-1">CO₂ Saved: ${marker.carbonSaved}</div>` : ''}
              </div>
            `);
            
          // Extend bounds to include this marker
          bounds.extend([lat, lng]);
        });
        
        // If we have markers, fit the map to their bounds
        if (markers.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        } else {
          // Default view if no markers
          map.setView([0, 0], 2);
        }
      }

      // Cleanup function
      return () => {
        map.remove();
      };
    }).catch(error => {
      console.error('Error loading Leaflet:', error);
      
      // Fallback if Leaflet fails to load
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="w-full h-full flex items-center justify-center bg-gray-100">
            <div class="text-center text-gray-600">
              <div class="mb-2">⚠️ Map loading failed</div>
              ${startPoint ? `<div class="text-sm">From: ${startPoint}</div>` : ''}
              ${destination ? `<div class="text-sm">To: ${destination}</div>` : ''}
              ${markers && markers.length ? `<div class="text-sm">${markers.length} routes available</div>` : ''}
            </div>
          </div>
        `;
      }
    });
  }, [coordinates, startPoint, destination, markers]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full ${className} bg-gray-100 rounded overflow-hidden`}
      data-testid="route-map"
    />
  );
} 
'use client';

import axios from 'axios';
import { Globe } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Define types without importing Leaflet initially
interface Route {
  _id: string;
  start: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    country: string;
    region: string;
    city: string;
  };
  destination: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    country: string;
    region: string;
    city: string;
  };
  carbonSaved: number;
  distance: number;
  transportMode: string;
  estimatedTime: number;
  attractions: Array<{
    name: string;
    description: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    culturalSignificance: string;
  }>;
}

// Store region coordinates for the map
const regionCoordinates = {
  'NA': { lat: 37.0902, lng: -95.7129, zoom: 4 }, // North America
  'EU': { lat: 51.1657, lng: 10.4515, zoom: 4 },  // Europe
  'AS': { lat: 34.0479, lng: 100.6197, zoom: 3 }, // Asia
  'OC': { lat: -25.2744, lng: 133.7751, zoom: 4 }, // Oceania
  'AF': { lat: 8.7832, lng: 34.5085, zoom: 3 },   // Africa
  'SA': { lat: -8.7832, lng: -55.4915, zoom: 3 }  // South America
};

export default function RegionalRoutes() {
  const [selectedRegion, setSelectedRegion] = useState('NA');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const regionNames = {
    'NA': 'North America',
    'EU': 'Europe',
    'AS': 'Asia',
    'OC': 'Oceania',
    'AF': 'Africa',
    'SA': 'South America'
  };

  // Check if we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchRegionalRoutes = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/routes/region/${selectedRegion}`);
        setRoutes(response.data);
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError('Failed to load routes for this region');
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegionalRoutes();
  }, [selectedRegion]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Don't render the map on the server
  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-green-700 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <Globe className="mr-2" /> Global EcoRoutes
        </h2>
        <p className="text-green-50">Discover sustainable travel routes across different regions of the world</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Region selector */}
        <div className="p-6 border-r border-gray-200 bg-green-50">
          <h3 className="text-lg font-semibold mb-4 text-green-800">Select Region</h3>
          <div className="space-y-2 mb-8">
            {Object.entries(regionNames).map(([code, name]) => (
              <button
                key={code}
                onClick={() => setSelectedRegion(code)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition ${
                  selectedRegion === code
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-green-100'
                }`}
              >
                <Globe className={`mr-2 h-5 w-5 ${selectedRegion === code ? 'text-white' : 'text-green-600'}`} />
                {name}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-green-700">Loading routes...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              <p className="font-medium">{error}</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
              <p className="font-medium">No routes available for this region yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Available Routes</h3>
              {routes.map((route) => (
                <div 
                  key={route._id} 
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-green-700">
                        {route.start.name} to {route.destination.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {route.distance} km · {formatTime(route.estimatedTime)}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {route.carbonSaved} kg CO₂ saved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Map - only rendered client side */}
        <div className="lg:col-span-2">
          <div className="h-[600px] relative">
            {isClient ? (
              <MapComponent selectedRegion={selectedRegion} routes={routes} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-50">
                <p className="text-green-700">Loading map...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic import of map component to avoid server-side rendering issues
function MapComponent({ selectedRegion, routes }) {
  const [Map, setMap] = useState(null);

  useEffect(() => {
    // Dynamically import Leaflet and React Leaflet components
    import('leaflet').then(L => {
      import('react-leaflet').then(RL => {
        // Fix Leaflet marker icon issue in Next.js
        L.Icon.Default.mergeOptions({
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png',
        });
        
        setMap({ L, RL });
      });
    });
  }, []);

  if (!Map) {
    return <div className="w-full h-full flex items-center justify-center bg-green-50">
      <p className="text-green-700">Loading map...</p>
    </div>;
  }

  const { L, RL } = Map;
  const { MapContainer, TileLayer, Marker, Popup } = RL;
  
  // Create a change view component
  const ChangeView = ({ center, zoom }) => {
    const map = RL.useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  return (
    <MapContainer 
      center={[regionCoordinates[selectedRegion].lat, regionCoordinates[selectedRegion].lng]} 
      zoom={regionCoordinates[selectedRegion].zoom} 
      className="w-full h-full"
    >
      <ChangeView 
        center={[regionCoordinates[selectedRegion].lat, regionCoordinates[selectedRegion].lng]} 
        zoom={regionCoordinates[selectedRegion].zoom} 
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {routes.map((route) => (
        <React.Fragment key={route._id}>
          <Marker 
            position={[route.start.coordinates.latitude, route.start.coordinates.longitude]}
            title={route.start.name}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{route.start.name}</h3>
                <p className="text-sm">{route.start.city}, {route.start.country}</p>
              </div>
            </Popup>
          </Marker>
          
          <Marker 
            position={[route.destination.coordinates.latitude, route.destination.coordinates.longitude]}
            title={route.destination.name}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{route.destination.name}</h3>
                <p className="text-sm">{route.destination.city}, {route.destination.country}</p>
              </div>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
} 
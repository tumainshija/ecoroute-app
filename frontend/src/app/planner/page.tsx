'use client';

import ChatBot from '@/app/components/ChatBot';
import Footer from '@/app/components/Footer';
import RouteMap from '@/app/components/RouteMap';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ecoRouteApi } from '../services/api';

// Define the route coordinate type
interface RouteCoordinate {
  lat: number;
  lng: number;
}

export default function Page() {
  const router = useRouter();
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routeSaved, setRouteSaved] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [transportMode, setTransportMode] = useState('balanced');
  const [continent, setContinent] = useState('africa');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Helper function to convert an address string to coordinates
  const getCoordinatesFromAddress = async (address: string): Promise<RouteCoordinate> => {
    // In a real app, you would call a geocoding API like Google Maps, Mapbox, or OpenStreetMap
    // For demo purposes, we'll generate realistic coordinates based on the input string
    
    // Create a deterministic but seemingly random value from the string
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
    
    const hash = hashCode(address);
    
    // Generate realistic coordinates
    // Base coordinates (rough center of continents)
    const continentCoords: Record<string, { lat: number; lng: number }> = {
      'africa': { lat: 7.1881, lng: 21.0938 },
      'asia': { lat: 34.0479, lng: 100.6197 },
      'europe': { lat: 54.5260, lng: 15.2551 },
      'north-america': { lat: 54.5260, lng: -105.2551 },
      'south-america': { lat: -8.7832, lng: -55.4915 },
      'oceania': { lat: -25.2744, lng: 133.7751 }
    };
    
    // Determine which continent the address might be in
    let continentBase = continentCoords['europe']; // Default
    for (const [continent, coords] of Object.entries(continentCoords)) {
      if (address.toLowerCase().includes(continent.replace('-', ' '))) {
        continentBase = coords;
        break;
      }
    }
    
    // Add some realistic variation based on the address hash
    const latVariation = (hash % 1000) / 1000 * 10 - 5; // +/- 5 degrees
    const lngVariation = ((hash >> 10) % 1000) / 1000 * 10 - 5; // +/- 5 degrees
    
    return {
      lat: continentBase.lat + latVariation,
      lng: continentBase.lng + lngVariation
    };
  };
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // You should replace this with your actual auth check
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        
        // Verify token with your API if needed
        // const response = await ecoRouteApi.verifyToken(token);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Map configuration based on continent
  const getMapConfig = () => {
    type ConfigKey = 'africa' | 'asia' | 'europe' | 'north-america' | 'south-america' | 'oceania';
    
    const configs: Record<ConfigKey, {
      image: string;
      co2Reduction: string;
      travelTime: string;
      transportType: string;
    }> = {
      africa: {
        image: '/images/maps/afr.jpg',
        co2Reduction: '68%',
        travelTime: '4h 20m',
        transportType: 'Train & Electric Safari Vehicle'
      },
      asia: {
        image: '/images/maps/asia-map.jpg',
        co2Reduction: '72%',
        travelTime: '5h 15m',
        transportType: 'High-speed Rail & Electric Bus'
      },
      europe: {
        image: '/images/maps/europe-map.jpg',
        co2Reduction: '85%',
        travelTime: '3h 30m',
        transportType: 'Electric Train & Bike Share'
      },
      'north-america': {
        image: '/images/maps/north-america-map.jpg',
        co2Reduction: '65%',
        travelTime: '4h 10m',
        transportType: 'Electric Bus & Light Rail'
      },
      'south-america': {
        image: '/images/maps/south-america-map.jpg',
        co2Reduction: '70%',
        travelTime: '5h 45m',
        transportType: 'Ferry & Electric Tram'
      },
      oceania: {
        image: '/images/maps/oceania-map.jpg',
        co2Reduction: '62%',
        travelTime: '3h 50m',
        transportType: 'Electric Shuttle & Sailboat'
      }
    };
    
    return configs[continent as ConfigKey] || configs.europe; // Default to Europe if continent not found
  };
  
  // Handle next step in multi-step form
  const handleNextStep = () => {
    if (step === 1 && (!startPoint || !destination)) {
      setError('Please enter both starting point and destination.');
      return;
    }
    
    setError('');
    
    // If moving to step 3, calculate the route
    if (step === 2) {
      calculateRoute();
    }
    
    setStep(step + 1);
  };
  
  // Handle previous step in multi-step form
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  // Calculate route automatically
  const calculateRoute = async () => {
    if (!startPoint || !destination) return;
    
    try {
      setIsLoading(true);
      
      // Get start and end coordinates
      const startCoord = await getCoordinatesFromAddress(startPoint);
      const endCoord = await getCoordinatesFromAddress(destination);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a route that follows roads more realistically (like Uber/Bolt)
      const routePoints = generateRoadBasedRoute(startCoord, endCoord);
      setRouteCoordinates(routePoints);
      
      // Calculate accurate distance and time like ride-hailing apps
      const totalDistance = calculateRoadDistance(routePoints);
      const duration = calculateETA(totalDistance, transportMode);
      
      setDistanceKm(totalDistance);
      setDurationMinutes(duration);
      
    } catch (err) {
      console.error('Error calculating route:', err);
      setError('Failed to calculate route. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate a realistic road-based route like Uber/Bolt
  const generateRoadBasedRoute = (start: RouteCoordinate, end: RouteCoordinate): RouteCoordinate[] => {
    const points: RouteCoordinate[] = [start];
    
    // Calculate direct vector from start to end
    const directLat = end.lat - start.lat;
    const directLng = end.lng - start.lng;
    
    // Create a zigzag path that mimics city streets
    let currentPoint = {...start};
    const numSegments = 6 + Math.floor(Math.random() * 6); // 6-12 segments
    
    // Start with either horizontal or vertical movement
    let moveHorizontal = Math.random() > 0.5;
    
    for (let i = 0; i < numSegments; i++) {
      // How far along the route are we (0-1)
      const progress = i / numSegments;
      
      // Determine segment length (longer in the middle of the route)
      const segmentRatio = Math.sin(progress * Math.PI) * 0.4 + 0.2;
      
      // Move either horizontally or vertically
      if (moveHorizontal) {
        currentPoint = {
          lat: currentPoint.lat + (Math.random() * 0.001 - 0.0005), // tiny variation
          lng: currentPoint.lng + directLng * segmentRatio
        };
      } else {
        currentPoint = {
          lat: currentPoint.lat + directLat * segmentRatio,
          lng: currentPoint.lng + (Math.random() * 0.001 - 0.0005) // tiny variation
        };
      }
      
      // Add point to route
      points.push({...currentPoint});
      
      // Switch direction (mimics turning at intersections)
      moveHorizontal = !moveHorizontal;
    }
    
    // Ensure we end exactly at the destination
    points.push(end);
    
    return points;
  };
  
  // Calculate route distance accurately along road segments
  const calculateRoadDistance = (points: RouteCoordinate[]): number => {
    // Use Haversine formula to calculate real-world distances
    const R = 6371; // Earth's radius in km
    let totalDistance = 0;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      const dLat = (p2.lat - p1.lat) * Math.PI / 180;
      const dLon = (p2.lng - p1.lng) * Math.PI / 180;
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      totalDistance += distance;
    }
    
    // Apply winding road factor (roads aren't straight lines)
    const windingFactor = 1.2;
    return Math.round(totalDistance * windingFactor);
  };
  
  // Calculate ETA like Uber/Bolt based on transport mode and traffic
  const calculateETA = (distance: number, mode: string): number => {
    let speed; // km per hour
    
    // Set speeds based on transport mode
    switch (mode) {
      case 'eco':
        speed = 20; // Public transport speed
        break;
      case 'fast':
        speed = 60; // Fast car/express mode
        break;
      case 'balanced':
      default:
        speed = 30; // Regular car speed
    }
    
    // Simulate traffic conditions
    const hour = new Date().getHours();
    let trafficMultiplier = 1.0;
    
    // Rush hour traffic (8-10am, 5-7pm)
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
      trafficMultiplier = 1.3; // 30% slower
    }
    
    // Calculate minutes with traffic adjustment
    const minutes = Math.round((distance / speed) * 60 * trafficMultiplier);
    
    // Add wait/pickup time (like real ride-hailing)
    const waitTime = 2 + Math.floor(Math.random() * 3); // 2-4 minutes
    
    return minutes + waitTime;
  };
  
  // Format duration for display
  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRouteSaved(false);
    
    // Validate required inputs
    if (!startPoint || !destination) {
      setError('Please enter both starting point and destination.');
      setIsLoading(false);
      return;
    }
    
    console.log('Generating eco-friendly route for', continent);
    
    try {
      // Use calculated distance and duration if available, otherwise use config values
      const mapConfig = getMapConfig();
      
      // Get carbon saved based on distance and transport mode
      const calculatedCarbonSaved = distanceKm 
        ? calculateCarbonSaved(distanceKm, transportMode) 
        : parseFloat(mapConfig.co2Reduction.replace('%', ''));
      
      // Get travel time from calculated duration or use config
      const calculatedTotalMinutes = durationMinutes || (() => {
        const travelTimeStr = mapConfig.travelTime;
        const hours = parseInt(travelTimeStr.split('h')[0]) || 0;
        const minutesStr = travelTimeStr.split('h')[1]?.replace('m', '') || '0';
        const minutes = parseInt(minutesStr) || 0;
        return (hours * 60) + minutes;
      })();
      
      // Create properly formatted route data
      const routeData = {
        start: {
          name: startPoint,
          coordinates: {
            latitude: routeCoordinates.length > 0 ? routeCoordinates[0].lat : 40.7128,
            longitude: routeCoordinates.length > 0 ? routeCoordinates[0].lng : -74.0060
          },
          country: startPoint.split(',').length > 1 ? startPoint.split(',')[1].trim() : 'United States',
          region: getRegionCode(continent),
          city: startPoint.split(',')[0].trim()
        },
        destination: {
          name: destination,
          coordinates: {
            latitude: routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1].lat : 34.0522,
            longitude: routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1].lng : -118.2437
          },
          country: destination.split(',').length > 1 ? destination.split(',')[1].trim() : 'United States',
          region: getRegionCode(continent),
          city: destination.split(',')[0].trim()
        },
        carbonSaved: calculatedCarbonSaved,
        distance: distanceKm || Math.floor(Math.random() * 500) + 100,
        transportMode: getTransportMode(transportMode),
        estimatedTime: calculatedTotalMinutes,
        attractions: [
          {
            name: `${destination} Cultural Center`,
            description: `Explore the cultural heritage of ${destination}`,
            coordinates: {
              latitude: routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1].lat : 34.0522,
              longitude: routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1].lng : -118.2437
            },
            culturalSignificance: "Important local cultural landmark"
          }
        ]
      };
      
      console.log('Submitting route data:', routeData);
      
      // Save the route to our backend
      await ecoRouteApi.createRoute(routeData);
      
      setRouteSaved(true);
      
      // Scroll to the map section
      const mapElement = document.getElementById('map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error saving route:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save route. Please check your input and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate carbon saved based on distance and transport mode
  const calculateCarbonSaved = (distance: number, mode: string) => {
    // Reference: A standard car emits about 120g CO2 per km
    const carEmissions = distance * 0.12; // in kg
    
    // Calculate emissions for the chosen transport mode
    let modeEmissions;
    switch (mode) {
      case 'eco':
        modeEmissions = distance * 0.03; // e.g., public transport - 75% reduction
        break;
      case 'fast':
        modeEmissions = distance * 0.06; // e.g., electric vehicle - 50% reduction
        break;
      case 'balanced':
      default:
        modeEmissions = distance * 0.04; // e.g., hybrid vehicle - 65% reduction
        break;
    }
    
    // Return the difference (savings)
    return parseFloat((carEmissions - modeEmissions).toFixed(2));
  };
  
  // Helper function to get region code
  const getRegionCode = (continentValue: string): string => {
    const regionMap: Record<string, string> = {
      'africa': 'AF',
      'asia': 'AS',
      'europe': 'EU',
      'north-america': 'NA',
      'south-america': 'SA',
      'oceania': 'OC'
    };
    return regionMap[continentValue] || 'NA';
  };
  
  // Helper function to convert UI transport mode to backend enum
  const getTransportMode = (mode: string): 'walking' | 'cycling' | 'public_transport' | 'electric_vehicle' | 'hybrid_vehicle' => {
    const modeMap: Record<string, 'walking' | 'cycling' | 'public_transport' | 'electric_vehicle' | 'hybrid_vehicle'> = {
      'eco': 'public_transport',
      'balanced': 'hybrid_vehicle',
      'fast': 'electric_vehicle',
      'walking': 'walking',
      'cycling': 'cycling'
    };
    return modeMap[mode] || 'hybrid_vehicle';
  };

  // Initialize map when route changes
  useEffect(() => {
    if (mapRef.current && routeCoordinates.length > 0 && step === 3 && !isLoading) {
      initMap();
    }
  }, [routeCoordinates, step, isLoading]);

  // Initialize map function
  const initMap = () => {
    if (!mapRef.current || routeCoordinates.length === 0) return;

    // Create a map div if it doesn't exist
    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(mapDiv);

    // Draw a simple SVG map with the route
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    mapDiv.appendChild(svg);

    // Normalize coordinates to fit in the SVG viewport
    const minLat = Math.min(...routeCoordinates.map(p => p.lat));
    const maxLat = Math.max(...routeCoordinates.map(p => p.lat));
    const minLng = Math.min(...routeCoordinates.map(p => p.lng));
    const maxLng = Math.max(...routeCoordinates.map(p => p.lng));
    
    // Convert geo coordinates to SVG coordinates
    const coordToSvgX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
    const coordToSvgY = (lat: number) => 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    
    // Create path string for the route
    let pathD = `M${coordToSvgX(routeCoordinates[0].lng)},${coordToSvgY(routeCoordinates[0].lat)}`;
    
    // Add curved line segments
    for (let i = 1; i < routeCoordinates.length; i++) {
      const x = coordToSvgX(routeCoordinates[i].lng);
      const y = coordToSvgY(routeCoordinates[i].lat);
      pathD += ` L${x},${y}`;
    }
    
    // Create the path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('stroke', '#3B82F6');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(path);
    
    // Add start point marker
    const startMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    startMarker.setAttribute('cx', coordToSvgX(routeCoordinates[0].lng).toString());
    startMarker.setAttribute('cy', coordToSvgY(routeCoordinates[0].lat).toString());
    startMarker.setAttribute('r', '3');
    startMarker.setAttribute('fill', '#22c55e');
    svg.appendChild(startMarker);
    
    // Add end point marker
    const endMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    endMarker.setAttribute('cx', coordToSvgX(routeCoordinates[routeCoordinates.length-1].lng).toString());
    endMarker.setAttribute('cy', coordToSvgY(routeCoordinates[routeCoordinates.length-1].lat).toString());
    endMarker.setAttribute('r', '3');
    endMarker.setAttribute('fill', '#ef4444');
    svg.appendChild(endMarker);
    
    // Add city labels
    const startLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    startLabel.setAttribute('x', (coordToSvgX(routeCoordinates[0].lng) + 3).toString());
    startLabel.setAttribute('y', (coordToSvgY(routeCoordinates[0].lat) - 3).toString());
    startLabel.setAttribute('font-size', '3');
    startLabel.setAttribute('fill', '#64748b');
    startLabel.textContent = startPoint;
    svg.appendChild(startLabel);
    
    const endLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    endLabel.setAttribute('x', (coordToSvgX(routeCoordinates[routeCoordinates.length-1].lng) + 3).toString());
    endLabel.setAttribute('y', (coordToSvgY(routeCoordinates[routeCoordinates.length-1].lat) - 3).toString());
    endLabel.setAttribute('font-size', '3');
    endLabel.setAttribute('fill', '#64748b');
    endLabel.textContent = destination;
    svg.appendChild(endLabel);
  };

  // If still checking auth, show loading
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Main component UI
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/map.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 to-slate-900/90"></div>
          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center h-full text-white text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-sky-600/30 backdrop-blur-md px-8 py-10 rounded-2xl border border-white/10 max-w-3xl"
            >
              <span className="inline-block text-xs uppercase tracking-widest mb-4 bg-sky-500 px-3 py-1 rounded-full font-semibold shadow-md">Plan Your Sustainable Adventure</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Explore Responsibly. <span className="text-sky-300">Impact Mindfully.</span></h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-sky-50">
                Design eco-friendly travel routes that prioritize sustainability without compromising on authentic experiences
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <a 
                  href="#planner" 
                  className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your Route
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Planner Section */}
        <section id="planner" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="p-8 w-full">
                  <div className="uppercase tracking-wide text-sm text-sky-600 font-semibold mb-1">Step {step} of 3</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {step === 1 && "Where are you traveling?"}
                    {step === 2 && "How would you like to travel?"}
                    {step === 3 && "Review your eco-friendly route"}
                  </h2>
                  
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Locations */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="startPoint" className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
                          <input
                            type="text"
                            id="startPoint"
                            value={startPoint}
                            onChange={(e) => setStartPoint(e.target.value)}
                            placeholder="Enter city, landmark, or address"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                          <input
                            type="text"
                            id="destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Where are you going?"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="continent" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                          <select
                            id="continent"
                            value={continent}
                            onChange={(e) => setContinent(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          >
                            <option value="africa">Africa</option>
                            <option value="asia">Asia</option>
                            <option value="europe">Europe</option>
                            <option value="north-america">North America</option>
                            <option value="south-america">South America</option>
                            <option value="oceania">Oceania</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2: Travel Preferences */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Travel Mode Priority</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div
                              onClick={() => setTransportMode('eco')}
                              className={`border ${transportMode === 'eco' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'} rounded-lg p-4 cursor-pointer transition-all hover:border-sky-400`}
                            >
                              <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div className="font-medium">Most Eco-Friendly</div>
                                <div className="text-xs text-gray-500 mt-1">Lowest carbon impact</div>
                              </div>
                            </div>
                            
                            <div
                              onClick={() => setTransportMode('balanced')}
                              className={`border ${transportMode === 'balanced' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'} rounded-lg p-4 cursor-pointer transition-all hover:border-sky-400`}
                            >
                              <div className="text-center">
                                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full mx-auto flex items-center justify-center mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                  </svg>
                                </div>
                                <div className="font-medium">Balanced</div>
                                <div className="text-xs text-gray-500 mt-1">Good eco-efficiency</div>
                              </div>
                            </div>
                            
                            <div
                              onClick={() => setTransportMode('fast')}
                              className={`border ${transportMode === 'fast' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'} rounded-lg p-4 cursor-pointer transition-all hover:border-sky-400`}
                            >
                              <div className="text-center">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full mx-auto flex items-center justify-center mb-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </div>
                                <div className="font-medium">Fastest</div>
                                <div className="text-xs text-gray-500 mt-1">Optimized for speed</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 3: Route Review */}
                    {step === 3 && (
                      <div id="map-section" className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium text-gray-700 mb-2">Route Details</div>
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <div className="text-sm text-gray-600">From: <span className="text-gray-900">{startPoint}</span></div>
                              <div className="text-sm text-gray-600">To: <span className="text-gray-900">{destination}</span></div>
                              {routeCoordinates.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Start: {routeCoordinates[0].lat.toFixed(4)}, {routeCoordinates[0].lng.toFixed(4)} | 
                                  End: {routeCoordinates[routeCoordinates.length-1].lat.toFixed(4)}, {routeCoordinates[routeCoordinates.length-1].lng.toFixed(4)}
                                </div>
                              )}
                            </div>
                            <div>
                              {distanceKm ? (
                                <>
                                  <div className="text-sm text-gray-600">Distance: <span className="text-gray-900">{distanceKm} km</span></div>
                                  <div className="text-sm text-gray-600">CO₂ Reduction: <span className="text-green-600 font-medium">{calculateCarbonSaved(distanceKm, transportMode)} kg</span></div>
                                  <div className="text-sm text-gray-600">Travel Time: <span className="text-gray-900">{formatDuration(durationMinutes)}</span></div>
                                </>
                              ) : (
                                <>
                                  <div className="text-sm text-gray-600">CO₂ Reduction: <span className="text-green-600 font-medium">{getMapConfig().co2Reduction}</span></div>
                                  <div className="text-sm text-gray-600">Travel Time: <span className="text-gray-900">{getMapConfig().travelTime}</span></div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-lg overflow-hidden">
                          {isLoading ? (
                            <div className="w-full h-64 md:h-96 bg-gray-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500 mx-auto mb-2"></div>
                                <div className="text-gray-500">Calculating optimal route...</div>
                              </div>
                            </div>
                          ) : (
                            routeCoordinates.length > 0 ? (
                              <RouteMap 
                                coordinates={routeCoordinates}
                                startPoint={startPoint}
                                destination={destination}
                              />
                            ) : (
                              <img 
                                src={getMapConfig().image} 
                                alt="Route Map" 
                                className="w-full h-64 md:h-96 object-cover object-center"
                              />
                            )
                          )}
                        </div>
                        
                        <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                          <div className="font-medium text-sky-800 mb-2">Eco-friendly Transport Options</div>
                          <div className="text-sm text-gray-700">
                            {transportMode === 'eco' && 'Public Transportation & Shared Mobility'}
                            {transportMode === 'balanced' && 'Hybrid Vehicles & Mixed Transit'}
                            {transportMode === 'fast' && 'Electric Vehicles & Express Routes'}
                            {!['eco', 'balanced', 'fast'].includes(transportMode) && getMapConfig().transportType}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Form Navigation */}
                    <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between">
                      {step > 1 && (
                        <button 
                          type="button" 
                          onClick={handlePrevStep}
                          className="mt-3 sm:mt-0 w-full sm:w-auto bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                          Back
                        </button>
                      )}
                      
                      <div className="flex-1 sm:flex-none ml-auto">
                        {step < 3 ? (
                          <button 
                            type="button" 
                            onClick={handleNextStep}
                            className="w-full bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                          >
                            Next Step
                          </button>
                        ) : (
                          <button 
                            type="submit" 
                            className="w-full bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center justify-center"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                Creating Route...
                              </>
                            ) : (
                              'Create My Eco Route'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatBot />
      
      {/* Feedback messages */}
      {(error || routeSaved) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 max-w-md z-50"
        >
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 shadow-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Error Creating Route</h3>
                <p>{error}</p>
                <button 
                  onClick={() => setError('')}
                  className="text-red-600 text-sm mt-2 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {routeSaved && !error && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 shadow-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 010 1.414l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Route Created Successfully</h3>
                <p>Your eco-friendly route has been saved. You can view it in the Routes page.</p>
                <div className="flex mt-2 space-x-2">
                  <Link 
                    href="/routes" 
                    className="text-green-600 text-sm hover:text-green-800 font-medium"
                  >
                    View Routes
                  </Link>
                  <button 
                    onClick={() => setRouteSaved(false)}
                    className="text-green-600 text-sm hover:text-green-800"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

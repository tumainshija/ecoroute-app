'use client';
import { useState } from 'react';

export default function CarbonCalculator() {
  const [distance, setDistance] = useState('');
  const [transportMode, setTransportMode] = useState('car');
  const [result, setResult] = useState<number | null>(null);

  // Carbon emission factors in kg CO2 per km
  const emissionFactors = {
    car: 0.21,
    bus: 0.103,
    train: 0.041,
    plane: 0.255
  };

  const calculate = () => {
    const km = parseFloat(distance);
    if (isNaN(km)) return;
    
    const footprint = km * emissionFactors[transportMode as keyof typeof emissionFactors];
    setResult(footprint);
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-emerald-900 font-medium mb-2">Distance</label>
          <div className="relative">
            <input
              type="number"
              placeholder="Enter distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-emerald-950 font-medium"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-emerald-600">km</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-emerald-900 font-medium mb-2">Transportation Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${transportMode === 'car' ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-emerald-50'}`}
              onClick={() => setTransportMode('car')}
            >
              <div className="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-950">Car</span>
            </div>
            
            <div 
              className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${transportMode === 'bus' ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-emerald-50'}`}
              onClick={() => setTransportMode('bus')}
            >
              <div className="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-950">Bus</span>
            </div>
            
            <div 
              className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${transportMode === 'train' ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-emerald-50'}`}
              onClick={() => setTransportMode('train')}
            >
              <div className="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-950">Train</span>
            </div>
            
            <div 
              className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${transportMode === 'plane' ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-emerald-50'}`}
              onClick={() => setTransportMode('plane')}
            >
              <div className="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-950">Plane</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={calculate} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300"
        >
          Calculate Carbon Footprint
        </button>
      </div>
      
      {result !== null && (
        <div className="mt-6 bg-emerald-50 p-5 rounded-lg">
          <h4 className="text-lg font-semibold text-emerald-800 mb-2">Estimated Emissions</h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-emerald-700">{result.toFixed(2)}</span>
              <span className="text-emerald-700 ml-1">kg CO₂</span>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="text-sm text-emerald-600 font-medium">Want to offset this?</span>
              <a 
                href="/offset" 
                className="block mt-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-center font-medium transition-colors duration-300"
              >
                View Offset Options
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

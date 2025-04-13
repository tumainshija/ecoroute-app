'use client';

import ChatBot from '@/app/components/ChatBot';
import Footer from '@/app/components/Footer';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Link from 'next/link';
import { useState } from 'react';

export default function ARToursGetStartedPage() {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  
  const devices = [
    { id: 'smartphone', name: 'Smartphone', description: 'Most accessible option. Use your phone camera to view AR experiences.' },
    { id: 'ar-glasses', name: 'AR Glasses', description: 'Hands-free immersive experience with dedicated AR glasses.' },
    { id: 'tablet', name: 'Tablet', description: 'Larger screen for more detailed AR visualizations.' }
  ];
  
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
  };
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h3 className="text-2xl font-bold text-green-700 mb-6">Step 1: Choose Your Device</h3>
            <p className="text-gray-600 mb-8">
              Select the device you'll be using for your AR tours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {devices.map(device => (
                <div 
                  key={device.id}
                  className={`border rounded-xl p-6 cursor-pointer transition-all ${selectedDevice === device.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300'}`}
                  onClick={() => handleDeviceSelect(device.id)}
                >
                  <h4 className="text-xl font-semibold text-green-800 mb-2">{device.name}</h4>
                  <p className="text-gray-600">{device.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedDevice}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <h3 className="text-2xl font-bold text-green-700 mb-6">Step 2: Download Our App</h3>
            <p className="text-gray-600 mb-8">
              Our dedicated EcoRoute AR app provides the best experience for exploring cultural heritage sites.
            </p>
            
            <div className="bg-green-50 border border-green-100 rounded-xl p-8 mb-8">
              <h4 className="text-xl font-bold text-green-800 mb-2">EcoRoute AR</h4>
              <p className="text-gray-600 mb-4">
                Explore cultural heritage sites with augmented reality. Our app seamlessly blends digital information with real-world environments.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Download on App Store
                </a>
                <a href="#" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                  Get it on Google Play
                </a>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h3 className="text-2xl font-bold text-green-700 mb-6">Step 3: Choose Your Tour</h3>
            <p className="text-gray-600 mb-8">
              Browse our collection of culturally rich AR tours and select one to begin your journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-6">
                <h4 className="text-xl font-bold text-green-700 mb-2">Ancient Temple Tour</h4>
                <p className="text-gray-600 mb-4">
                  Explore ancient temples with AR overlays providing historical context and cultural significance.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  60-90 minutes • Bali, Indonesia
                </div>
                <Link
                  href="/ar-tours/bali-temples"
                  className="inline-flex items-center text-green-600 hover:text-green-700"
                >
                  Start this tour →
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-6">
                <h4 className="text-xl font-bold text-green-700 mb-2">Sustainable Market Tour</h4>
                <p className="text-gray-600 mb-4">
                  Discover local markets with AR features highlighting sustainable products and practices.
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  45-60 minutes • Dar es salaam, Tanzania
                </div>
                <Link
                  href="/ar-tours/marrakech-markets"
                  className="inline-flex items-center text-green-600 hover:text-green-700"
                >
                  Start this tour →
                </Link>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                Back
              </button>
              <Link
                href="/ar-tours"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Explore All Tours
              </Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-60 bg-green-800 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Started with AR Tours</h1>
              <p className="text-lg md:text-xl max-w-2xl">
                Follow these simple steps to begin your immersive cultural journey
              </p>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-12">
                <div className="p-8">
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-8">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}>
                        1
                      </div>
                      <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}>
                        2
                      </div>
                      <div className={`w-16 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}>
                        3
                      </div>
                    </div>
                  </div>
                  
                  {renderStepContent()}
                </div>
              </div>
              
              {/* FAQ Section */}
              <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8">
                <h2 className="text-2xl font-bold text-green-700 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">What devices support AR tours?</h3>
                    <p className="text-gray-600">
                      Most modern smartphones and tablets with cameras support our AR tours. For the best experience, 
                      we recommend devices running iOS 13+ or Android 8.0+.
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Do I need internet connection for the tours?</h3>
                    <p className="text-gray-600">
                      Initial download of tour content requires an internet connection. Once downloaded, most tour features 
                      work offline, though some real-time cultural information may require connectivity.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">How do these tours support cultural preservation?</h3>
                    <p className="text-gray-600">
                      A portion of tour proceeds goes directly to local cultural preservation efforts. Additionally, our AR 
                      technology helps document important cultural sites and practices for future generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </ProtectedRoute>
  );
} 
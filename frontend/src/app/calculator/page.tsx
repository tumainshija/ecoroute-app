'use client';

import CarbonCalculator from '@/app/components/CarbonCalculator';
import Footer from '@/app/components/Footer';

export default function Calculator() {
  return (
    <div className="flex flex-col min-h-screen bg-emerald-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-60 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/hero.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-800/30 to-emerald-900/80"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <span className="text-sm uppercase tracking-wider mb-2 bg-emerald-700/70 px-4 py-1 rounded-full">Environmental Impact</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Carbon Footprint Calculator</h1>
            <p className="text-lg max-w-2xl">
              Measure and reduce your travel&apos;s environmental impact
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-12">
              <div className="p-8">
                <span className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">EcoRoute Tools</span>
                <h2 className="text-3xl font-bold text-emerald-900 mt-2 mb-4">Measure Your Carbon Footprint</h2>
                <p className="text-emerald-700 mb-6">
                  Understanding your carbon footprint is the first step toward sustainable travel. 
                  Use our calculator to estimate the environmental impact of your journeys and explore 
                  greener alternatives with EcoRoute.
                </p>
                
                <CarbonCalculator />
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-8">
                  <span className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Impact Measurement</span>
                  <h2 className="text-3xl font-bold text-emerald-900 mt-2 mb-4">Your Green Journey Stats</h2>
                  <p className="text-emerald-700 mb-6">
                    EcoRoute measures and tracks your environmental impact each time you choose a sustainable route.
                    Join our community in making a positive difference through responsible travel choices.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-800 mb-1">2,458 kg</div>
                      <div className="text-sm text-emerald-600">Carbon Saved</div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-800 mb-1">12,400+</div>
                      <div className="text-sm text-emerald-600">EcoTravelers</div>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-100 p-8 flex items-center justify-center">
                  <div className="max-w-xs">
                    <h3 className="text-xl font-bold text-emerald-800 mb-4">Ready to plan your next eco-friendly trip?</h3>
                    <p className="text-emerald-700 mb-6">
                      Use our route planner to discover sustainable travel options that minimize your carbon footprint.
                    </p>
                    <a 
                      href="/planner" 
                      className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                    >
                      Plan Your Route
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

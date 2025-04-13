'use client';

import ChatBot from '@/app/components/ChatBot';
import Footer from '@/app/components/Footer';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Image from 'next/image';
import Link from 'next/link';

export default function ARToursPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-80 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/two.jpg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-green-800/30 to-green-900/80"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Digital Cultural Experiences</h1>
              <p className="text-lg md:text-xl max-w-2xl">
                Immersive AR tours that preserve and showcase cultural heritage
              </p>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-12">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-green-700 mb-6">Explore with Augmented Reality</h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Our AR tours provide immersive, educational experiences that bring cultural landmarks to life while 
                    promoting their preservation. Discover hidden stories, historical contexts, and sustainability 
                    information that enhances your travel experience while encouraging responsible tourism.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                      <div className="relative h-48">
                        <Image
                          src="/images/digital.jpg"
                          alt="Cultural Heritage Preservation"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Cultural Heritage Preservation</h3>
                        <p className="text-gray-600">
                          Our AR technology helps document and preserve cultural sites, creating digital records for future generations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                      <div className="relative h-48">
                        <Image
                          src="/images/ras.jpg"
                          alt="Local Community Engagement"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Local Community Voices</h3>
                        <p className="text-gray-600">
                          Listen to stories directly from local community members, supporting authentic cultural narratives.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                      <div className="relative h-48">
                        <Image
                          src="/images/african.jpg"
                          alt="Sustainable Tourism Education"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Sustainable Tourism Education</h3>
                        <p className="text-gray-600">
                          Learn about environmental conservation efforts and how to minimize your tourism impact.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Featured AR Experiences */}
              <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Featured AR Experiences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                  <div className="relative h-64">
                    <Image
                      src="/images/view.jpg"
                      alt="Ancient Temple AR Tour"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-2xl font-semibold mb-2">Ancient Temple AR Tour</h3>
                        <p className="opacity-90">Bali, Indonesia</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <p className="text-gray-600 mb-4">
                      Step back in time as you explore ancient Balinese temples with our AR guide. 
                      Learn about traditional construction techniques and the cultural significance 
                      of these sacred sites while supporting local preservation efforts.
                    </p>
                    <div className="mt-auto">
                      <Link
                        href="/ar-tours/bali-temples"
                        className="inline-flex items-center text-green-600 hover:text-green-700"
                      >
                        Explore this tour
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                  <div className="relative h-64">
                    <Image
                      src="/images/t.jpg"
                      alt="Sustainable Market Tour"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-2xl font-semibold mb-2">Sustainable Market Tour</h3>
                        <p className="opacity-90">Dar es salaam, Tanzania</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <p className="text-gray-600 mb-4">
                      Discover the historic markets of Marrakech with AR overlays that highlight 
                      sustainable products, traditional craftsmanship, and fair trade practices. 
                      Connect with local artisans and support the preservation of cultural crafts.
                    </p>
                    <div className="mt-auto">
                      <Link
                        href="/ar-tours/marrakech-markets"
                        className="inline-flex items-center text-green-600 hover:text-green-700"
                      >
                        Explore this tour
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Premium AR Features */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12 p-8">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Premium AR Features</h2>
                <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
                  Unlock the full potential of our augmented reality experiences with premium features designed to enhance your cultural exploration
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">HD Rendering</h3>
                    <p className="text-gray-600">High-definition cultural artifacts with detailed textures</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Expert Commentary</h3>
                    <p className="text-gray-600">Audio guides from historians and cultural experts</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Multi-device</h3>
                    <p className="text-gray-600">Sync your experience across phones, tablets and AR glasses</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Unlimited Access</h3>
                    <p className="text-gray-600">Access all premium AR tours with no restrictions</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link
                    href="/pricing"
                    className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                  >
                    See Premium Plans
                  </Link>
                </div>
              </div>
              
              {/* AR Launch Section */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12 p-8 text-center">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Launch AR Experience</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-600">
                  Try our augmented reality experience directly from your browser - no app download required.
                </p>
                <a
                  href="/ar-view"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                >
                  Launch AR Now
                </a>
              </div>
              
              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Experience Cultural Heritage in a New Way?</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Our AR tours combine cultural education, sustainability, and immersive experiences to 
                  create meaningful connections with destinations around the world.
                </p>
                <Link
                  href="/ar-tours/get-started"
                  className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Your AR Journey
                </Link>
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

import RegionalRoutes from '@/app/components/RegionalRoutes';
import Image from 'next/image';

export default function GlobalRoutesPage() {
  return (
    <main className="min-h-screen bg-green-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/global-routes.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-800/30 to-green-900/80"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fadeIn drop-shadow-xl leading-tight">
            Global EcoRoutes
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fadeIn drop-shadow-md max-w-3xl">
            Discover sustainable travel experiences across the world
          </p>
        </div>
      </section>

      {/* Global Routes Section */}
      <section className="py-16 px-6 md:px-16 -mt-20">
        <div className="max-w-7xl mx-auto">
          <RegionalRoutes />
        </div>
      </section>

      {/* Global Impact Statistics */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700">
            Our Global Impact
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg bg-green-50">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-700">Countries</p>
            </div>
            <div className="p-6 rounded-lg bg-green-50">
              <div className="text-4xl font-bold text-green-600 mb-2">500K+</div>
              <p className="text-gray-700">Routes Planned</p>
            </div>
            <div className="p-6 rounded-lg bg-green-50">
              <div className="text-4xl font-bold text-green-600 mb-2">100K+</div>
              <p className="text-gray-700">Tons CO₂ Saved</p>
            </div>
            <div className="p-6 rounded-lg bg-green-50">
              <div className="text-4xl font-bold text-green-600 mb-2">2M+</div>
              <p className="text-gray-700">Community Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-6 md:px-16 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700">
            Featured Sustainable Destinations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Copenhagen, Denmark',
                image: '/images/copenhagen.jpg',
                description: 'World leader in urban sustainability with carbon-neutral goals',
                rating: 95
              },
              {
                name: 'Costa Rica',
                image: '/images/costa-rica.jpg',
                description: 'Biodiversity hotspot with 98% renewable energy usage',
                rating: 93
              },
              {
                name: 'Kyoto, Japan',
                image: '/images/kyoto.jpg',
                description: 'Perfect blend of cultural preservation and environmental initiatives',
                rating: 90
              },
            ].map((destination, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                <div className="relative h-48">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-700">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-700">Eco Rating:</span>
                      <div className="ml-2 bg-green-100 text-green-800 font-bold text-xs px-2 py-1 rounded-full">
                        {destination.rating}/100
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-800 font-medium text-sm">
                      View Routes →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 
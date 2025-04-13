'use client';

import ChatBot from '@/app/components/ChatBot';
import Footer from '@/app/components/Footer';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly');
  };
  
  const featuredPlan = 'pro';
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Access to essential features',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Basic route planning',
        'Carbon footprint calculator',
        'Community forums access',
        'Basic AR experiences'
      ],
      buttonText: 'Continue with Basic',
      buttonClass: 'bg-white border border-green-600 text-green-600 hover:bg-green-50'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Enhanced features for serious travelers',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        'All Basic features',
        'Premium AR cultural experiences',
        'HD cultural artifact models',
        'Offline access to AR content',
        'Priority customer support'
      ],
      buttonText: 'Get Pro',
      buttonClass: 'bg-green-600 text-white hover:bg-green-700'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Complete access for cultural enthusiasts',
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      features: [
        'All Pro features',
        'Expert guided AR tours',
        'Cultural preservation contribution',
        'Multi-device synchronization',
        'Community partnerships',
        'Early access to new features'
      ],
      buttonText: 'Get Premium',
      buttonClass: 'bg-white border border-green-600 text-green-600 hover:bg-green-50'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <main className="flex-grow">
          {/* Header */}
          <section className="relative py-20 bg-gradient-to-r from-green-700 to-green-800">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your EcoRoute Experience</h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto">
                  Select the plan that best fits your sustainable travel needs, with premium AR features for enhanced cultural experiences
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              {/* Billing toggle */}
              <div className="flex justify-center items-center mb-12">
                <span className={`text-lg ${billingCycle === 'monthly' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button 
                  onClick={toggleBillingCycle}
                  className="relative inline-flex h-8 w-16 mx-4 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span 
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-lg ${billingCycle === 'annual' ? 'text-green-700 font-semibold' : 'text-gray-500'}`}>
                  Annual <span className="text-sm text-green-600 ml-1">(Save 15%)</span>
                </span>
              </div>
              
              {/* Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                      plan.id === featuredPlan ? 'ring-2 ring-green-500 transform md:scale-105' : ''
                    }`}
                  >
                    {plan.id === featuredPlan && (
                      <div className="bg-green-500 text-white text-center py-2 font-semibold">
                        Recommended
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-green-700 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-6">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900">
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                        </span>
                        {plan.monthlyPrice > 0 && (
                          <span className="text-gray-500 ml-2">
                            / {billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full py-3 px-4 rounded-full font-semibold transition-colors ${plan.buttonClass}`}
                      >
                        {plan.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* AR Features Highlight */}
          <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Premium AR Features</h2>
              <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                Our premium plans unlock the full potential of augmented reality for cultural exploration
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">HD Cultural Artifacts</h3>
                  <p className="text-gray-600">
                    Experience high-definition 3D models of cultural artifacts with detailed textures and interactive elements.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Live Cultural Guides</h3>
                  <p className="text-gray-600">
                    Connect with local experts who provide real-time insights during your AR tours, sharing authentic stories.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Multi-device Access</h3>
                  <p className="text-gray-600">
                    Synchronize your AR experiences across all your devices, from smartphones to AR glasses.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Offline Access</h3>
                  <p className="text-gray-600">
                    Download AR experiences to access them without internet connection while traveling.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Preservation Contribution</h3>
                  <p className="text-gray-600">
                    A portion of your subscription goes directly to cultural preservation efforts in featured communities.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Advanced Customization</h3>
                  <p className="text-gray-600">
                    Personalize your AR tours based on your interests, preferred depth of information, and pace.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* FAQs */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Can I switch plans later?</h3>
                  <p className="text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">What devices support the AR features?</h3>
                  <p className="text-gray-600">
                    Our AR features work on most modern smartphones and tablets. For the best experience, we recommend devices with AR capabilities running iOS 13+ or Android 8.0+.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">How do I access premium AR content?</h3>
                  <p className="text-gray-600">
                    After subscribing to a premium plan, all premium AR experiences will be automatically unlocked in your account. Simply navigate to the AR Tours section to explore all available content.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-600">
                    We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with your experience, contact our support team within 14 days of your purchase for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA */}
          <section className="py-16 px-6 bg-gradient-to-r from-green-700 to-green-800 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Cultural Experience?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Upgrade to a premium plan today and unlock the full potential of our AR cultural experiences
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/ar-tours"
                  className="px-8 py-3 bg-white text-green-700 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Explore AR Tours
                </Link>
                <Link
                  href="/ar-view"
                  className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
                >
                  Try AR Demo
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
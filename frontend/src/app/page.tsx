'use client';

import ChatBot from '@/app/components/ChatBot';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to determine the correct link destination based on authentication
  const getProtectedLink = (path: string) => {
    return isAuthenticated ? path : '/login';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to localStorage first (client-side storage)
      const newMessage = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        id: `msg_${Date.now()}`,
        status: 'unread',
        sentAt: new Date().toISOString()
      };
      
      // Get existing messages from localStorage
      const existingMessages = localStorage.getItem('contactMessages');
      let messages = existingMessages ? JSON.parse(existingMessages) : [];
      
      // Add new message to beginning of array
      messages = [newMessage, ...messages];
      
      // Save back to localStorage
      localStorage.setItem('contactMessages', JSON.stringify(messages));
      
      // Then make the API call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          sentAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        setSubmitStatus({
          submitted: true,
          success: true,
          message: 'Your message has been sent successfully!'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'There was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/hero.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-800/10 to-green-900/80"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-fadeIn drop-shadow-xl leading-tight">
              Welcome to EcoRoute
            </h1>
            <p className="text-xl md:text-3xl mb-8 animate-fadeIn drop-shadow-md max-w-2xl">
              Sustainable tourism and cultural preservation through eco-friendly travel
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={getProtectedLink('/planner')}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                Start Planning
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="text-green-100 hover:text-white border border-green-200 px-6 py-3 rounded-full transition-colors duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6 md:px-16 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-green-100 absolute -top-6 -left-6 w-full h-full rounded-xl"></div>
              <div className="bg-green-200 absolute -bottom-6 -right-6 w-full h-full rounded-xl"></div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/green.jpg" 
                  alt="EcoRoute Team" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-700">Revolutionizing Travel</h2>
              <p className="text-lg text-gray-700 mb-6">
                EcoRoute delivers cutting-edge solutions that transform the travel landscape through 
                sustainable tourism and cultural preservation. Our platform leverages advanced digital 
                infrastructure to create exceptional eco-friendly journeys and immersive experiences.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Strategically aligned with the United Nations Sustainable Development Goals (SDGs), 
                our innovative approach supports SDG 9 (Industry, Innovation, and Infrastructure) and 
                SDG 11 (Sustainable Cities and Communities) while maximizing value for all stakeholders.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
              >
                Learn More About Us
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-16 bg-green-50">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-700">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '/images/route-icon.svg',
                title: 'Eco-Friendly Routes',
                desc:
                  'AI-driven suggestions for routes and modes of transport with the lowest carbon footprint.',
                href: '/routes',
              },
              {
                icon: '/images/culture-icon.svg',
                title: 'Digital Cultural Experiences',
                desc:
                  'AR-enabled cultural tours that provide immersive, informative, and accessible experiences.',
                href: '/ar-tours',
              },
              {
                icon: '/images/carbon-icon.svg',
                title: 'Carbon Calculator',
                desc:
                  'Measure and manage your carbon emissions with our intuitive calculator for each journey.',
                href: '/calculator',
              },
            ].map(({ icon, title, desc, href }, i) => (
              <Link
                key={i}
                href={getProtectedLink(href)}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 text-center hover:scale-105 transform"
              >
                <Image
                  src={icon}
                  alt={title}
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="text-2xl font-semibold mb-2 text-green-700">
                  {title}
                </h3>
                <p className="text-gray-600">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-green-800 to-green-900 text-white">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            AI-Powered Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
              <h3 className="text-2xl font-semibold mb-4">AI Digital Cultural Experiences</h3>
              <p className="mb-6 text-lg">
                Explore immersive augmented reality (AR) tours that bring cultural landmarks to life. 
                Our AR features provide historical context and engaging information, making cultural 
                heritage accessible to diverse audiences while promoting preservation.
              </p>
              <Link 
                href={getProtectedLink('/ar-experiences')}
                className="inline-flex items-center px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full transition duration-300"
              >
                Discover AR Tours
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
              <h3 className="text-2xl font-semibold mb-4">Smart Itinerary Planning</h3>
              <p className="mb-6 text-lg">
                Our personalized itinerary builder integrates real-time data on environmental conditions 
                and cultural events. We collaborate with local businesses to promote eco-friendly 
                services and authentic cultural experiences that benefit local communities.
              </p>
              <Link 
                href={getProtectedLink('/itinerary')}
                className="inline-flex items-center px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full transition duration-300"
              >
                Plan Your Journey
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem We Solve Section */}
        <section className="py-20 px-6 md:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-700">
              Transforming Tourism Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Environmental Degradation</h3>
                <p className="text-gray-700">
                  Traditional tourism contributes to excessive carbon emissions and resource consumption. 
                  EcoRoute offers sustainable alternatives to minimize environmental impact.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Cultural Erosion</h3>
                <p className="text-gray-700">
                  Many travelers have limited access to authentic cultural experiences. Our platform 
                  preserves and promotes cultural heritage through technology.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Inequitable Tourism Benefits</h3>
                <p className="text-gray-700">
                  Local communities often don&apos;t benefit from tourism. EcoRoute&apos;s community-centric 
                  approach ensures tourism benefits are distributed equitably.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-neutral-100 py-20 px-6 md:px-16">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-700">
            What Our Users Say
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-10">
            {[
              {
                quote:
                  "EcoRoute has transformed the way I travel. It's easy to use and helps me stay eco-conscious.",
                name: 'Alex, EcoRoute User',
              },
              {
                quote:
                  'The AR tours are fantastic! I love exploring new places with EcoRoute.',
                name: 'Jamie, EcoRoute User',
              },
            ].map(({ quote, name }, i) => (
              <blockquote
                key={i}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 max-w-md"
              >
                <p className="text-gray-700 text-lg leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-4 text-sm text-gray-500">– {name}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Global Impact Section - NEW */}
        <section className="py-20 px-6 md:px-16 bg-white">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-700">
            Global Impact
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-green-700">Supporting Worldwide Sustainable Tourism</h3>
              <p className="text-lg text-gray-700 mb-6">
                EcoRoute is available in over 50 countries, supporting the United Nations Sustainable Development Goals
                by promoting eco-friendly tourism across diverse cultural landscapes.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Carbon Offset</p>
                    <p className="text-sm text-gray-600">100,000+ tons offset annually</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Local Partners</p>
                    <p className="text-sm text-gray-600">5,000+ worldwide</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Cultural Sites</p>
                    <p className="text-sm text-gray-600">10,000+ preserved</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Active Users</p>
                    <p className="text-sm text-gray-600">2M+ monthly active users</p>
                  </div>
                </div>
              </div>
              <Link
                href="/impact"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
              >
                View Impact Report
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-green-800/10 absolute -top-6 -right-6 w-4/5 h-4/5 rounded-xl"></div>
              <Image
                src="/images/world-map.jpg"
                alt="Global Impact Map"
                width={600}
                height={400}
                className="rounded-xl shadow-lg relative z-10"
              />
            </div>
          </div>
        </section>

        {/* New Features Preview - NEW */}
        <section className="py-20 px-6 md:px-16 bg-green-50">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-green-700">
            New Global Features
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-green-700">Climate-Aware Routing</h3>
              <p className="text-gray-600 mb-6">
                Our AI analyzes real-time climate data to suggest routes that adapt to changing environmental conditions, reducing your carbon footprint while ensuring comfortable travel.
              </p>
              <Link href="/climate-routing" className="text-green-600 hover:text-green-800 font-medium">
                Learn more →
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-green-700">Virtual Cultural Exchange</h3>
              <p className="text-gray-600 mb-6">
                Connect with locals through our virtual platform before your trip. Learn about customs, language, and traditions directly from community members for an authentic experience.
              </p>
              <Link href="/virtual-exchange" className="text-green-600 hover:text-green-800 font-medium">
                Learn more →
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-green-700">Community Investment</h3>
              <p className="text-gray-600 mb-6">
                A portion of every booking supports local sustainability projects. Track your contributions and see the direct impact of your travel on communities worldwide.
              </p>
              <Link href="/community-investment" className="text-green-600 hover:text-green-800 font-medium">
                Learn more →
              </Link>
            </div>
          </div>
        </section>

        {/* Community Forum Section - NEW */}
        <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-green-800 to-green-900 text-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              Community Forum
            </h2>
            <div className="text-center mb-8">
              <p className="text-xl max-w-3xl mx-auto">
                Share your sustainable travel experiences, connect with like-minded travelers, 
                and discover authentic recommendations from our global community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Sample Forum Posts */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden mr-4">
                    <Image src="/images/avatar1.jpg" width={40} height={40} alt="User Avatar" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah M.</h4>
                    <p className="text-sm opacity-70">2 days ago</p>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-3">My Zero-Waste Safari Experience</h3>
                <p className="mb-4 text-white/80">
                  Just returned from an amazing eco-safari in Tanzania. Here&apos;s how I managed to keep it completely zero-waste while still enjoying the full experience...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      128
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      42
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-600 rounded-full text-sm">Eco Travel</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden mr-4">
                    <Image src="/images/avatar2.jpg" width={40} height={40} alt="User Avatar" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Marcus T.</h4>
                    <p className="text-sm opacity-70">5 days ago</p>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-3">Cultural Immersion in Zanzibar</h3>
                <p className="mb-4 text-white/80">
                  My AR-guided cultural tour through Stone Town was incredible! The app highlighted hidden historical gems and connected me with local artisans...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      95
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      36
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-600 rounded-full text-sm">Cultural</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden mr-4">
                    <Image src="/images/avatar3.jpg" width={40} height={40} alt="User Avatar" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Amina J.</h4>
                    <p className="text-sm opacity-70">1 week ago</p>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-3">Local Community Support Initiative</h3>
                <p className="mb-4 text-white/80">
                  I used EcoRoute to find and volunteer with a coastal cleanup project in Dar es Salaam. The experience was rewarding and I made lifelong connections...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      203
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      78
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-600 rounded-full text-sm">Community</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                href={getProtectedLink('/forum')}
                className="inline-flex items-center px-8 py-3 bg-white text-green-800 rounded-full hover:bg-green-100 transition duration-300 shadow-lg"
              >
                Join Our Community Forum
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6 md:px-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-green-700">
              Get In Touch
            </h2>
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-green-700 p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-medium">Address</p>
                        <p>123 Eco Street, Dar es Salaam</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium">Email</p>
                        <p>shija@ecoroute.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p>+255 627 458 603</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h4 className="text-xl font-medium mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a href="#" className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                        </svg>
                      </a>
                      <a href="#" className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat-square-text" viewBox="0 0 16 16">
                          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                          <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-green-700">Send a Message</h3>
                  {submitStatus.submitted ? (
                    <div className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <p className="font-medium">{submitStatus.message}</p>
                      {submitStatus.success && (
                        <button
                          onClick={() => setSubmitStatus({ submitted: false, success: false, message: '' })}
                          className="mt-4 text-green-600 hover:text-green-800 font-medium"
                        >
                          Send another message
                        </button>
                      )}
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea 
                          id="message" 
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="How can we help you?"
                          required
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

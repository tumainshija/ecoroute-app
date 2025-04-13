'use client';

import ChatBot from '@/app/components/ChatBot';
import Footer from '@/app/components/Footer';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

export default function ARViewPage() {
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if WebXR is supported in this browser
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then((supported) => {
          setArSupported(supported);
        })
        .catch(() => {
          setArSupported(false);
        });
    } else {
      setArSupported(false);
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded && sceneRef.current && arActive) {
      initSimpleARScene();
    }
  }, [scriptLoaded, arActive]);

  const initSimpleARScene = () => {
    if (typeof window === 'undefined' || !window.THREE) return;
    
    const THREE = window.THREE;
    
    // Clear any existing content
    if (sceneRef.current) {
      sceneRef.current.innerHTML = '';
    }
    
    // Create simple artifact display
    const artifactContainer = document.createElement('div');
    artifactContainer.className = 'artifact-container';
    artifactContainer.style.cssText = 'position:relative; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white;';
    
    // Create canvas for AR view (simulated)
    const canvas = document.createElement('canvas');
    canvas.width = sceneRef.current?.clientWidth || 600;
    canvas.height = (sceneRef.current?.clientHeight || 600) - 100;
    canvas.style.cssText = 'background:linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)); border:1px solid #555; border-radius:8px;';
    
    // Add canvas to container
    artifactContainer.appendChild(canvas);
    
    // Create artifact info section
    const infoSection = document.createElement('div');
    infoSection.className = 'info-section';
    infoSection.style.cssText = 'margin-top:20px; background:rgba(0,0,0,0.4); padding:15px; border-radius:8px; max-width:90%; text-align:left;';
    
    infoSection.innerHTML = `
      <h3 style="margin:0 0 10px; font-size:18px; color:#fff;">Ancient Wooden Artifact</h3>
      <p style="margin:0 0 8px; font-size:14px; color:#ddd;">Origin: Tanzania, East Africa</p>
      <p style="margin:0; font-size:14px; color:#ddd;">Cultural Significance: Used in traditional ceremonies</p>
    `;
    
    // Add info section to container
    artifactContainer.appendChild(infoSection);
    
    // Add buttons for interaction
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display:flex; gap:10px; margin-top:15px;';
    
    const rotateButton = document.createElement('button');
    rotateButton.innerText = 'Rotate View';
    rotateButton.style.cssText = 'padding:8px 15px; background:#4CAF50; color:white; border:none; border-radius:4px; cursor:pointer;';
    
    const infoButton = document.createElement('button');
    infoButton.innerText = 'More Info';
    infoButton.style.cssText = 'padding:8px 15px; background:#2196F3; color:white; border:none; border-radius:4px; cursor:pointer;';
    
    buttonContainer.appendChild(rotateButton);
    buttonContainer.appendChild(infoButton);
    
    artifactContainer.appendChild(buttonContainer);
    
    // Simple animation/interaction
    let rotation = 0;
    let infoExpanded = false;
    
    rotateButton.addEventListener('click', () => {
      rotation += 45;
      canvas.style.transform = `rotateY(${rotation}deg)`;
      canvas.style.transition = 'transform 0.5s ease';
    });
    
    infoButton.addEventListener('click', () => {
      infoExpanded = !infoExpanded;
      if (infoExpanded) {
        infoSection.innerHTML += `
          <div style="margin-top:10px; padding-top:10px; border-top:1px solid #555;">
            <p style="margin:0 0 8px; font-size:14px; color:#ddd;">Age: Approximately 150 years old</p>
            <p style="margin:0 0 8px; font-size:14px; color:#ddd;">Materials: Hand-carved hardwood with natural pigments</p>
            <p style="margin:0; font-size:14px; color:#ddd;">Conservation Status: Preserved using traditional techniques</p>
          </div>
        `;
        infoButton.innerText = 'Less Info';
      } else {
        infoSection.innerHTML = `
          <h3 style="margin:0 0 10px; font-size:18px; color:#fff;">Ancient Wooden Artifact</h3>
          <p style="margin:0 0 8px; font-size:14px; color:#ddd;">Origin: Tanzania, East Africa</p>
          <p style="margin:0; font-size:14px; color:#ddd;">Cultural Significance: Used in traditional ceremonies</p>
        `;
        infoButton.innerText = 'More Info';
      }
    });
    
    // Add to scene ref
    if (sceneRef.current) {
      sceneRef.current.appendChild(artifactContainer);
    }
    
    // Draw simple artifact on canvas (just for visualization)
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw artifact silhouette
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.ellipse(canvas.width/2, canvas.height/2, 80, 150, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add details
      ctx.strokeStyle = '#5D2906';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(canvas.width/2, canvas.height/2, 60, 130, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Add patterns
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, canvas.height/2 - 120);
        ctx.lineTo(canvas.width/2 + 70 * Math.cos(i * Math.PI/4), canvas.height/2 + 70 * Math.sin(i * Math.PI/4));
        ctx.stroke();
      }
    }
  };

  const startAR = async () => {
    if (!arSupported && window.confirm("This device doesn't fully support WebXR AR. Would you like to try our simplified AR experience instead?")) {
      setArActive(true);
    } else if (arSupported) {
      setArActive(true);
    }
  };

  const stopAR = () => {
    setArActive(false);
  };

  return (
    <ProtectedRoute>
      <>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          onLoad={() => setScriptLoaded(true)}
        />
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
          <main className="flex-grow">
            {/* Header */}
            <section className="relative h-60 bg-green-800 flex items-center justify-center">
              <div className="text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple AR Experience</h1>
                <p className="text-lg md:text-xl max-w-2xl">
                  Explore cultural artifacts in augmented reality
                </p>
              </div>
            </section>

            {/* AR Content */}
            <section className="py-12 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8 text-center mb-8">
                  {arActive ? (
                    <div className="ar-view-container relative" style={{ height: '600px', background: '#000' }}>
                      <div ref={sceneRef} className="w-full h-full"></div>
                      <button
                        onClick={stopAR}
                        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 z-10"
                      >
                        Exit AR View
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-green-700 mb-6">View Cultural Artifacts in AR</h2>
                      
                      <p className="text-gray-600 mb-8">
                        Explore traditional artifacts from around the world using your device.
                        Our simple AR experience lets you view cultural objects up close.
                      </p>
                      
                      <button
                        onClick={startAR}
                        className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors"
                      >
                        Start AR Experience
                      </button>
                    </>
                  )}
                </div>
                
                {/* Instructions */}
                {!arActive && (
                  <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8 mb-8">
                    <h3 className="text-2xl font-bold text-green-700 mb-4">About This Experience</h3>
                    <p className="text-gray-600 mb-4">
                      Our simple AR experience allows you to view cultural artifacts in a simulated augmented reality environment.
                      You can explore the artifact details, rotate the view, and learn about its cultural significance.
                    </p>
                    <p className="text-gray-600">
                      This experience works on most devices, even those without full AR capabilities.
                    </p>
                  </div>
                )}
                
                {/* Premium Features Section */}
                {!arActive && (
                  <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-lg p-8 text-white mb-8">
                    <h3 className="text-2xl font-bold mb-4">Premium EcoRoute AR Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/10 p-5 rounded-lg">
                        <h4 className="font-semibold text-xl mb-2">Live Cultural Guides</h4>
                        <p className="text-white/90">
                          Access expert cultural guides who provide real-time insights during your AR experience
                        </p>
                      </div>
                      <div className="bg-white/10 p-5 rounded-lg">
                        <h4 className="font-semibold text-xl mb-2">Interactive 3D Models</h4>
                        <p className="text-white/90">
                          Explore detailed 3D models of historical artifacts you can manipulate and examine up close
                        </p>
                      </div>
                      <div className="bg-white/10 p-5 rounded-lg">
                        <h4 className="font-semibold text-xl mb-2">Offline Access</h4>
                        <p className="text-white/90">
                          Download AR experiences for offline viewing while traveling in areas with limited connectivity
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <Link
                        href="/pricing"
                        className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Upgrade to Premium
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Back button */}
                <div className="text-center">
                  <Link
                    href="/ar-tours"
                    className="inline-flex items-center text-green-600 hover:text-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to AR Tours
                  </Link>
                </div>
              </div>
            </section>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </>
    </ProtectedRoute>
  );
} 
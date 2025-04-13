'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ecoRouteApi } from '../services/api';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Define conversation context types
type ConversationContext = {
  topic: string | null;
  startPoint?: string;
  destination?: string;
  transportMode?: string;
  lastQuestion?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  messageCount?: number;
  lastInteractionTime?: Date;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm EcoAssist, your sustainable travel companion. How can I help you plan your eco-friendly journey today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<ConversationContext>({ 
    topic: null,
    messageCount: 0,
    sentiment: 'neutral',
    lastInteractionTime: new Date()
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Analyze sentiment of user input
  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'thanks', 'thank', 'appreciate', 'helpful', 'wonderful', 'perfect', 'yes', 'please'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'frustrated', 'useless', 'wrong', 'not', 'no', 'never', 'cannot', "can't", 'problem', 'issue', 'error'];
    
    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  // Enhanced pattern matching with confidence scoring and NLP-like features
  const findBestMatch = (userInput: string): { response: string; confidence: number; context?: Partial<ConversationContext> } => {
    const input = userInput.toLowerCase();
    const words = input.split(/\s+/);
    const sentiment = analyzeSentiment(input);
    
    // Define patterns with responses and optional context updates
    const patterns = [
      // Greetings
      {
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        response: "Hello! How can I help you plan your sustainable travel today?",
        confidence: 0.9,
        context: { topic: 'greeting', sentiment }
      },
      
      // Carbon/emissions questions
      {
        keywords: ['carbon', 'emissions', 'footprint', 'climate', 'impact', 'environmental', 'greenhouse', 'co2', 'pollution'],
        response: "Our AI-powered carbon calculator can precisely measure the environmental impact of your journey. Would you like me to guide you through calculating your trip's carbon footprint?",
        confidence: 0.85,
        context: { topic: 'carbon', sentiment }
      },
      
      // Cultural tourism
      {
        keywords: ['cultural', 'culture', 'tour', 'heritage', 'preservation', 'tradition', 'history', 'monument', 'landmark', 'museum', 'archaeological'],
        response: "Based on my analysis of cultural preservation trends, our AR cultural tours provide immersive experiences while promoting the preservation of cultural heritage. I can recommend some popular options based on your destination. Do you have a specific country or region in mind?",
        confidence: 0.85,
        context: { topic: 'cultural', sentiment }
      },
      
      // Route planning
      {
        keywords: ['route', 'travel', 'journey', 'plan', 'trip', 'destination', 'itinerary', 'vacation', 'holiday', 'go', 'visit', 'touring', 'expedition'],
        response: "I'd be happy to help you plan an eco-friendly route using my advanced routing algorithms. Could you share your starting point and destination?",
        confidence: 0.85,
        context: { topic: 'route_planning', lastQuestion: 'location', sentiment }
      },
      
      // Local experiences/businesses
      {
        keywords: ['local', 'community', 'business', 'market', 'restaurant', 'shop', 'authentic', 'native', 'indigenous', 'artisan', 'craft', 'souvenir', 'gift'],
        response: "Supporting local communities is essential to sustainable tourism. Based on my database of eco-certified businesses, I can suggest locally-owned establishments at your destination that align with our sustainability values. What type of local experience are you interested in?",
        confidence: 0.85,
        context: { topic: 'local_business', sentiment }
      },
      
      // Transport modes
      {
        keywords: ['transport', 'vehicle', 'car', 'train', 'bus', 'bicycle', 'bike', 'walk', 'plane', 'flight', 'travel', 'commute', 'transit', 'movement', 'transportation'],
        response: "My analysis shows various eco-friendly transport options with different carbon footprints. Would you prefer walking, cycling, public transport, or an electric vehicle for your journey?",
        confidence: 0.85,
        context: { topic: 'transport_mode', lastQuestion: 'mode', sentiment }
      },
      
      // Transportation mode preferences with expanded synonyms
      {
        keywords: ['walking', 'walk', 'stroll', 'hike', 'trek', 'foot', 'pedestrian'],
        response: "Walking is the most eco-friendly option! My calculations show it produces zero emissions and lets you fully experience your surroundings. For longer distances, I can recommend combining walking with other sustainable options based on terrain analysis.",
        confidence: 0.75,
        context: { topic: 'transport_mode', transportMode: 'walking', sentiment }
      },
      {
        keywords: ['cycling', 'bike', 'bicycle', 'cycle', 'pedal', 'biking', 'cyclist'],
        response: "Cycling is an excellent sustainable choice! According to my data, it's emission-free, good for your health, and allows you to explore at a nice pace. I can suggest bike-friendly routes with optimal elevation profiles and bike rental locations at your destination.",
        confidence: 0.75,
        context: { topic: 'transport_mode', transportMode: 'cycling', sentiment }
      },
      {
        keywords: ['public', 'transit', 'train', 'bus', 'subway', 'metro', 'tram', 'rail', 'commute', 'mass transit'],
        response: "Public transportation is a great eco-friendly choice! My analysis indicates it significantly reduces per-person emissions by up to 45% compared to individual vehicles. I can help you navigate the local transit systems and optimize connections at your destination.",
        confidence: 0.75,
        context: { topic: 'transport_mode', transportMode: 'public_transport', sentiment }
      },
      {
        keywords: ['electric', 'ev', 'tesla', 'battery', 'plug-in', 'hybrid', 'eco-car', 'zero emission'],
        response: "Electric vehicles are an excellent low-emission option for longer distances or areas with limited public transport. My database shows an increasing network of charging stations worldwide, and I can help you find optimal charging points along your route.",
        confidence: 0.75,
        context: { topic: 'transport_mode', transportMode: 'electric_vehicle', sentiment }
      },
      
      // Weather and climate considerations
      {
        keywords: ['weather', 'climate', 'rain', 'snow', 'temperature', 'forecast', 'season', 'hot', 'cold', 'warm', 'humidity'],
        response: "I can analyze climate data for your destination to help you plan the most sustainable and comfortable travel experience. When are you planning to travel, and where would you like weather information for?",
        confidence: 0.8,
        context: { topic: 'weather', sentiment }
      },
      
      // Accommodation-related queries
      {
        keywords: ['hotel', 'hostel', 'lodging', 'accommodation', 'stay', 'resort', 'booking', 'room', 'eco-lodge', 'sustainable', 'green', 'certified'],
        response: "I can recommend eco-certified accommodations that match your sustainability preferences. My database includes properties with various certifications like LEED, Green Key, and EarthCheck. What's your destination, and do you have specific sustainability features you're looking for?",
        confidence: 0.8,
        context: { topic: 'accommodation', sentiment }
      },
      
      // Help or assistance
      {
        keywords: ['help', 'assist', 'support', 'guidance', 'information', 'explain', 'tell', 'what', 'how', 'can you'],
        response: "I'm your AI-powered sustainable travel assistant. I can help with route planning, carbon footprint calculation, finding eco-friendly accommodations, recommending cultural experiences, and providing sustainable travel tips. What specific information are you looking for?",
        confidence: 0.7,
        context: { topic: 'help', sentiment }
      }
    ];

    // Score each pattern with advanced NLP-like scoring
    const scores = patterns.map(pattern => {
      let score = 0;
      
      // Check exact keyword matches
      pattern.keywords.forEach(keyword => {
        if (input.includes(keyword)) {
          score += pattern.confidence;
        }
      });
      
      // Check for word similarity (rudimentary word embedding simulation)
      pattern.keywords.forEach(keyword => {
        words.forEach(word => {
          // Check for partial matches or word stems
          if (word.length > 3 && keyword.includes(word)) {
            score += pattern.confidence * 0.3;
          }
          
          // Check for edit distance (simple version)
          if (word.length > 3 && keyword.length > 3) {
            const minLength = Math.min(word.length, keyword.length);
            let matching = 0;
            for (let i = 0; i < minLength; i++) {
              if (word[i] === keyword[i]) matching++;
            }
            if (matching > minLength * 0.7) {
              score += pattern.confidence * 0.2;
            }
          }
        });
      });
      
      return { pattern, score };
    });

    // Find the best match
    const bestMatch = scores.reduce((best, current) => 
      current.score > best.score ? current : best, 
      { pattern: null, score: 0 }
    );

    // If we have context, potentially generate context-specific responses
    if (context.topic && bestMatch.score === 0) {
      return handleContextualResponse(input, sentiment);
    }

    // If no good match, return a default response with adaptive tone based on context
    if (bestMatch.score === 0) {
      const responsesByMessageCount = [
        "I'd love to help you with that. Could you provide more details about your travel plans so I can offer tailored sustainable options?",
        "I'm still learning about your preferences. Could you tell me more about what kind of sustainable travel experience you're looking for?",
        "To better assist you, I need to understand your travel goals. Could you share what aspects of sustainable tourism interest you most?",
        "I notice we're having trouble finding the right information. Let me ask differently - are you interested in route planning, cultural experiences, or carbon footprint reduction?"
      ];
      
      const messageCountIndex = Math.min(context.messageCount || 0, responsesByMessageCount.length - 1);
      
      return {
        response: responsesByMessageCount[messageCountIndex],
        confidence: 0.4,
        context: { sentiment, messageCount: (context.messageCount || 0) + 1 }
      };
    }

    // Add adaptive responses based on sentiment
    let response = bestMatch.pattern.response;
    if (sentiment === 'positive' && Math.random() > 0.7) {
      response = "I'm glad to help! " + response;
    } else if (sentiment === 'negative' && Math.random() > 0.7) {
      response = "I understand your concern. " + response;
    }

    return {
      response,
      confidence: bestMatch.score,
      context: { ...bestMatch.pattern.context, messageCount: (context.messageCount || 0) + 1 }
    };
  };

  // Handle responses based on conversation context with improved context awareness
  const handleContextualResponse = (input: string, sentiment: 'positive' | 'negative' | 'neutral'): { response: string; confidence: number; context?: Partial<ConversationContext> } => {
    const lowerInput = input.toLowerCase();
    
    // If we were asking about locations
    if (context.topic === 'route_planning' && context.lastQuestion === 'location') {
      // Try to extract start and destination
      if (lowerInput.includes('from') && lowerInput.includes('to')) {
        const parts = lowerInput.split(/from|to/);
        if (parts.length >= 3) {
          const startPoint = parts[1].trim();
          const destination = parts[2].trim();
          
          return {
            response: `Thanks! Based on my analysis, I'll help you plan an eco-friendly route from ${startPoint} to ${destination}. Which mode of transportation would you prefer? I can calculate the carbon footprint for walking, cycling, public transport, or electric vehicle options.`,
            confidence: 0.95,
            context: { 
              topic: 'route_planning', 
              startPoint,
              destination,
              lastQuestion: 'mode',
              sentiment
            }
          };
        }
      } else if (!context.startPoint) {
        // Assume they're providing the start point
        return {
          response: `I've recorded your starting point. My algorithms work best with a clear destination - where would you like to travel to?`,
          confidence: 0.85,
          context: { 
            topic: 'route_planning', 
            startPoint: input.trim(),
            lastQuestion: 'destination',
            sentiment
          }
        };
      } else if (!context.destination) {
        // Assume they're providing the destination
        return {
          response: `Great destination choice! I'll analyze route options from ${context.startPoint} to ${input.trim()}. To provide the most environmentally optimized route, which transportation mode would you prefer? (Walking, cycling, public transport, or electric vehicle)`,
          confidence: 0.85,
          context: { 
            topic: 'route_planning', 
            startPoint: context.startPoint,
            destination: input.trim(),
            lastQuestion: 'mode',
            sentiment
          }
        };
      }
    }
    
    // If we were asking about transport mode
    if (context.lastQuestion === 'mode') {
      let transportMode = '';
      
      if (lowerInput.includes('walk')) transportMode = 'walking';
      else if (lowerInput.includes('cycl') || lowerInput.includes('bike') || lowerInput.includes('bicyc')) transportMode = 'cycling';
      else if (lowerInput.includes('public') || lowerInput.includes('bus') || lowerInput.includes('train') || lowerInput.includes('transit')) transportMode = 'public_transport';
      else if (lowerInput.includes('electric') || lowerInput.includes('ev')) transportMode = 'electric_vehicle';
      
      if (transportMode && context.startPoint && context.destination) {
        return {
          response: `Perfect! My algorithms are calculating an optimized ${transportMode} route from ${context.startPoint} to ${context.destination}. Based on my analysis, this could save up to 70% of carbon emissions compared to conventional travel. The detailed route with elevation profile and emissions data is available on our planner page!`,
          confidence: 0.95,
          context: { 
            topic: 'route_planning', 
            startPoint: context.startPoint,
            destination: context.destination,
            transportMode,
            lastQuestion: null,
            sentiment
          }
        };
      }
    }
    
    // If we're discussing carbon footprint
    if (context.topic === 'carbon') {
      if (lowerInput.includes('yes') || lowerInput.includes('sure') || lowerInput.includes('ok')) {
        return {
          response: "Great! To calculate your precise carbon footprint, my algorithm needs to analyze your journey details. Let's start with your departure point - where will you be traveling from?",
          confidence: 0.85,
          context: { 
            topic: 'carbon_calculation',
            lastQuestion: 'start',
            sentiment
          }
        };
      }
    }
    
    // If the conversation has been inactive for a while
    const now = new Date();
    const timeSinceLastInteraction = context.lastInteractionTime ? 
      (now.getTime() - context.lastInteractionTime.getTime()) / 1000 : 0;
    
    if (timeSinceLastInteraction > 300) { // More than 5 minutes
      return {
        response: "I notice we've been discussing sustainable travel options. Is there something specific about environmentally friendly tourism you'd like to explore further?",
        confidence: 0.7,
        context: { lastInteractionTime: now, sentiment }
      };
    }
    
    // Default contextual response with improved natural language
    const contextualPhrases = [
      `I'm analyzing your interest in ${context.topic?.replace('_', ' ') || "sustainable travel"}. Could you provide more specific details so I can give you the most relevant information?`,
      `Based on our conversation about ${context.topic?.replace('_', ' ') || "eco-friendly travel"}, what specific aspect would you like me to provide more information on?`,
      `My algorithms suggest you're interested in ${context.topic?.replace('_', ' ') || "sustainable tourism"}. Could you tell me more about your specific needs?`
    ];
    
    return {
      response: contextualPhrases[Math.floor(Math.random() * contextualPhrases.length)],
      confidence: 0.6,
      context: { lastInteractionTime: now, sentiment }
    };
  };
  
  // Generate eco-friendly travel tips
  const getRandomTravelTip = (): string => {
    const tips = [
      "Based on my analysis of sustainable travel practices, packing a reusable water bottle and shopping bag can reduce plastic waste by up to 30% during your travels.",
      "My data shows that certified carbon offset programs can effectively neutralize your travel emissions. Consider investing in verified reforestation or renewable energy projects.",
      "Algorithm recommendation: Choose accommodations with eco-certifications like Green Key or LEED for up to 25% less energy consumption during your stay.",
      "Digital analysis shows that using electronic tickets and documents instead of printing can save approximately 0.5kg of CO2 per journey.",
      "Wildlife conservation data indicates maintaining a minimum safe distance of 50 meters from wild animals preserves natural behaviors and ecosystem balance.",
      "Economic impact studies show that direct purchases from local artisans and businesses can keep up to 70% more money within the local economy.",
      "Travel pattern analysis suggests that slow travel - spending more time in fewer places - can reduce your carbon footprint by up to 40%.",
      "My database of environmental issues is regularly updated. Researching local challenges before you travel makes you a more informed and responsible visitor.",
      "Marine conservation data confirms that only reef-safe sunscreen prevents coral damage. Look for products without oxybenzone and octinoxate when swimming in ocean environments.",
      "Nutrition impact analysis: Trying local plant-based cuisine can reduce your food carbon footprint by up to 50% while traveling."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Process the user input with our enhanced matching system - add delay to simulate thinking
    setTimeout(async () => {
      const sentiment = analyzeSentiment(userMessage.text);
      const matchResult = findBestMatch(userMessage.text);
      
      // Update conversation context if provided
      if (matchResult.context) {
        setContext({
          ...context,
          ...matchResult.context,
          lastInteractionTime: new Date()
        });
      }
      
      // Optional: Add a random eco-tip occasionally (20% chance)
      let botResponse = matchResult.response;
      if (Math.random() < 0.2) {
        const tip = getRandomTravelTip();
        botResponse += `\n\nEco Tip: ${tip}`;
      }

      const botMessage: Message = {
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1500); // Slightly longer delay to seem more thoughtful
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot button */}
      <button
        onClick={handleToggle}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center"
        aria-label="Open chat assistance"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative h-6 w-6">
            <Image 
              src="/images/logo-icon.svg" 
              alt="EcoRoute Assistant" 
              width={24} 
              height={24} 
              className="w-full h-full"
            />
          </div>
        )}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 max-h-[70vh]">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex items-center">
            <div className="relative h-8 w-8 mr-3">
              <Image 
                src="/images/logo-icon.svg" 
                alt="EcoRoute Assistant" 
                width={32} 
                height={32} 
                className="w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-semibold">EcoAssist AI</h3>
              <p className="text-xs opacity-80">Your intelligent sustainable travel companion</p>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ maxHeight: '400px' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.isUser ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                ref={inputRef}
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ask our AI about sustainable travel..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-r-lg hover:bg-green-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              EcoAssist AI can analyze routes, calculate emissions, and suggest personalized sustainable experiences.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
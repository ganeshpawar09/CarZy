import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const chatbotPrompt = `
      You are a smart assistant for CarZy, a car rental platform similar to Zoomcar. Help users by answering their questions clearly and accurately based on the following platform rules and features.

      ### Platform Overview:
      CarZy allows users to rent and host cars. Users log in using mobile number and OTP. Every user and car must be verified by employees before engaging in rentals. There are 4 roles: User (Renter), Owner, Admin, and Employee.

      ---

      ### USER (RENTER) CAN:
      - Login using mobile + OTP.
      - Upload driving license and passport for verification.
      - Book cars only after being verified.
      - Search by location, time, filters (fuel, brand, etc.).
      - Apply valid coupons during booking.
      - Pay via Razorpay.
      - Use OTP for pickup and drop.
      - Upload before and after trip photos.
      - Cancel bookings (refund based on policy):
        - 7+ days: 90%, 5–6 days: 70%, 3–4 days: 50%, 1–2 days: 30% else 10%
      - Receive partial/full refund after trip, depending on lateness/damage.
      - Get late fee if drop is delayed > 1 hour.
      - Get customer and mechanic support during trips.
      - Get full refund + 10% discount coupon if owner cancels.

      ---

      ### OWNER CAN:
      - Host cars (submit car details, images, PUC, RC, insurance).
      - Cars go under employee verification before being listed.
      - Update car visibility and availability.
      - Cancel bookings (will incur 10% penalty).
      - Submit damage reports if car is returned with issues.
      - If renter purchased insurance, renter pays less for damage.

      ---

      ### EMPLOYEES:
      - Verify users and cars.
      - Approve or reject based on document validation.
      - Monitor bookings, refunds, damage claims.

      ---

      ### ADMINS:
      - Manage all users, cars, verifications.
      - Handle disputes.
      - Apply dynamic pricing.
      - Override refunds, bans, and support escalations.

      ---

      ### TRIP FLOW:
      - Booking → Confirmed → Pickup (OTP + before photos) → Drop (OTP + after photos) → Refund Processing.
      - Cancelled by User: Refund as per policy.
      - Cancelled by Owner: 100% refund to user + 10% discount coupon, 10% penalty to owner.

      ---

      ### SUPPORT:
      - Provide help in case of car breakdown, trip issues, late refund.
      - Mechanic assistance is dispatched when needed.

      ---

      ### FUTURE SCOPE:
      - Dynamic pricing.
      - Car insurance (paid by renter).
      - Damage report from owner to reduce renter’s liability.
      - Replacement car if owner cancels urgently.

      ---

      Stay friendly, informative, and concise. Avoid guessing anything that isn't listed. Answer based only on this data unless user says "general query."

      `;

      chatRef.current = model.startChat({
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        history: [
          {
            role: "user",
            parts: [{ text: chatbotPrompt }],
          },
        ],
      });
    } catch (error) {
      console.error('Error initializing Gemini:', error);
    }
  }, []);


  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Gemini API directly
      const response = await fetchGeminiResponse(input);

      // Add bot message to chat
      const botMessage = { text: response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with Gemini:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGeminiResponse = async (userInput) => {
    try {
      if (!chatRef.current) {
        throw new Error('Gemini chat not initialized');
      }

      const result = await chatRef.current.sendMessage(userInput);
      const response = result.response.text();
      return response;
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      throw error;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="font-monda fixed bottom-2 right-6 z-50">
      {/* Chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'bg-black rotate-90' : 'bg-black'
          }`}
      >
        {isOpen ? <X size={24} color="white" /> : <MessageSquare size={24} color="white" />}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare size={20} />
              <h3 className="font-medium">Chat Assistant</h3>
            </div>
            <button onClick={toggleChatbot} className="text-white hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-72">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                <MessageSquare size={40} className="mb-3 text-gray-500 opacity-50" />
                <p>Hi there! How can I help you today?</p>
                <p className="text-sm mt-2">Powered by Gemini 1.5 Pro</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md whitespace-pre-wrap ${msg.sender === 'user'
                        ? 'bg-black text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: marked(msg.text) }} />
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg max-w-xs lg:max-w-md bg-gray-200 text-gray-800 rounded-bl-none">
                  <Loader className="animate-spin h-5 w-5" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-3 flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none max-h-24"
              rows="1"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || input.trim() === ''}
              className={`ml-2 p-2 rounded-full ${isLoading || input.trim() === ''
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
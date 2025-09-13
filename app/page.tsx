'use client'

import { useState, useEffect, useRef } from 'react'
import Message from '@/components/Message'
import SuggestedQuery from '@/components/SuggestedQuery'
import VisualDataModal from '@/components/VisualDataModal'
import { getBotResponse } from '@/lib/api/botService'
import { checkBackendHealth } from '@/lib/api/healthCheck'

export default function Home() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hello! I am RIPPLE, your AI assistant for Indian groundwater data. How can I help you today?", type: 'text' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showVisualData, setShowVisualData] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await checkBackendHealth()
        setBackendStatus(health.status === 'healthy' ? 'connected' : 'disconnected')
      } catch (error) {
        setBackendStatus('disconnected')
      }
    }
    
    checkBackend()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === '' || isLoading) return

    const newUserMessage = { id: Date.now(), sender: 'user', text: inputValue, type: 'text' }
    setMessages(prev => [...prev, newUserMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const botResponse = await getBotResponse(inputValue)
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting bot response:', error)
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        type: 'text'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`h-screen w-screen flex flex-col bg-cover bg-center ${darkMode ? "bg-gray-900" : ""}`}
      style={
        darkMode
          ? {}
          : { backgroundImage: "url('https://placehold.co/1920x1080/e0e7ff/a5b4fc?text=.')" }
      }
    >
            {/* ---------- HEADER ---------- */}
            <header className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm p-2 flex items-center justify-between">
                {/* Centered Title with slight right shift */}
                <div className="absolute inset-0 flex flex-col items-center justify-center translate-x-0.1 pointer-events-none">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Ripple Effect</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Indian AI Groundwater Assistant</p>
                </div>

                {/* Backend Status and Dark Mode Toggle */}
                <div className="ml-auto relative z-10 flex items-center gap-2">
                    {/* Backend Status Indicator */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs">
                        <div className={`w-2 h-2 rounded-full ${
                            backendStatus === 'connected' ? 'bg-green-500' : 
                            backendStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 
                            'bg-red-500'
                        }`}></div>
                        <span className="text-gray-600 dark:text-gray-300">
                            {backendStatus === 'connected' ? 'Backend Connected' : 
                             backendStatus === 'checking' ? 'Checking...' : 
                             'Backend Offline'}
                        </span>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        {darkMode ? " Light" : " Dark"}
                    </button>
                </div>
            </header>

      {/* ---------- MAIN CHAT ---------- */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 chat-container"
      >
        <div className="max-w-4xl mx-auto">
          {messages.map(msg => <Message key={msg.id} msg={msg} />)}
          {isLoading && (
            <div className="flex items-start gap-3 my-4 fade-in">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md dark:bg-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="max-w-md lg:max-w-2xl p-4 rounded-2xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-none flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4">
        <div className="max-w-4xl mx-auto">
          {/* Suggested queries */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <SuggestedQuery text="Show heatmap of Punjab" />
            <SuggestedQuery text="What is the 10-year trend in Hisar?" />
            
            {/* 📊 Get state-wise data Button */}
            <button
              type="button"
              onClick={() => setShowVisualData(true)}
              title="groundwater data"
              className="px-3 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
            >
              Get state-wise data
            </button>
          </div>

          {/* Chat input form */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-md focus-within:ring-2 focus-within:ring-blue-500 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about groundwater in India..."
              className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-700 dark:text-gray-200"
              disabled={isLoading}
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Voice Input"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

        {/* Visual Data Modal */}
        {showVisualData && <VisualDataModal onClose={() => setShowVisualData(false)} />}
      </footer>
    </div>
  )
}

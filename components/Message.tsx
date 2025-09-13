'use client'

import React from 'react'
import ChartComponent from './ChartComponent'
import MapComponent from './MapComponent'

interface MessageProps {
  msg: {
    id: number
    sender: 'bot' | 'user'
    text: string
    type: 'text' | 'chart' | 'map'
    data?: any
  }
}

const Message: React.FC<MessageProps> = ({ msg }) => {
  const isBot = msg.sender === 'bot'
  
  return (
    <div className={`flex items-start gap-3 my-4 fade-in ${isBot ? '' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className={`max-w-md lg:max-w-2xl p-4 rounded-2xl ${isBot ? 'bg-white text-gray-800 shadow-sm rounded-tl-none dark:bg-gray-700 dark:text-gray-200' : 'bg-blue-600 text-white rounded-br-none'}`}>
        <p className="whitespace-pre-wrap">{msg.text}</p>
        {msg.type === 'chart' && <ChartComponent data={msg.data} />}
        {msg.type === 'map' && <MapComponent data={msg.data} />}
      </div>
    </div>
  )
}

export default Message

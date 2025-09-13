'use client'

import React from 'react'

interface SuggestedQueryProps {
  text: string
  onClick?: (text: string) => void
}

const SuggestedQuery: React.FC<SuggestedQueryProps> = ({ text, onClick }) => (
  <button 
    onClick={() => onClick?.(text)}
    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
  >
    {text}
  </button>
)

export default SuggestedQuery

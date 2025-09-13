'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import('./MapLeaflet'), { 
  ssr: false,
  loading: () => <div className="h-[350px] w-full bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
})

interface MapComponentProps {
  data: {
    center: [number, number]
    zoom: number
  }
}

const MapComponent: React.FC<MapComponentProps> = ({ data }) => {
  return (
    <div className="mt-2 shadow-md rounded-lg overflow-hidden">
      <Map center={data.center} zoom={data.zoom} />
    </div>
  )
}

export default MapComponent

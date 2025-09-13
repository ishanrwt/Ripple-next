'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapLeafletProps {
  center: [number, number]
  zoom: number
}

const MapLeaflet: React.FC<MapLeafletProps> = ({ center, zoom }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Safe guard: Validate center is a valid [lat, lng] array, otherwise use India default
      const validCenter = Array.isArray(center) && center.length >= 2 && !isNaN(center[0]) && !isNaN(center[1]) 
        ? center 
        : [20.5937, 78.9629] // Default: India center
      const validZoom = isNaN(zoom) ? 5 : zoom // Default zoom for India

      mapInstance.current = L.map(mapRef.current).setView(validCenter, validZoom)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current)

      L.marker(validCenter).addTo(mapInstance.current)
        .bindPopup('Key region of interest.')
        .openPopup()
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [center, zoom])

  return <div ref={mapRef} style={{ height: '350px', width: '100%' }} />
}

export default MapLeaflet
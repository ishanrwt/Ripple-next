// Data API service for fetching groundwater data
// This integrates with your Node.js/Express backend database and visualization services

export interface DistrictData {
  district_name: string
  water_level: number
  state: string
  category: string
}

export interface GroundwaterTrend {
  year: number
  water_level: number
  district: string
  state: string
}

export interface HeatmapData {
  lat: number
  lng: number
  value: number
  district: string
  state: string
  category: string
}

export const fetchDistricts = async (): Promise<DistrictData[]> => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'
  
  try {
    const response = await fetch(`${API_URL}/api/districts`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch districts')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching districts:', error)
    // Return mock data for development
    return [
      { district_name: 'Hisar', water_level: 15.2, state: 'Haryana', category: 'Semi-Critical' },
      { district_name: 'Gurgaon', water_level: 12.8, state: 'Haryana', category: 'Critical' },
      { district_name: 'Faridabad', water_level: 18.5, state: 'Haryana', category: 'Safe' },
    ]
  }
}

export const fetchStateData = async (state: string): Promise<DistrictData[]> => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'
  
  try {
    const response = await fetch(`${API_URL}/api/districts?state=${encodeURIComponent(state)}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch state data')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching state data:', error)
    throw error
  }
}

export const fetchGroundwaterTrends = async (district: string, years: number = 10) => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'
  
  try {
    const response = await fetch(`${API_URL}/api/trends?district=${encodeURIComponent(district)}&years=${years}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch trends')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching trends:', error)
    throw error
  }
}

export const fetchHeatmapData = async (state?: string) => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'
  
  try {
    const url = state 
      ? `${API_URL}/api/heatmap?state=${encodeURIComponent(state)}`
      : `${API_URL}/api/heatmap`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch heatmap data')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching heatmap data:', error)
    throw error
  }
}

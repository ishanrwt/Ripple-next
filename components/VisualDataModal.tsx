'use client'

import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface VisualDataModalProps {
  onClose: () => void
}

interface DistrictData {
  district_name: string
  water_level: number
}

const VisualDataModal: React.FC<VisualDataModalProps> = ({ onClose }) => {
  const [state, setState] = useState('')
  const [districtData, setDistrictData] = useState<DistrictData[]>([])

  const handleFetchData = async (selectedState: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'}/api/districts?state=${selectedState}`)
      const data = await response.json()
      setDistrictData(data)
    } catch (error) {
      console.error('Error fetching district data:', error)
    }
  }

  useEffect(() => {
    if (state === 'Haryana') {
      handleFetchData(state)
    }
  }, [state])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-11/12 max-w-4xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl dark:text-gray-300"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Groundwater Data</h2>

        {/* State selector */}
        <div className="mb-4">
          <label className="font-medium mr-2 dark:text-gray-200">Select State:</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="">--Choose--</option>
            <option value="Haryana">Haryana</option>
          </select>
        </div>

        {/* Chart */}
        {districtData.length > 0 ? (
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="water_level" fill="#3b82f6" name="Water Level (m)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Please select a state to view data.</p>
        )}
      </div>
    </div>
  )
}

export default VisualDataModal

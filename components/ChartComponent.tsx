'use client'

import React, { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ChartComponentProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      tension: number
    }>
  }
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  // Safe guard: Handle undefined or invalid data to prevent .map() on undefined
  if (!data || !data.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) {
    return <div className="bg-white p-4 rounded-lg shadow-md mt-2 dark:bg-gray-800">No data available for chart.</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Groundwater Level Trend',
      },
    },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-2 dark:bg-gray-800">
      <Line data={data} options={options} />
    </div>
  )
}

export default ChartComponent
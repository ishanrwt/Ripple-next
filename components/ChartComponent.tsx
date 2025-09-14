'use client'

import React from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ChartComponentProps {
  data: {
    type: 'line' | 'bar' | 'pie'
    labels: string[]
    datasets: Array<any>
  }
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-2 dark:bg-gray-800">
        No data available for chart.
      </div>
    )
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text:
          data.type === 'line'
            ? 'Groundwater Level Trend'
            : data.type === 'bar'
            ? 'Bar Chart Visualization'
            : 'Pie Chart Visualization',
      },
    },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-2 dark:bg-gray-800">
      {data.type === 'line' && <Line data={data} options={options} />}
      {data.type === 'bar' && <Bar data={data} options={options} />}
      {data.type === 'pie' && <Pie data={data} options={options} />}
    </div>
  )
}


export default ChartComponent

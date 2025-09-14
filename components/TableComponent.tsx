'use client'

import React from 'react'

interface TableComponentProps {
  data: Array<Record<string, any>>
}

const TableComponent: React.FC<TableComponentProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mt-2 dark:bg-gray-800">
        No data available for table.
      </div>
    )
  }

  const columns = Object.keys(data[0])

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-2 dark:bg-gray-800">
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-gray-200 dark:border-gray-600"
            >
              {columns.map((col) => (
                <td key={col} className="px-4 py-2">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableComponent

import React from 'react';
import { ParsedData } from '../types/DataTypes';

interface DataTableProps {
  data: ParsedData | null;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Label</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Color</th>
            {data.labels.map((label, index) => (
              <th key={index} className="px-4 py-2">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{row.label}</td>
              <td className="px-4 py-2">
                <img src={row.image} alt={row.label} className="w-8 h-8 object-cover rounded" />
              </td>
              <td className="px-4 py-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: row.color }} />
              </td>
              {row.values.map((value, vIndex) => (
                <td key={vIndex} className="px-4 py-2">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
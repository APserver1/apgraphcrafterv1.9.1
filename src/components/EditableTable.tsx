import React from 'react';
import { ParsedData } from '../types/DataTypes';
import { EditableCell } from './EditableCell';
import { processData } from '../utils/excelParser';

interface EditableTableProps {
  data: ParsedData;
  onDataChange: (newData: ParsedData) => void;
}

export const EditableTable: React.FC<EditableTableProps> = ({ data, onDataChange }) => {
  const handleCellChange = (rowIndex: number, field: string, value: string | number) => {
    const newData = { ...data };
    if (field === 'label' || field === 'image' || field === 'color') {
      (newData.data[rowIndex] as any)[field] = value;
    } else {
      const valueIndex = parseInt(field);
      newData.data[rowIndex].values[valueIndex] = value as number;
    }
    onDataChange(newData);
  };

  const handleInterpolateClick = () => {
    const interpolatedData = processData(data, 'interpolate');
    onDataChange(interpolatedData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Datos</h2>
        <button
          onClick={handleInterpolateClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Interpolar Datos
        </button>
      </div>
      <div className="overflow-x-auto" style={{ 
        maxHeight: 'calc(100vh - 300px)',
        overflowX: 'scroll',
        scrollbarWidth: 'auto',
        scrollbarColor: '#CBD5E0 #EDF2F7'
      }}>
        <div style={{ minWidth: '100%', paddingBottom: '16px' }}>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 sticky left-0 bg-gray-100 z-20">Label</th>
                <th className="px-4 py-2">Image URL</th>
                <th className="px-4 py-2">Color</th>
                {data.labels.map((label, index) => (
                  <th key={index} className="px-4 py-2">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  <td className="sticky left-0 bg-white z-10">
                    <EditableCell
                      value={row.label}
                      onChange={(value) => handleCellChange(rowIndex, 'label', value)}
                    />
                  </td>
                  <td>
                    <EditableCell
                      value={row.image}
                      onChange={(value) => handleCellChange(rowIndex, 'image', value)}
                      type="url"
                    />
                  </td>
                  <td>
                    <EditableCell
                      value={row.color}
                      onChange={(value) => handleCellChange(rowIndex, 'color', value)}
                      type="color"
                    />
                  </td>
                  {row.values.map((value, valueIndex) => (
                    <td key={valueIndex}>
                      <EditableCell
                        value={isNaN(value) ? 0 : value}
                        onChange={(newValue) => handleCellChange(rowIndex, valueIndex.toString(), newValue)}
                        type="number"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
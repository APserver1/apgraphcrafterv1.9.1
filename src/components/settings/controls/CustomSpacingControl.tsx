import React from 'react';

interface CustomSpacingControlProps {
  maxBars: number;
  customSpacing: number[];
  onCustomSpacingChange: (index: number, value: number) => void;
}

export const CustomSpacingControl: React.FC<CustomSpacingControlProps> = ({
  maxBars,
  customSpacing,
  onCustomSpacingChange,
}) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: Math.max(1, maxBars - 1) }, (_, i) => (
        <div key={i}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio entre barra {i + 1} y {i + 2}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="-50"
              max="100"
              value={customSpacing[i] ?? -9}
              onChange={(e) => onCustomSpacingChange(i, parseInt(e.target.value) || -9)}
              className="w-20 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>
      ))}
    </div>
  );
};
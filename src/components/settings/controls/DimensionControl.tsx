import React from 'react';
import { SliderWithInput } from './SliderWithInput';

interface DimensionControlProps {
  title: string;
  isDescending: boolean;
  ratio: number;
  onDescendingChange: (value: boolean) => void;
  onRatioChange: (value: number) => void;
}

export const DimensionControl: React.FC<DimensionControlProps> = ({
  title,
  isDescending,
  ratio,
  onDescendingChange,
  onRatioChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`descending${title}`}
          checked={isDescending}
          onChange={(e) => onDescendingChange(e.target.checked)}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={`descending${title}`} className="ml-2 block text-sm text-gray-700">
          {title} Descendente
        </label>
      </div>

      {isDescending && (
        <div className="ml-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ratio de reducción de {title.toLowerCase()} (%)
          </label>
          <SliderWithInput
            value={Math.round(ratio * 100)}
            onChange={(value) => onRatioChange(value / 100)}
            min={25}
            max={100}
            unit="%"
          />
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { SliderWithInput } from './SliderWithInput';

interface SimpleSpacingControlProps {
  spacing: number;
  onSpacingChange: (value: number) => void;
}

export const SimpleSpacingControl: React.FC<SimpleSpacingControlProps> = ({
  spacing,
  onSpacingChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Espacio entre barras (px)
      </label>
      <SliderWithInput
        value={spacing}
        onChange={onSpacingChange}
        min={-50}
        max={100}
        unit="px"
      />
    </div>
  );
};
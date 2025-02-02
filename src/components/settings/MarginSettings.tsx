import React from 'react';
import { ChartSettings } from '../../types/SettingsTypes';
import { SliderWithInput } from './controls/SliderWithInput';

interface MarginSettingsProps {
  margins: ChartSettings['margins'];
  onMarginsChange: (updates: Partial<ChartSettings['margins']>) => void;
}

export const MarginSettings: React.FC<MarginSettingsProps> = ({
  margins,
  onMarginsChange,
}) => {
  const marginInputs = [
    { label: 'Margen arriba', key: 'top', max: 1500 },
    { label: 'Margen abajo', key: 'bottom', max: 2000 },
    { label: 'Margen izquierdo', key: 'left', max: 2000 },
    { label: 'Margen derecho', key: 'right', max: 2000 },
  ] as const;

  return (
    <div className="space-y-4">
      {marginInputs.map(({ label, key, max }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <SliderWithInput
            value={margins[key]}
            onChange={(value) => onMarginsChange({ [key]: value })}
            min={0}
            max={max}
            unit="px"
          />
        </div>
      ))}
    </div>
  );
};
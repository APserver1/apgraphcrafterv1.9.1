import React from 'react';

interface SliderWithInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export const SliderWithInput: React.FC<SliderWithInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = ''
}) => {
  // Asegurarse de que el valor inicial sea válido
  const safeValue = isNaN(value) ? min : Math.max(min, Math.min(max, value));

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1"
      />
      <div className="flex items-center gap-1 min-w-[80px]">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            if (!isNaN(newValue) && newValue >= min && newValue <= max) {
              onChange(newValue);
            }
          }}
          className="w-16 px-2 py-1 text-sm border rounded text-right"
        />
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};
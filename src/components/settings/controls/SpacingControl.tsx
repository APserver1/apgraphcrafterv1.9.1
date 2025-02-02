import React from 'react';

interface SpacingControlProps {
  spacing: number;
  descendingSpacing: boolean;
  spacingRatio: number;
  onSpacingChange: (value: number) => void;
  onDescendingChange: (value: boolean) => void;
  onRatioChange: (value: number) => void;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  spacing,
  descendingSpacing,
  spacingRatio,
  onSpacingChange,
  onDescendingChange,
  onRatioChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Espacio entre barras (px)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="-50"
            max="100"
            value={spacing}
            onChange={(e) => onSpacingChange(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-500 w-16 text-right">
            {spacing}px
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="descendingSpacing"
            checked={descendingSpacing}
            onChange={(e) => onDescendingChange(e.target.checked)}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="descendingSpacing" className="ml-2 block text-sm text-gray-700">
            Espaciado Descendente
          </label>
        </div>

        {descendingSpacing && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ratio de reducción de espaciado (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="25"
                max="100"
                value={Math.round(spacingRatio * 100)}
                onChange={(e) => onRatioChange(parseInt(e.target.value) / 100)}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-16 text-right">
                {Math.round(spacingRatio * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
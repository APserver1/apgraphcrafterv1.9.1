import React from 'react';
import { ChartSettings, LabelPosition } from '../../types/SettingsTypes';
import { DimensionControl } from './controls/DimensionControl';

interface LabelSettingsProps {
  settings: ChartSettings['labels'];
  onSettingsChange: (updates: Partial<ChartSettings['labels']>) => void;
}

export const LabelSettings: React.FC<LabelSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  // Ensure we have default values
  const safeSettings = {
    position: settings?.position || 'behind',
    color: settings?.color || '#000000',
    fontFamily: settings?.fontFamily || 'sans-serif',
    size: settings?.size || 14,
    spacing: settings?.spacing || 8,
    descendingSize: settings?.descendingSize || false,
    sizeRatio: settings?.sizeRatio || 0.75,
    invisible: settings?.invisible || false,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="invisibleLabels"
          checked={safeSettings.invisible}
          onChange={(e) => onSettingsChange({ invisible: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="invisibleLabels" className="ml-2 text-sm text-gray-700">
          Etiquetas invisibles
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Posición de etiquetas
        </label>
        <select
          value={safeSettings.position}
          onChange={(e) => onSettingsChange({ position: e.target.value as LabelPosition })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="behind">Detrás de la Barra</option>
          <option value="inside">En la Barra</option>
        </select>
      </div>

      {!safeSettings.invisible && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <input
            type="color"
            value={safeSettings.color}
            onChange={(e) => onSettingsChange({ color: e.target.value })}
            className="w-full h-10 rounded-md border border-gray-300 p-1"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuente
        </label>
        <select
          value={safeSettings.fontFamily}
          onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tamaño base de la fuente
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="8"
            max="32"
            value={safeSettings.size}
            onChange={(e) => onSettingsChange({ size: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm text-gray-500 w-16 text-right">
            {safeSettings.size}px
          </span>
        </div>
      </div>

      <DimensionControl
        title="Tamaño"
        isDescending={safeSettings.descendingSize}
        ratio={safeSettings.sizeRatio}
        onDescendingChange={(value) => onSettingsChange({ descendingSize: value })}
        onRatioChange={(value) => onSettingsChange({ sizeRatio: value })}
      />

      {safeSettings.position === 'behind' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio entre la etiqueta y la barra
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={safeSettings.spacing}
              onChange={(e) => onSettingsChange({ spacing: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-16 text-right">
              {safeSettings.spacing}px
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
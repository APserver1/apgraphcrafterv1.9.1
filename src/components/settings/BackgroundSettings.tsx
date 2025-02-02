import React from 'react';
import { ChartSettings } from '../../types/SettingsTypes';

interface BackgroundSettingsProps {
  settings: ChartSettings['background'];
  onSettingsChange: (updates: Partial<ChartSettings['background']>) => void;
}

export const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableBackground"
          checked={settings.enabled}
          onChange={(e) => onSettingsChange({ enabled: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="enableBackground" className="ml-2 text-sm text-gray-700">
          Color de Fondo
        </label>
      </div>

      {settings.enabled && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => onSettingsChange({ color: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.color}
              onChange={(e) => onSettingsChange({ color: e.target.value })}
              placeholder="#000000"
              className="flex-1 px-3 py-1 border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
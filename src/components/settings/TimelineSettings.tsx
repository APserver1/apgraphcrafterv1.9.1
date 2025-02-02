import React from 'react';
import { ChartSettings } from '../../types/SettingsTypes';

interface TimelineSettingsProps {
  settings: ChartSettings['timeline'];
  onSettingsChange: (updates: Partial<ChartSettings['timeline']>) => void;
}

export const TimelineSettings: React.FC<TimelineSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duración del Video (segundos)
        </label>
        <input
          type="number"
          min={1}
          value={settings.duration}
          onChange={(e) => onSettingsChange({ duration: Math.max(1, parseInt(e.target.value) || 1) })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="loop"
            checked={settings.loop}
            onChange={(e) => onSettingsChange({ loop: e.target.checked })}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="loop" className="ml-2 block text-sm text-gray-700">
            Bucle
          </label>
        </div>

        {settings.loop && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo Antes del Bucle (segundos)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={settings.loopDelayBefore}
                onChange={(e) => onSettingsChange({ loopDelayBefore: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo Después del Bucle (segundos)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={settings.loopDelayAfter}
                onChange={(e) => onSettingsChange({ loopDelayAfter: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
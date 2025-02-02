import React from 'react';
import { DateDisplaySettings } from '../../types/SettingsTypes';
import { SliderWithInput } from './controls/SliderWithInput';

interface DateSettingsProps {
  settings: DateDisplaySettings;
  onSettingsChange: (updates: Partial<DateDisplaySettings>) => void;
}

export const DateSettings: React.FC<DateSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  // Ensure we have default values for all settings including margins
  const safeSettings = {
    show: settings?.show ?? true,
    position: settings?.position ?? 'bottomRight',
    fontSize: settings?.fontSize ?? 16,
    color: settings?.color ?? '#ffffff',
    margins: {
      top: settings?.margins?.top ?? 16,
      bottom: settings?.margins?.bottom ?? 16,
      left: settings?.margins?.left ?? 16,
      right: settings?.margins?.right ?? 16
    },
    backgroundColor: settings?.backgroundColor ?? 'rgba(0, 0, 0, 0.5)',
  };

  const handleMarginChange = (key: keyof DateDisplaySettings['margins']) => (value: number) => {
    onSettingsChange({
      margins: {
        ...safeSettings.margins,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showDate"
          checked={safeSettings.show}
          onChange={(e) => onSettingsChange({ show: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="showDate" className="ml-2 text-sm text-gray-700">
          Mostrar fecha
        </label>
      </div>

      {safeSettings.show && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Posición
            </label>
            <select
              value={safeSettings.position}
              onChange={(e) => onSettingsChange({ 
                position: e.target.value as DateDisplaySettings['position']
              })}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="topLeft">Superior izquierda</option>
              <option value="topRight">Superior derecha</option>
              <option value="bottomLeft">Inferior izquierda</option>
              <option value="bottomRight">Inferior derecha</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamaño de fuente
            </label>
            <SliderWithInput
              value={safeSettings.fontSize}
              onChange={(value) => onSettingsChange({ fontSize: value })}
              min={12}
              max={48}
              unit="px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color del texto
            </label>
            <input
              type="color"
              value={safeSettings.color}
              onChange={(e) => onSettingsChange({ color: e.target.value })}
              className="w-full h-8 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color del fondo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={safeSettings.backgroundColor || '#000000'}
                onChange={(e) => onSettingsChange({ 
                  backgroundColor: e.target.value 
                })}
                className="w-full h-8 rounded"
              />
              <button
                onClick={() => onSettingsChange({ backgroundColor: null })}
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Sin fondo
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Márgenes
            </label>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Margen Superior
              </label>
              <SliderWithInput
                value={safeSettings.margins.top}
                onChange={handleMarginChange('top')}
                min={0}
                max={600}
                unit="px"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Margen Inferior
              </label>
              <SliderWithInput
                value={safeSettings.margins.bottom}
                onChange={handleMarginChange('bottom')}
                min={0}
                max={600}
                unit="px"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Margen Izquierdo
              </label>
              <SliderWithInput
                value={safeSettings.margins.left}
                onChange={handleMarginChange('left')}
                min={0}
                max={1000}
                unit="px"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Margen Derecho
              </label>
              <SliderWithInput
                value={safeSettings.margins.right}
                onChange={handleMarginChange('right')}
                min={0}
                max={1000}
                unit="px"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
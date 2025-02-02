import React from 'react';
import { ChartSettings } from '../../types/SettingsTypes';
import { ParsedData } from '../../types/DataTypes';

interface TextCarouselSettingsProps {
  settings: ChartSettings['textCarousel'];
  data: ParsedData;
  onSettingsChange: (updates: Partial<ChartSettings['textCarousel']>) => void;
}

export const TextCarouselSettings: React.FC<TextCarouselSettingsProps> = ({
  settings,
  data,
  onSettingsChange,
}) => {
  // Asegurarnos de que settings y sus propiedades existan
  const safeSettings = {
    enabled: settings?.enabled ?? false,
    fontSize: settings?.fontSize ?? 32,
    fontFamily: settings?.fontFamily ?? 'sans-serif',
    color: settings?.color ?? '#000000',
    margins: {
      top: settings?.margins?.top ?? 50,
      bottom: settings?.margins?.bottom ?? 50,
      left: settings?.margins?.left ?? 50,
      right: settings?.margins?.right ?? 50
    },
    texts: settings?.texts ?? {}
  };

  const handleTextChange = (label: string, text: string) => {
    const newTexts = {
      ...safeSettings.texts,
      [label]: text
    };
    
    onSettingsChange({
      texts: newTexts
    });
  };

  const handleMarginChange = (margin: keyof ChartSettings['textCarousel']['margins'], value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= -2000 && numValue <= 2000) {
      onSettingsChange({
        margins: {
          ...safeSettings.margins,
          [margin]: numValue
        }
      });
    }
  };

  const handleFontSizeChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 200) {
      onSettingsChange({ fontSize: numValue });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableTextCarousel"
          checked={safeSettings.enabled}
          onChange={(e) => onSettingsChange({ enabled: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="enableTextCarousel" className="ml-2 text-sm text-gray-700">
          Activar carrusel de texto
        </label>
      </div>

      {safeSettings.enabled && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamaño de fuente (1-200px)
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={safeSettings.fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuente
              </label>
              <select
                value={safeSettings.fontFamily}
                onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color del texto
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={safeSettings.color}
                onChange={(e) => onSettingsChange({ color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={safeSettings.color}
                onChange={(e) => onSettingsChange({ color: e.target.value })}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Márgenes (-2000px a 2000px)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Superior
                </label>
                <input
                  type="number"
                  min="-2000"
                  max="2000"
                  value={safeSettings.margins.top}
                  onChange={(e) => handleMarginChange('top', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Inferior
                </label>
                <input
                  type="number"
                  min="-2000"
                  max="2000"
                  value={safeSettings.margins.bottom}
                  onChange={(e) => handleMarginChange('bottom', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Izquierdo
                </label>
                <input
                  type="number"
                  min="-2000"
                  max="2000"
                  value={safeSettings.margins.left}
                  onChange={(e) => handleMarginChange('left', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Derecho
                </label>
                <input
                  type="number"
                  min="-2000"
                  max="2000"
                  value={safeSettings.margins.right}
                  onChange={(e) => handleMarginChange('right', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Textos por fecha</h4>
            {data.labels.map((label) => (
              <div key={label} className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <textarea
                      value={safeSettings.texts[label] || ''}
                      onChange={(e) => handleTextChange(label, e.target.value)}
                      placeholder="Texto a mostrar"
                      className="w-full px-3 py-2 border rounded-lg resize-y"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
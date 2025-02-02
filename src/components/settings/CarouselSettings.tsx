import React from 'react';
import { ChartSettings } from '../../types/SettingsTypes';
import { ParsedData } from '../../types/DataTypes';

interface CarouselSettingsProps {
  settings: ChartSettings['carousel'];
  data: ParsedData;
  onSettingsChange: (updates: Partial<ChartSettings['carousel']>) => void;
}

export const CarouselSettings: React.FC<CarouselSettingsProps> = ({
  settings,
  data,
  onSettingsChange,
}) => {
  // Asegurarnos de que settings y sus propiedades existan
  const safeSettings = {
    enabled: settings?.enabled ?? false,
    width: settings?.width ?? 200,
    height: settings?.height ?? 200,
    margins: {
      top: settings?.margins?.top ?? 50,
      bottom: settings?.margins?.bottom ?? 50,
      left: settings?.margins?.left ?? 50,
      right: settings?.margins?.right ?? 50
    },
    images: settings?.images ?? {}
  };

  const handleImageUrlChange = (label: string, url: string) => {
    onSettingsChange({
      images: {
        ...safeSettings.images,
        [label]: url
      }
    });
  };

  const handleMarginChange = (margin: keyof ChartSettings['carousel']['margins'], value: string) => {
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

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 2000) {
      onSettingsChange({ [dimension]: numValue });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableCarousel"
          checked={safeSettings.enabled}
          onChange={(e) => onSettingsChange({ enabled: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="enableCarousel" className="ml-2 text-sm text-gray-700">
          Activar carrusel de imágenes
        </label>
      </div>

      {safeSettings.enabled && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ancho de imágenes (1-2000px)
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={safeSettings.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alto de imágenes (1-2000px)
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={safeSettings.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
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
            <h4 className="text-sm font-medium text-gray-700">Imágenes por fecha</h4>
            {data.labels.map((label) => (
              <div key={label} className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={safeSettings.images[label] || ''}
                        onChange={(e) => handleImageUrlChange(label, e.target.value)}
                        placeholder="URL de la imagen"
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      {safeSettings.images[label] && (
                        <img
                          src={safeSettings.images[label]}
                          alt={`Vista previa para ${label}`}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                          }}
                        />
                      )}
                    </div>
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
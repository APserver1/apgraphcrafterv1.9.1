import React from 'react';
import { ParsedData } from '../../../types/DataTypes';
import { AdditionalImageSettings } from '../../../types/SettingsTypes';
import { DimensionControl } from '../controls/DimensionControl';

interface ImageListProps {
  data: ParsedData;
  settings: AdditionalImageSettings;
  index: number;
  type: 'image' | 'flag';
  onImageChange: (barIndex: number, url: string) => void;
  onSettingsChange: (updates: Partial<AdditionalImageSettings>) => void;
  onRemove: () => void;
}

export const ImageList: React.FC<ImageListProps> = ({
  data,
  settings,
  index,
  type,
  onImageChange,
  onSettingsChange,
  onRemove,
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onSettingsChange({ enabled: e.target.checked })}
            className="h-4 w-4 text-blue-500 rounded border-gray-300"
          />
          <span className="font-medium">
            {type === 'image' ? `Imagen Adicional ${index + 1}` : `Bandera ${index + 1}`}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          Eliminar
        </button>
      </div>

      {settings.enabled && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamaño base
            </label>
            <input
              type="range"
              min="16"
              max="64"
              value={settings.size}
              onChange={(e) => onSettingsChange({ size: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Espacio entre la imagen y la barra
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.spacing}
              onChange={(e) => onSettingsChange({ spacing: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <DimensionControl
            title="Tamaño"
            isDescending={settings.descendingSize}
            ratio={settings.sizeRatio}
            onDescendingChange={(value) => onSettingsChange({ descendingSize: value })}
            onRatioChange={(value) => onSettingsChange({ sizeRatio: value })}
          />

          <div className="space-y-2">
            <h4 className="font-medium text-sm">URLs de las imágenes</h4>
            {data.data.map((bar, barIndex) => (
              <div key={barIndex} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-24 truncate">
                  {bar.label}:
                </span>
                <input
                  type="text"
                  value={bar.additionalImages?.[type === 'image' ? 'images' : 'flags'][index] || ''}
                  onChange={(e) => onImageChange(barIndex, e.target.value)}
                  placeholder="URL de la imagen"
                  className="flex-1 px-2 py-1 text-sm border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
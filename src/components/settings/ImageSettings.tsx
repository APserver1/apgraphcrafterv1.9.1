import React from 'react';
import { ChartSettings, ImagePosition } from '../../types/SettingsTypes';
import { SliderWithInput } from './controls/SliderWithInput';
import { DimensionControl } from './controls/DimensionControl';

interface ImageSettingsProps {
  settings: ChartSettings['images'];
  onSettingsChange: (updates: Partial<ChartSettings['images']>) => void;
}

export const ImageSettings: React.FC<ImageSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const safeSettings = {
    position: settings?.position || 'behind',
    size: settings?.size || 32,
    spacing: settings?.spacing || 8,
    descendingWidth: settings?.descendingWidth || false,
    widthRatio: settings?.widthRatio || 0.75,
    descendingHeight: settings?.descendingHeight || false,
    heightRatio: settings?.heightRatio || 0.75,
    stackOrder: settings?.stackOrder || 'topOverBottom',
    border: {
      enabled: settings?.border?.enabled || false,
      width: settings?.border?.width || 2,
      spacing: settings?.border?.spacing || 2,
      descendingWidth: settings?.border?.descendingWidth || false,
      widthRatio: settings?.border?.widthRatio || 0.75,
      descendingSpacing: settings?.border?.descendingSpacing || false,
      spacingRatio: settings?.border?.spacingRatio || 0.75
    }
  };

  const handleBorderChange = (field: keyof ChartSettings['images']['border'], value: number | boolean) => {
    onSettingsChange({
      border: {
        ...safeSettings.border,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Posición de la imagen
        </label>
        <select
          value={safeSettings.position}
          onChange={(e) => onSettingsChange({ position: e.target.value as ImagePosition })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="behind">Detrás de la barra</option>
          <option value="front">Delante de la barra</option>
        </select>
      </div>

      {safeSettings.position === 'front' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio entre la barra y la imagen
          </label>
          <SliderWithInput
            value={safeSettings.spacing}
            onChange={(value) => onSettingsChange({ spacing: value })}
            min={-1100}
            max={1200}
            unit="px"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tamaño base de la imagen
        </label>
        <SliderWithInput
          value={safeSettings.size}
          onChange={(value) => onSettingsChange({ size: value })}
          min={16}
          max={1064}
          unit="px"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Orden de apilamiento
        </label>
        <select
          value={safeSettings.stackOrder}
          onChange={(e) => onSettingsChange({ 
            stackOrder: e.target.value as 'topOverBottom' | 'bottomOverTop' 
          })}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="topOverBottom">Superior sobre inferior</option>
          <option value="bottomOverTop">Inferior sobre superior</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Controla qué imagen se muestra por encima cuando hay superposición
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="borderEnabled"
            checked={safeSettings.border.enabled}
            onChange={(e) => handleBorderChange('enabled', e.target.checked)}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="borderEnabled" className="ml-2 block text-sm text-gray-700">
            Borde de Imagen
          </label>
        </div>

        {safeSettings.border.enabled && (
          <div className="ml-6 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grosor del borde
              </label>
              <SliderWithInput
                value={safeSettings.border.width}
                onChange={(value) => handleBorderChange('width', value)}
                min={1}
                max={115}
                unit="px"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="borderDescendingWidth"
                  checked={safeSettings.border.descendingWidth}
                  onChange={(e) => handleBorderChange('descendingWidth', e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="borderDescendingWidth" className="ml-2 block text-sm text-gray-700">
                  Grosor Descendente
                </label>
              </div>

              {safeSettings.border.descendingWidth && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ratio de reducción de grosor (%)
                  </label>
                  <SliderWithInput
                    value={Math.round(safeSettings.border.widthRatio * 100)}
                    onChange={(value) => handleBorderChange('widthRatio', value / 100)}
                    min={25}
                    max={100}
                    unit="%"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Espacio entre imagen y borde
              </label>
              <SliderWithInput
                value={safeSettings.border.spacing}
                onChange={(value) => handleBorderChange('spacing', value)}
                min={0}
                max={108}
                unit="px"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="borderDescendingSpacing"
                  checked={safeSettings.border.descendingSpacing}
                  onChange={(e) => handleBorderChange('descendingSpacing', e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="borderDescendingSpacing" className="ml-2 block text-sm text-gray-700">
                  Espacio Descendente
                </label>
              </div>

              {safeSettings.border.descendingSpacing && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ratio de reducción de espacio (%)
                  </label>
                  <SliderWithInput
                    value={Math.round(safeSettings.border.spacingRatio * 100)}
                    onChange={(value) => handleBorderChange('spacingRatio', value / 100)}
                    min={25}
                    max={100}
                    unit="%"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <DimensionControl
        title="Anchura"
        isDescending={safeSettings.descendingWidth}
        ratio={safeSettings.widthRatio}
        onDescendingChange={(value) => onSettingsChange({ descendingWidth: value })}
        onRatioChange={(value) => onSettingsChange({ widthRatio: value })}
      />

      <DimensionControl
        title="Altura"
        isDescending={safeSettings.descendingHeight}
        ratio={safeSettings.heightRatio}
        onDescendingChange={(value) => onSettingsChange({ descendingHeight: value })}
        onRatioChange={(value) => onSettingsChange({ heightRatio: value })}
      />
    </div>
  );
};
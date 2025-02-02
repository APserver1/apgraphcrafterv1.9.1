import React from 'react';
import { ImageColumnSettings, ImageShape } from '../../types/SettingsTypes';
import { ParsedData } from '../../types/DataTypes';
import { DimensionControl } from './controls/DimensionControl';
import { SliderWithInput } from './controls/SliderWithInput';

interface ImageColumnSettingsPanelProps {
  settings: ImageColumnSettings;
  data: ParsedData;
  onSettingsChange: (updates: Partial<ImageColumnSettings>) => void;
}

export const ImageColumnSettingsPanel: React.FC<ImageColumnSettingsPanelProps> = ({
  settings,
  data,
  onSettingsChange,
}) => {
  const handleImageUrlChange = (label: string, url: string) => {
    onSettingsChange({
      images: {
        ...settings.images,
        [label]: url
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableImageColumn"
          checked={settings.enabled}
          onChange={(e) => onSettingsChange({ enabled: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="enableImageColumn" className="ml-2 text-sm text-gray-700">
          Habilitar columna de imágenes
        </label>
      </div>

      {settings.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posición
            </label>
            <select
              value={settings.position}
              onChange={(e) => onSettingsChange({ position: e.target.value as 'left' | 'right' })}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="left">Izquierda</option>
              <option value="right">Derecha</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de Imagen
            </label>
            <select
              value={settings.imageShape}
              onChange={(e) => onSettingsChange({ imageShape: e.target.value as ImageShape })}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="circle">Circular</option>
              <option value="square">Cuadrada</option>
              <option value="rectangle">Rectangular</option>
              <option value="original">Original</option>
              <option value="custom">Forma personalizada</option>
            </select>
          </div>

          {settings.imageShape === 'custom' && (
            <div className="space-y-4 ml-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancho personalizado
                </label>
                <SliderWithInput
                  value={settings.customWidth || 32}
                  onChange={(value) => onSettingsChange({ customWidth: value })}
                  min={16}
                  max={1512}
                  unit="px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alto personalizado
                </label>
                <SliderWithInput
                  value={settings.customHeight || 32}
                  onChange={(value) => onSettingsChange({ customHeight: value })}
                  min={16}
                  max={1512}
                  unit="px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolución
                </label>
                <SliderWithInput
                  value={Math.round((settings.resolution || 1) * 100)}
                  onChange={(value) => onSettingsChange({ resolution: value / 100 })}
                  min={100}
                  max={400}
                  unit="%"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Controla la resolución de las imágenes sin afectar su tamaño visual
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamaño base
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="16"
                max="1128"
                value={settings.size}
                onChange={(e) => onSettingsChange({ size: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-16 text-right">
                {settings.size}px
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Velocidad de animación
            </label>
            <SliderWithInput
              value={settings.animationSpeed}
              onChange={(value) => onSettingsChange({ animationSpeed: value })}
              min={0.1}
              max={3}
              step={0.1}
              unit="s"
            />
            <p className="mt-1 text-sm text-gray-500">
              Controla la velocidad de la animación cuando las imágenes cambian de posición
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden de apilamiento
            </label>
            <select
              value={settings.stackOrder}
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
                id="useCustomSpacing"
                checked={settings.useCustomSpacing}
                onChange={(e) => onSettingsChange({ useCustomSpacing: e.target.checked })}
                className="h-4 w-4 text-blue-500 rounded border-gray-300"
              />
              <label htmlFor="useCustomSpacing" className="ml-2 text-sm text-gray-700">
                Espacio entre Imágenes Personalizado
              </label>
            </div>

            {settings.useCustomSpacing ? (
              <div className="ml-6 space-y-3">
                {Array.from({ length: Math.max(1, data.data.length - 1) }, (_, i) => (
                  <div key={i}>
                    <label className="block text-sm text-gray-600 mb-1">
                      Espacio entre imagen {i + 1} y {i + 2}
                    </label>
                    <input
                      type="number"
                      value={settings.customSpacing[i] ?? settings.spacing}
                      onChange={(e) => {
                        const newSpacing = [...settings.customSpacing];
                        newSpacing[i] = parseInt(e.target.value);
                        onSettingsChange({ customSpacing: newSpacing });
                      }}
                      className="w-24 px-2 py-1 border rounded"
                      min="0"
                      max="1500"
                    />
                    <span className="ml-2 text-sm text-gray-500">px</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Espacio entre imágenes
                </label>
                <SliderWithInput
                  value={settings.spacing}
                  onChange={(value) => onSettingsChange({ spacing: value })}
                  min={0}
                  max={1064}
                  unit="px"
                />
              </div>
            )}
          </div>

          <DimensionControl
            title="Tamaño"
            isDescending={settings.descendingSize}
            ratio={settings.sizeRatio}
            onDescendingChange={(value) => onSettingsChange({ descendingSize: value })}
            onRatioChange={(value) => onSettingsChange({ sizeRatio: value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Márgenes
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Superior</label>
                <input
                  type="number"
                  value={settings.margins.top}
                  onChange={(e) => onSettingsChange({
                    margins: { ...settings.margins, top: parseInt(e.target.value) }
                  })}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                  max="1500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Inferior</label>
                <input
                  type="number"
                  value={settings.margins.bottom}
                  onChange={(e) => onSettingsChange({
                    margins: { ...settings.margins, bottom: parseInt(e.target.value) }
                  })}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                  max="1500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Izquierdo</label>
                <input
                  type="number"
                  value={settings.margins.left}
                  onChange={(e) => onSettingsChange({
                    margins: { ...settings.margins, left: parseInt(e.target.value) }
                  })}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                  max="1500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Derecho</label>
                <input
                  type="number"
                  value={settings.margins.right}
                  onChange={(e) => onSettingsChange({
                    margins: { ...settings.margins, right: parseInt(e.target.value) }
                  })}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                  max="1500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">URLs de Imágenes</h3>
            <div className="space-y-2">
              {data.data.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-24 truncate">
                    {item.label}:
                  </span>
                  <input
                    type="text"
                    value={settings.images[item.label] || ''}
                    onChange={(e) => handleImageUrlChange(item.label, e.target.value)}
                    placeholder="URL de la imagen"
                    className="flex-1 px-2 py-1 text-sm border rounded"
                  />
                  {settings.images[item.label] && (
                    <img
                      src={settings.images[item.label]}
                      alt={item.label}
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = settings.defaultImage;
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Imagen por Defecto
            </label>
            <input
              type="text"
              value={settings.defaultImage}
              onChange={(e) => onSettingsChange({ defaultImage: e.target.value })}
              placeholder="URL de la imagen por defecto"
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
        </>
      )}
    </div>
  );
};
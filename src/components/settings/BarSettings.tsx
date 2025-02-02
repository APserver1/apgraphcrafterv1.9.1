import React from 'react';
import { ChartSettings, BarAnimationType } from '../../types/SettingsTypes';
import { DimensionControl } from './controls/DimensionControl';
import { SimpleSpacingControl } from './controls/SimpleSpacingControl';
import { CustomSpacingControl } from './controls/CustomSpacingControl';
import { SliderWithInput } from './controls/SliderWithInput';

interface BarSettingsProps {
  settings: ChartSettings['bars'];
  onSettingsChange: (updates: Partial<ChartSettings['bars']>) => void;
}

export const BarSettings: React.FC<BarSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  // Ensure settings has all required properties with defaults
  const safeSettings = {
    maxCount: settings?.maxCount ?? 10,
    spacing: settings?.spacing ?? 8,
    descendingWidth: settings?.descendingWidth ?? false,
    descendingRatio: settings?.descendingRatio ?? 0.75,
    descendingHeight: settings?.descendingHeight ?? false,
    heightRatio: settings?.heightRatio ?? 0.75,
    baseHeight: settings?.baseHeight ?? 40,
    keepSpacing: settings?.keepSpacing ?? false,
    useCustomSpacing: settings?.useCustomSpacing ?? false,
    customSpacing: settings?.customSpacing ?? [],
    animationType: settings?.animationType ?? 'transition',
    hideZeroBars: settings?.hideZeroBars ?? false,
    roundedCorners: {
      enabled: settings?.roundedCorners?.enabled ?? false,
      radius: settings?.roundedCorners?.radius ?? 8
    }
  };

  const handleCustomSpacingChange = (index: number, value: number) => {
    const newSpacing = [...(safeSettings.customSpacing || [])];
    newSpacing[index] = value;
    onSettingsChange({ customSpacing: newSpacing });
  };

  const handleRoundedCornersChange = (updates: Partial<ChartSettings['bars']['roundedCorners']>) => {
    onSettingsChange({
      roundedCorners: {
        ...safeSettings.roundedCorners,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Animación
        </label>
        <select
          value={safeSettings.animationType}
          onChange={(e) => onSettingsChange({ animationType: e.target.value as BarAnimationType })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="instant">Animación Instantánea</option>
          <option value="transition">Animación De Transiciones</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de Barras
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={safeSettings.maxCount}
          onChange={(e) => onSettingsChange({ maxCount: Math.max(1, parseInt(e.target.value) || 1) })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hideZeroBars"
            checked={safeSettings.hideZeroBars}
            onChange={(e) => onSettingsChange({ hideZeroBars: e.target.checked })}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hideZeroBars" className="ml-2 block text-sm text-gray-700">
            Ocultar Barras en 0
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="roundedCorners"
            checked={safeSettings.roundedCorners.enabled}
            onChange={(e) => handleRoundedCornersChange({ enabled: e.target.checked })}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="roundedCorners" className="ml-2 block text-sm text-gray-700">
            Borde redondeado
          </label>
        </div>

        {safeSettings.roundedCorners.enabled && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Radio de redondeo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="20"
                value={safeSettings.roundedCorners.radius}
                onChange={(e) => handleRoundedCornersChange({ radius: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-16 text-right">
                {safeSettings.roundedCorners.radius}px
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useCustomSpacing"
            checked={safeSettings.useCustomSpacing}
            onChange={(e) => onSettingsChange({ useCustomSpacing: e.target.checked })}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="useCustomSpacing" className="ml-2 block text-sm text-gray-700">
            Usar espaciado personalizado
          </label>
        </div>

        {safeSettings.useCustomSpacing ? (
          <div className="ml-6">
            <CustomSpacingControl
              maxBars={safeSettings.maxCount}
              customSpacing={safeSettings.customSpacing}
              onCustomSpacingChange={handleCustomSpacingChange}
            />
          </div>
        ) : (
          <SimpleSpacingControl
            spacing={safeSettings.spacing}
            onSpacingChange={(value) => onSettingsChange({ spacing: value })}
          />
        )}
      </div>

      <DimensionControl
        title="Anchura"
        isDescending={safeSettings.descendingWidth}
        ratio={safeSettings.descendingRatio}
        onDescendingChange={(value) => onSettingsChange({ descendingWidth: value })}
        onRatioChange={(value) => onSettingsChange({ descendingRatio: value })}
      />

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="descendingHeight"
            checked={safeSettings.descendingHeight}
            onChange={(e) => onSettingsChange({ descendingHeight: e.target.checked })}
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="descendingHeight" className="ml-2 block text-sm text-gray-700">
            Altura Descendente
          </label>
        </div>

        {safeSettings.descendingHeight && (
          <div className="ml-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura base (px)
              </label>
              <SliderWithInput
                value={safeSettings.baseHeight}
                onChange={(value) => onSettingsChange({ baseHeight: value })}
                min={20}
                max={100}
                unit="px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ratio de reducción de altura (%)
              </label>
              <SliderWithInput
                value={Math.round(safeSettings.heightRatio * 100)}
                onChange={(value) => onSettingsChange({ heightRatio: value / 100 })}
                min={25}
                max={100}
                unit="%"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="keepSpacing"
          checked={safeSettings.keepSpacing}
          onChange={(e) => onSettingsChange({ keepSpacing: e.target.checked })}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="keepSpacing" className="ml-2 block text-sm text-gray-700">
          Mantener espaciado
        </label>
      </div>
    </div>
  );
};
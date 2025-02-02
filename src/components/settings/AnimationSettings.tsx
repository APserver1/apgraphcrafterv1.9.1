import React from 'react';
import { ChartSettings, BarJumpType, FlipStyle } from '../../types/SettingsTypes';
import { SliderWithInput } from './controls/SliderWithInput';

interface AnimationSettingsProps {
  settings: ChartSettings['animations'];
  onSettingsChange: (updates: Partial<ChartSettings['animations']>) => void;
}

export const AnimationSettings: React.FC<AnimationSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Animación
        </label>
        <select
          value={settings.barJump}
          onChange={(e) => onSettingsChange({ barJump: e.target.value as BarJumpType })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="instant">Instantánea</option>
          <option value="smooth">Salto Suave</option>
        </select>
      </div>

      {settings.barJump === 'smooth' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración del salto vertical (segundos)
            </label>
            <SliderWithInput
              value={settings.jumpDuration}
              onChange={(value) => onSettingsChange({ jumpDuration: value })}
              min={0.1}
              max={2}
              step={0.1}
              unit="s"
            />
            <p className="text-sm text-gray-500 mt-1">
              Controla la velocidad del movimiento vertical de las barras
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración del crecimiento horizontal (segundos)
            </label>
            <SliderWithInput
              value={settings.growthDuration}
              onChange={(value) => onSettingsChange({ growthDuration: value })}
              min={0.1}
              max={2}
              step={0.1}
              unit="s"
            />
            <p className="text-sm text-gray-500 mt-1">
              Controla la velocidad del crecimiento horizontal de las barras
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración de animación de entrada (segundos)
            </label>
            <SliderWithInput
              value={settings.entryDuration}
              onChange={(value) => onSettingsChange({ entryDuration: value })}
              min={0.1}
              max={2}
              step={0.1}
              unit="s"
            />
            <p className="text-sm text-gray-500 mt-1">
              Controla la duración de la animación para las barras que entran
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estilizado
            </label>
            <select
              value={settings.flipStyle}
              onChange={(e) => onSettingsChange({ flipStyle: e.target.value as FlipStyle })}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="none">Sin efecto</option>
              <option value="imageVertical">Voltereta de Imagen Vertical</option>
              <option value="imageHorizontal">Voltereta de Imagen Horizontal</option>
              <option value="borderVertical">Voltereta de Borde de Imagen Vertical</option>
              <option value="borderHorizontal">Voltereta de Borde de Imagen Horizontal</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};
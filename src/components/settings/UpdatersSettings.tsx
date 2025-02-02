import React from 'react';
import { ChartSettings } from '../../types/SettingsTypes';
import { ParsedData } from '../../types/DataTypes';

interface UpdatersSettingsProps {
  settings: ChartSettings['updaters'];
  data: ParsedData;
  onSettingsChange: (updates: Partial<ChartSettings['updaters']>) => void;
}

export const UpdatersSettings: React.FC<UpdatersSettingsProps> = ({
  settings,
  data,
  onSettingsChange,
}) => {
  const handleAddUpdater = (barLabel: string) => {
    const currentUpdaters = settings.updaters[barLabel] || [];
    const newUpdater = {
      columnIndex: 0,
      updateImage: undefined,
      updateColor: undefined
    };
    
    onSettingsChange({
      updaters: {
        ...settings.updaters,
        [barLabel]: [...currentUpdaters, newUpdater]
      }
    });
  };

  const handleRemoveUpdater = (barLabel: string, updaterIndex: number) => {
    const currentUpdaters = [...(settings.updaters[barLabel] || [])];
    currentUpdaters.splice(updaterIndex, 1);
    
    onSettingsChange({
      updaters: {
        ...settings.updaters,
        [barLabel]: currentUpdaters
      }
    });
  };

  const handleUpdaterChange = (
    barLabel: string, 
    updaterIndex: number, 
    updates: Partial<ChartSettings['updaters']['updaters'][string][number]>
  ) => {
    const currentUpdaters = [...(settings.updaters[barLabel] || [])];
    currentUpdaters[updaterIndex] = {
      ...currentUpdaters[updaterIndex],
      ...updates
    };
    
    onSettingsChange({
      updaters: {
        ...settings.updaters,
        [barLabel]: currentUpdaters
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableUpdaters"
          checked={settings.enabled}
          onChange={(e) => onSettingsChange({ enabled: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="enableUpdaters" className="ml-2 text-sm text-gray-700">
          Activar actualizadores
        </label>
      </div>

      {settings.enabled && (
        <div className="space-y-6">
          {data.data.map((bar) => (
            <div key={bar.label} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{bar.label}</h3>
                <button
                  onClick={() => handleAddUpdater(bar.label)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Añadir Actualizador
                </button>
              </div>

              <div className="space-y-4">
                {(settings.updaters[bar.label] || []).map((updater, index) => (
                  <div key={index} className="border rounded p-4 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Actualizador {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveUpdater(bar.label, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Columna
                      </label>
                      <select
                        value={updater.columnIndex}
                        onChange={(e) => handleUpdaterChange(bar.label, index, {
                          columnIndex: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        {data.labels.map((label, labelIndex) => (
                          <option key={label} value={labelIndex}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`updateImage-${bar.label}-${index}`}
                        checked={!!updater.updateImage}
                        onChange={(e) => handleUpdaterChange(bar.label, index, {
                          updateImage: e.target.checked ? '' : undefined
                        })}
                        className="h-4 w-4 text-blue-500 rounded border-gray-300"
                      />
                      <label 
                        htmlFor={`updateImage-${bar.label}-${index}`}
                        className="text-sm text-gray-700"
                      >
                        Actualizar imagen
                      </label>
                    </div>

                    {updater.updateImage !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nueva URL de imagen
                        </label>
                        <input
                          type="text"
                          value={updater.updateImage}
                          onChange={(e) => handleUpdaterChange(bar.label, index, {
                            updateImage: e.target.value
                          })}
                          placeholder="URL de la imagen"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`updateColor-${bar.label}-${index}`}
                        checked={!!updater.updateColor}
                        onChange={(e) => handleUpdaterChange(bar.label, index, {
                          updateColor: e.target.checked ? '#000000' : undefined
                        })}
                        className="h-4 w-4 text-blue-500 rounded border-gray-300"
                      />
                      <label 
                        htmlFor={`updateColor-${bar.label}-${index}`}
                        className="text-sm text-gray-700"
                      >
                        Actualizar color
                      </label>
                    </div>

                    {updater.updateColor !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nuevo color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={updater.updateColor}
                            onChange={(e) => handleUpdaterChange(bar.label, index, {
                              updateColor: e.target.value
                            })}
                            className="h-10 w-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={updater.updateColor}
                            onChange={(e) => handleUpdaterChange(bar.label, index, {
                              updateColor: e.target.value
                            })}
                            placeholder="#000000"
                            className="flex-1 px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
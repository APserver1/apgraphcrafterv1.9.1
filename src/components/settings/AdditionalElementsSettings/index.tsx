import React from 'react';
import { ChartSettings } from '../../../types/SettingsTypes';
import { ParsedData } from '../../../types/DataTypes';
import { ImageList } from './ImageList';

interface AdditionalElementsSettingsProps {
  settings: ChartSettings['additionalElements'];
  data: ParsedData;
  onSettingsChange: (updates: Partial<ChartSettings['additionalElements']>) => void;
  onDataChange: (newData: ParsedData) => void;
}

export const AdditionalElementsSettings: React.FC<AdditionalElementsSettingsProps> = ({
  settings,
  data,
  onSettingsChange,
  onDataChange,
}) => {
  const addImage = () => {
    const newImages = [...settings.images, {
      enabled: true,
      size: 32,
      spacing: 8,
      descendingSize: false,
      sizeRatio: 0.75,
    }];
    onSettingsChange({ images: newImages });
  };

  const addFlag = () => {
    const newFlags = [...settings.flags, {
      enabled: true,
      size: 32,
      spacing: 8,
      descendingSize: false,
      sizeRatio: 0.75,
    }];
    onSettingsChange({ flags: newFlags });
  };

  const handleImageChange = (type: 'images' | 'flags') => (imageIndex: number) => (barIndex: number, url: string) => {
    const newData = { ...data };
    newData.data[barIndex].additionalImages = newData.data[barIndex].additionalImages || { images: [], flags: [] };
    newData.data[barIndex].additionalImages[type][imageIndex] = url;
    onDataChange(newData);
  };

  const handleImageSettingsChange = (type: 'images' | 'flags') => (index: number) => (updates: Partial<AdditionalImageSettings>) => {
    const newSettings = {
      ...settings,
      [type]: settings[type].map((item, i) => i === index ? { ...item, ...updates } : item)
    };
    onSettingsChange(newSettings);
  };

  const removeImage = (index: number) => {
    const newImages = settings.images.filter((_, i) => i !== index);
    onSettingsChange({ images: newImages });
  };

  const removeFlag = (index: number) => {
    const newFlags = settings.flags.filter((_, i) => i !== index);
    onSettingsChange({ flags: newFlags });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Imágenes Adicionales Por Barra</h3>
          <button
            onClick={addImage}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Añadir
          </button>
        </div>

        {settings.images.map((image, index) => (
          <ImageList
            key={index}
            data={data}
            settings={image}
            index={index}
            type="image"
            onImageChange={handleImageChange('images')(index)}
            onSettingsChange={handleImageSettingsChange('images')(index)}
            onRemove={() => removeImage(index)}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Banderas Por Barra</h3>
          <button
            onClick={addFlag}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Añadir
          </button>
        </div>

        {settings.flags.map((flag, index) => (
          <ImageList
            key={index}
            data={data}
            settings={flag}
            index={index}
            type="flag"
            onImageChange={handleImageChange('flags')(index)}
            onSettingsChange={handleImageSettingsChange('flags')(index)}
            onRemove={() => removeFlag(index)}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Insertar Imágenes</h3>
          <button
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled
          >
            Próximamente
          </button>
        </div>
      </div>
    </div>
  );
};
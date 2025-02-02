import React from 'react';
import { EmbeddingsSettings as EmbeddingsSettingsType, EmbeddedImage, EmbeddedText, EmbeddingPosition } from '../../types/SettingsTypes';
import { Image, Type } from 'lucide-react';

interface EmbeddingsSettingsProps {
  settings: EmbeddingsSettingsType;
  onSettingsChange: (updates: Partial<EmbeddingsSettingsType>) => void;
}

export const EmbeddingsSettings: React.FC<EmbeddingsSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const safeSettings = {
    enabled: settings?.enabled ?? false,
    images: settings?.images ?? [],
    texts: settings?.texts ?? []
  };

  const handleAddImage = () => {
    const newImage: EmbeddedImage = {
      url: '',
      width: 100,
      height: 100,
      position: 'front',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    };

    onSettingsChange({
      images: [...safeSettings.images, newImage]
    });
  };

  const handleAddText = () => {
    const newText: EmbeddedText = {
      content: '',
      fontSize: 16,
      fontFamily: 'sans-serif',
      color: '#000000',
      position: 'front',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    };

    onSettingsChange({
      texts: [...safeSettings.texts, newText]
    });
  };

  const handleImageChange = (index: number, updates: Partial<EmbeddedImage>) => {
    const newImages = [...safeSettings.images];
    newImages[index] = {
      ...newImages[index],
      ...updates
    };
    onSettingsChange({ images: newImages });
  };

  const handleTextChange = (index: number, updates: Partial<EmbeddedText>) => {
    const newTexts = [...safeSettings.texts];
    newTexts[index] = {
      ...newTexts[index],
      ...updates
    };
    onSettingsChange({ texts: newTexts });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = safeSettings.images.filter((_, i) => i !== index);
    onSettingsChange({ images: newImages });
  };

  const handleRemoveText = (index: number) => {
    const newTexts = safeSettings.texts.filter((_, i) => i !== index);
    onSettingsChange({ texts: newTexts });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableEmbeddings"
          checked={safeSettings.enabled}
          onChange={(e) => onSettingsChange({ enabled: e.target.checked })}
          className="h-4 w-4 text-blue-500 rounded border-gray-300"
        />
        <label htmlFor="enableEmbeddings" className="ml-2 text-sm text-gray-700">
          Habilitar incrustaciones
        </label>
      </div>

      {safeSettings.enabled && (
        <>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleAddImage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Image size={16} />
              <span>Incrustar imagen</span>
            </button>
            <button
              onClick={handleAddText}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Type size={16} />
              <span>Incrustar texto</span>
            </button>
          </div>

          {safeSettings.images.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-medium">Imágenes</h3>
              {safeSettings.images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Imagen {index + 1}</span>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la imagen
                    </label>
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => handleImageChange(index, { url: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ancho (px)
                      </label>
                      <input
                        type="number"
                        value={image.width}
                        onChange={(e) => handleImageChange(index, { width: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alto (px)
                      </label>
                      <input
                        type="number"
                        value={image.height}
                        onChange={(e) => handleImageChange(index, { height: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posición
                    </label>
                    <select
                      value={image.position}
                      onChange={(e) => handleImageChange(index, { position: e.target.value as EmbeddingPosition })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="front">Delante</option>
                      <option value="behind">Detrás</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Márgenes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Superior</label>
                        <input
                          type="number"
                          value={image.margins.top}
                          onChange={(e) => handleImageChange(index, { 
                            margins: { ...image.margins, top: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Inferior</label>
                        <input
                          type="number"
                          value={image.margins.bottom}
                          onChange={(e) => handleImageChange(index, { 
                            margins: { ...image.margins, bottom: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Izquierdo</label>
                        <input
                          type="number"
                          value={image.margins.left}
                          onChange={(e) => handleImageChange(index, { 
                            margins: { ...image.margins, left: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Derecho</label>
                        <input
                          type="number"
                          value={image.margins.right}
                          onChange={(e) => handleImageChange(index, { 
                            margins: { ...image.margins, right: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {safeSettings.texts.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-medium">Textos</h3>
              {safeSettings.texts.map((text, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Texto {index + 1}</span>
                    <button
                      onClick={() => handleRemoveText(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenido
                    </label>
                    <textarea
                      value={text.content}
                      onChange={(e) => handleTextChange(index, { content: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tamaño de fuente (px)
                    </label>
                    <input
                      type="number"
                      value={text.fontSize}
                      onChange={(e) => handleTextChange(index, { fontSize: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuente
                    </label>
                    <select
                      value={text.fontFamily}
                      onChange={(e) => handleTextChange(index, { fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={text.color}
                        onChange={(e) => handleTextChange(index, { color: e.target.value })}
                        className="w-10 h-10 rounded"
                      />
                      <input
                        type="text"
                        value={text.color}
                        onChange={(e) => handleTextChange(index, { color: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posición
                    </label>
                    <select
                      value={text.position}
                      onChange={(e) => handleTextChange(index, { position: e.target.value as EmbeddingPosition })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="front">Delante</option>
                      <option value="behind">Detrás</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Márgenes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Superior</label>
                        <input
                          type="number"
                          value={text.margins.top}
                          onChange={(e) => handleTextChange(index, { 
                            margins: { ...text.margins, top: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Inferior</label>
                        <input
                          type="number"
                          value={text.margins.bottom}
                          onChange={(e) => handleTextChange(index, { 
                            margins: { ...text.margins, bottom: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Izquierdo</label>
                        <input
                          type="number"
                          value={text.margins.left}
                          onChange={(e) => handleTextChange(index, { 
                            margins: { ...text.margins, left: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Derecho</label>
                        <input
                          type="number"
                          value={text.margins.right}
                          onChange={(e) => handleTextChange(index, { 
                            margins: { ...text.margins, right: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Project } from '../types/ProjectTypes';
import { publishTemplate } from '../utils/templateManager';

interface PublishTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const PublishTemplateDialog: React.FC<PublishTemplateDialogProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleTakeScreenshot = () => {
    const chartContent = document.querySelector('.chart-content') as HTMLElement;
    if (!chartContent) return;

    import('html2canvas').then((html2canvas) => {
      html2canvas.default(chartContent, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      }).then((canvas) => {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setThumbnail(dataUrl);
      });
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !thumbnail) return;

    setIsPublishing(true);
    try {
      await publishTemplate({
        name: name.trim(),
        description: description.trim(),
        tags,
        thumbnail,
        projectData: project
      });
      onClose();
    } catch (error) {
      console.error('Error publishing template:', error);
      alert('Error al publicar la plantilla. Por favor, intente de nuevo.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6">Publicar Plantilla</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Plantilla
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre descriptivo para tu plantilla"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Describe tu plantilla..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Añadir etiqueta"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Añadir
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miniatura
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleTakeScreenshot}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Camera className="w-5 h-5 mr-2" />
                <span>Tomar Captura</span>
              </button>
              {thumbnail && (
                <div className="border rounded-lg p-2">
                  <img
                    src={thumbnail}
                    alt="Vista previa de la miniatura"
                    className="w-full rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPublishing || !name.trim() || !thumbnail}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isPublishing ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
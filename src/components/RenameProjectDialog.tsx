import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RenameProjectDialogProps {
  project: {
    name: string;
  };
  onClose: () => void;
  onRename: (newName: string) => void;
}

export const RenameProjectDialog: React.FC<RenameProjectDialogProps> = ({
  project,
  onClose,
  onRename,
}) => {
  const [newName, setNewName] = useState(project.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(newName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Cambiar Nombre del Proyecto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del proyecto"
            className="w-full p-2 border rounded mb-4"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newName.trim() || newName.trim() === project.name}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
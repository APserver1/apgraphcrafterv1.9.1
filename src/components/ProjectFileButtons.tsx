import React, { useRef, useState } from 'react';
import { Download, Upload, Share2 } from 'lucide-react';
import { Project } from '../types/ProjectTypes';
import { exportProjectToFile, importProjectFromFile } from '../utils/projectFileManager';
import { PublishTemplateDialog } from './PublishTemplateDialog';

interface ProjectFileButtonsProps {
  currentProject: Project;
  onProjectImport: (project: Project) => void;
}

export const ProjectFileButtons: React.FC<ProjectFileButtonsProps> = ({
  currentProject,
  onProjectImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const handleExport = () => {
    exportProjectToFile(currentProject);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedProject = await importProjectFromFile(file);
        onProjectImport(importedProject);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error al importar el proyecto');
      }
      event.target.value = '';
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Download className="w-5 h-5 mr-2" />
        <span>Exportar Proyecto</span>
      </button>

      <button
        onClick={() => setShowPublishDialog(true)}
        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <Share2 className="w-5 h-5 mr-2" />
        <span>Publicar Plantilla</span>
      </button>

      <button
        onClick={handleImportClick}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Upload className="w-5 h-5 mr-2" />
        <span>Importar Proyecto</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".apgc"
        onChange={handleFileChange}
        className="hidden"
      />

      <PublishTemplateDialog
        isOpen={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        project={currentProject}
      />
    </>
  );
};
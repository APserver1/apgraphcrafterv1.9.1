import React from 'react';
import { ProjectMetadata } from '../types/ProjectTypes';

interface ProjectListProps {
  projects: ProjectMetadata[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelect,
  onDelete,
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No hay proyectos guardados
      </div>
    );
  }

  return (
    <div className="grid gap-4" key="project-list">
      {projects.map((project) => (
        <div
          key={`project-${project.id}`}
          className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
        >
          <div key={`info-${project.id}`}>
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-sm text-gray-500">
              Última modificación: {new Date(project.lastModified).toLocaleString()}
            </p>
          </div>
          <div key={`buttons-${project.id}`} className="flex gap-2">
            <button
              onClick={() => onSelect(project.id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Abrir
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
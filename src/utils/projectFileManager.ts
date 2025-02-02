import { Project } from '../types/ProjectTypes';

const PROJECT_FILE_EXTENSION = '.apgc';

export const exportProjectToFile = (project: Project) => {
  try {
    // Create a clean copy of the project to ensure we only export what we need
    const projectToExport = {
      id: project.id,
      name: project.name,
      lastModified: Date.now(), // Use current timestamp
      settings: JSON.parse(JSON.stringify(project.settings)), // Deep clone settings
      data: JSON.parse(JSON.stringify(project.data)) // Deep clone data
    };

    // Convert to JSON with proper formatting
    const projectData = JSON.stringify(projectToExport, null, 2);
    
    // Create blob and download
    const blob = new Blob([projectData], { 
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}${PROJECT_FILE_EXTENSION}`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting project:', error);
    throw new Error('Error al exportar el proyecto. Por favor, intente de nuevo.');
  }
};

export const importProjectFromFile = (file: File): Promise<Project> => {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(PROJECT_FILE_EXTENSION)) {
      reject(new Error('Formato de archivo inválido. Por favor seleccione un archivo .apgc'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Error al leer el archivo');
        }

        // Parse and validate project data
        const projectData = JSON.parse(e.target.result as string);
        
        // Validate required fields
        if (!projectData.id || !projectData.name || !projectData.settings || !projectData.data) {
          throw new Error('El archivo del proyecto está corrupto o incompleto');
        }

        // Create a clean copy of the project
        const importedProject: Project = {
          id: projectData.id,
          name: projectData.name,
          lastModified: Date.now(), // Use current timestamp for import
          settings: JSON.parse(JSON.stringify(projectData.settings)), // Deep clone settings
          data: JSON.parse(JSON.stringify(projectData.data)) // Deep clone data
        };

        resolve(importedProject);
      } catch (error) {
        console.error('Error parsing project file:', error);
        reject(new Error('Error al leer el archivo del proyecto. El archivo puede estar corrupto.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo del proyecto.'));
    };
    
    reader.readAsText(file);
  });
};
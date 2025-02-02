import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { ProjectDialog } from './ProjectDialog';
import { ProjectList } from './ProjectList';
import { getProjectList, deleteProject } from '../utils/projectStorage';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Template } from '../types/TemplateTypes';

interface ProjectSelectorProps {
  onNewProject: (name: string) => void;
  onOpenProject: (id: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  onNewProject,
  onOpenProject,
}) => {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProjects();
    }
    loadFeaturedTemplates();
  }, [user]);

  const loadProjects = async () => {
    try {
      const projectList = await getProjectList();
      setProjects(projectList);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('No se pudieron cargar los proyectos. Por favor, recargue la página.');
    }
  };

  const loadFeaturedTemplates = async () => {
    try {
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('*, ratings(*)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (templatesError) throw templatesError;

      const templates = templatesData.map(template => {
        const ratings = template.ratings || [];
        const averageRating = ratings.length > 0
          ? ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratings.length
          : 0;

        return {
          id: template.id,
          name: template.name,
          description: template.description || '',
          tags: template.tags,
          thumbnail: template.thumbnail,
          projectData: template.project_data,
          userId: template.user_id,
          createdAt: template.created_at,
          averageRating,
          totalRatings: ratings.length
        };
      }).sort((a, b) => b.averageRating - a.averageRating);

      setFeaturedTemplates(templates);
    } catch (error) {
      console.error('Error loading featured templates:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      await loadProjects();
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('No se pudo eliminar el proyecto. Por favor, intente de nuevo.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <img 
            src="https://i.imgur.com/FKMp9fq.png" 
            alt="A.P. Graph Crafter Logo"
            className="w-48 h-48 mb-8 mx-auto"
          />
          <h2 className="text-2xl font-bold mb-4">Inicia sesión para continuar</h2>
          <p className="text-gray-600">
            Necesitas iniciar sesión para crear y gestionar tus proyectos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Left Column - Projects */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-8">
                <img 
                  src="https://i.imgur.com/FKMp9fq.png" 
                  alt="A.P. Graph Crafter Logo"
                  className="w-32 h-32 mb-6"
                />
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={() => setShowNewDialog(true)}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-8"
                >
                  Nuevo Proyecto
                </button>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Mis Proyectos</h2>
                  <ProjectList
                    projects={projects}
                    onSelect={onOpenProject}
                    onDelete={handleDeleteProject}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Templates */}
          <div className="w-96">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Link to="/templates" className="block">
                <h2 className="text-xl font-semibold mb-4 hover:text-blue-500 transition-colors">
                  Plantillas Destacadas
                </h2>
              </Link>
              <div className="space-y-4">
                {featuredTemplates.map((template) => (
                  <Link
                    key={template.id}
                    to={`/templates/${template.id}`}
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin vista previa
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium mb-1">{template.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{template.averageRating.toFixed(1)}</span>
                      <span className="mx-1">•</span>
                      <span>{template.totalRatings} {template.totalRatings === 1 ? 'valoración' : 'valoraciones'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          A.P Company © 2025
        </div>

        <ProjectDialog
          isOpen={showNewDialog}
          onClose={() => setShowNewDialog(false)}
          onSubmit={onNewProject}
          title="Nuevo Proyecto"
          submitLabel="Crear"
        />
      </div>
    </div>
  );
};
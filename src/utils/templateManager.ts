import { supabase } from '../lib/supabase';
import { Template, TemplateData } from '../types/TemplateTypes';
import { Project } from '../types/ProjectTypes';
import { v4 as uuidv4 } from 'uuid';

export const publishTemplate = async (data: TemplateData): Promise<void> => {
  try {
    // Validate the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Usuario no autenticado');

    // Create the project file content
    const projectFile = {
      id: uuidv4(),
      name: data.name,
      lastModified: Date.now(),
      settings: data.projectData.settings,
      data: data.projectData.data
    };

    // Insert the template with the project data directly
    const { error: insertError } = await supabase
      .from('templates')
      .insert({
        name: data.name,
        description: data.description,
        tags: data.tags,
        thumbnail: data.thumbnail,
        project_data: projectFile, // Store as JSON directly
        user_id: user.id
      });

    if (insertError) throw insertError;
  } catch (error) {
    console.error('Error publishing template:', error);
    throw new Error('Error al publicar la plantilla. Por favor, intente de nuevo.');
  }
};

export const getTemplates = async (): Promise<Template[]> => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*, ratings(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(template => {
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
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Error al obtener las plantillas');
  }
};

export const useTemplate = async (template: Template): Promise<string> => {
  try {
    // The project data is already in JSON format, no need to decode
    const projectData = template.projectData as unknown as Project;
    
    // Generate new project ID
    const projectId = uuidv4();
    
    const newProject: Project = {
      ...projectData,
      id: projectId,
      name: `${template.name} - Copia`,
      lastModified: Date.now()
    };

    // Validate the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('Usuario no autenticado');

    const { error: insertError } = await supabase
      .from('projects')
      .insert({
        id: projectId,
        name: newProject.name,
        settings: newProject.settings,
        data: newProject.data,
        last_modified: new Date(newProject.lastModified).toISOString(),
        user_id: user.id
      });

    if (insertError) throw insertError;
    return projectId;
  } catch (error) {
    console.error('Error using template:', error);
    throw new Error('Error al usar la plantilla');
  }
};
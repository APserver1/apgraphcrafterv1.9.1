import { Project, ProjectMetadata } from '../types/ProjectTypes';
import { supabase } from '../lib/supabase';

export const saveProject = async (project: Project): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        name: project.name,
        settings: project.settings,
        data: project.data,
        last_modified: new Date(project.lastModified).toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving project:', error);
    throw new Error('No se pudo guardar el proyecto. Por favor, intente de nuevo.');
  }
};

export const getProject = async (id: string): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      settings: data.settings,
      data: data.data,
      lastModified: new Date(data.last_modified).getTime()
    };
  } catch (error) {
    console.error('Error getting project:', error);
    return null;
  }
};

export const getProjectList = async (): Promise<ProjectMetadata[]> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return [];

    const { data, error } = await supabase
      .from('projects')
      .select('id, name, last_modified')
      .eq('user_id', userId)
      .order('last_modified', { ascending: false });

    if (error) throw error;

    return data.map(project => ({
      id: project.id,
      name: project.name,
      lastModified: new Date(project.last_modified).getTime()
    }));
  } catch (error) {
    console.error('Error getting project list:', error);
    return [];
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('No se pudo eliminar el proyecto. Por favor, intente de nuevo.');
  }
};
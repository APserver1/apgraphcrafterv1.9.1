import React, { useState, useEffect } from 'react';
import { Template } from '../types/TemplateTypes';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { EditTemplateDialog } from '../components/EditTemplateDialog';
import { Settings, LayoutDashboard, FileText, BarChart2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  template: {
    id: string;
    name: string;
    thumbnail: string | null;
  };
  user: {
    username: string;
    avatar_url: string | null;
  };
}

export const Studio = () => {
  const { user, profile } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: profile?.username || '',
    avatarUrl: profile?.avatar_url || '',
    bannerUrl: profile?.banner_url || '',
    bio: profile?.bio || ''
  });

  useEffect(() => {
    if (user) {
      loadTemplates();
      loadRecentComments();
    }
  }, [user]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        tags: template.tags,
        thumbnail: template.thumbnail,
        projectData: template.project_data,
        userId: template.user_id,
        createdAt: template.created_at,
        averageRating: 0,
        totalRatings: 0
      })));
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          template:templates(id, name, thumbnail),
          user:profiles(username, avatar_url)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentComments(data as Comment[]);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          avatar_url: profileData.avatarUrl,
          banner_url: profileData.bannerUrl,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil. Por favor, intente de nuevo.');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error al eliminar la plantilla. Por favor, intente de nuevo.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Por favor, inicia sesión para acceder al Studio.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Panel de Control</h2>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Información Personal</h3>
                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL del Avatar
                      </label>
                      <input
                        type="text"
                        value={profileData.avatarUrl}
                        onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL del Banner
                      </label>
                      <input
                        type="text"
                        value={profileData.bannerUrl}
                        onChange={(e) => setProfileData({ ...profileData, bannerUrl: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Biografía
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleProfileUpdate}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={profile?.avatar_url || 'https://via.placeholder.com/64'}
                        alt={profile?.username}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium">{profile?.username}</h4>
                        <p className="text-sm text-gray-600">
                          {profile?.bio || 'Sin biografía'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Editar Perfil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'content':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Mis Plantillas</h2>
              
              {templates.length === 0 ? (
                <p className="text-gray-600">No has publicado ninguna plantilla aún.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-white border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-100 relative">
                        {template.thumbnail ? (
                          <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            Sin miniatura
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {template.description || 'Sin descripción'}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => setEditingTemplate(template)}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <p className="text-gray-600">Contenido próximamente disponible</p>
          </div>
        );
      case 'comments':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Comentarios Recientes</h2>
            {recentComments.length === 0 ? (
              <p className="text-gray-600">No has realizado ningún comentario aún</p>
            ) : (
              <div className="space-y-6">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                    <Link 
                      to={`/templates/${comment.template.id}`}
                      className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded overflow-hidden"
                    >
                      {comment.template.thumbnail ? (
                        <img
                          src={comment.template.thumbnail}
                          alt={comment.template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin miniatura
                        </div>
                      )}
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={comment.user.avatar_url || 'https://via.placeholder.com/32'}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <span className="font-medium">{comment.user.username}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            comentó en {comment.template.name}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Panel lateral */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">Studio</h1>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard size={20} />
                <span>Panel de Control</span>
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'content' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText size={20} />
                <span>Contenido</span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'stats' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart2 size={20} />
                <span>Estadísticas</span>
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'comments' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={20} />
                <span>Comentarios</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 py-12 px-8">
          {renderContent()}
        </div>
      </div>

      {editingTemplate && (
        <EditTemplateDialog
          isOpen={true}
          onClose={() => setEditingTemplate(null)}
          template={editingTemplate}
          onUpdate={loadTemplates}
        />
      )}
    </div>
  );
};
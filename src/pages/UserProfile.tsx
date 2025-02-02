import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Template } from '../types/TemplateTypes';

interface UserProfileData {
  id: string;
  username: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  createdAt: string;
}

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      setError(null);
      // Cargar perfil del usuario
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

      setProfile({
        id: profileData.id,
        username: profileData.username,
        avatarUrl: profileData.avatar_url,
        bannerUrl: profileData.banner_url,
        bio: profileData.bio,
        createdAt: profileData.created_at
      });

      // Cargar plantillas del usuario
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('*, ratings(*)')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      setTemplates(templatesData.map(template => {
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
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Error al cargar el perfil. Por favor, recarga la página.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Usuario no encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ 
          backgroundImage: profile.bannerUrl 
            ? `url(${profile.bannerUrl})` 
            : 'linear-gradient(to right, #0040ff, #0080ff)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  <img
                    className="mx-auto h-32 w-32 rounded-full border-4 border-white shadow-lg"
                    src={profile.avatarUrl || 'https://via.placeholder.com/128'}
                    alt={profile.username}
                  />
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
                  <p className="text-sm font-medium text-gray-600">
                    Miembro desde {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                  {profile.bio && (
                    <p className="mt-2 text-gray-600 max-w-2xl whitespace-pre-wrap">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Plantillas Publicadas</h2>
          
          {templates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-600">Este usuario aún no ha publicado plantillas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Link
                  key={template.id}
                  to={`/templates/${template.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Sin vista previa
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
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
                    <div className="flex items-center text-sm text-gray-500">
                      <span>⭐ {template.averageRating.toFixed(1)}</span>
                      <span className="mx-2">•</span>
                      <span>{template.totalRatings} {template.totalRatings === 1 ? 'valoración' : 'valoraciones'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
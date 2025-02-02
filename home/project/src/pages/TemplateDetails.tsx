import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Template, TemplateRating } from '../types/TemplateTypes';
import { useAuth } from '../hooks/useAuth';
import { useTemplate } from '../utils/templateManager';
import { CommentSection } from '../components/CommentSection';

interface UserProfileData {
  id: string;
  username: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  createdAt: string;
}

export const TemplateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [creator, setCreator] = useState<{ username: string; avatarUrl: string | null } | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    if (id) {
      loadTemplate();
    }
  }, [id]);

  const loadTemplate = async () => {
    if (!id) return;

    try {
      // Load template
      const { data: templateData, error: templateError } = await supabase
        .from('templates')
        .select('*, ratings(*)')
        .eq('id', id)
        .single();

      if (templateError) throw templateError;

      // Calculate average rating
      const ratings = templateData.ratings || [];
      const averageRating = ratings.length > 0
        ? ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratings.length
        : 0;

      const template: Template = {
        id: templateData.id,
        name: templateData.name,
        description: templateData.description,
        tags: templateData.tags,
        thumbnail: templateData.thumbnail,
        projectData: templateData.project_data,
        userId: templateData.user_id,
        createdAt: templateData.created_at,
        averageRating,
        totalRatings: ratings.length,
      };

      setTemplate(template);

      // Load creator info
      const { data: creatorData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', template.userId)
        .single();

      if (creatorData) {
        setCreator({
          username: creatorData.username,
          avatarUrl: creatorData.avatar_url,
        });
      }

      // Load user's rating if exists
      if (user) {
        const { data: userRatingData } = await supabase
          .from('ratings')
          .select('rating')
          .eq('template_id', id)
          .eq('user_id', user.id)
          .single();

        if (userRatingData) {
          setUserRating(userRatingData.rating);
        }
      }
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!user || !template || isRating) return;

    try {
      setIsRating(true);
      const { error } = await supabase
        .from('ratings')
        .upsert({
          template_id: template.id,
          user_id: user.id,
          rating,
        }, {
          onConflict: 'template_id,user_id'
        });

      if (error) throw error;

      setUserRating(rating);
      await loadTemplate(); // Reload to update average
    } catch (error) {
      console.error('Error rating template:', error);
      alert('Error al calificar la plantilla. Por favor, intente de nuevo.');
    } finally {
      setIsRating(false);
    }
  };

  const handleUseTemplate = async () => {
    if (!user || !template) return;
    
    try {
      setIsUsingTemplate(true);
      const projectId = await useTemplate(template);
      navigate(`/?project=${projectId}`);
    } catch (error) {
      console.error('Error using template:', error);
      alert('Error al usar la plantilla. Por favor, intente de nuevo.');
    } finally {
      setIsUsingTemplate(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plantilla no encontrada</h2>
          <p className="text-gray-600">La plantilla que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/templates"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Volver a Plantillas</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h1>
                {creator && (
                  <Link
                    to={`/user/${creator.username}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <img
                      src={creator.avatarUrl || 'https://via.placeholder.com/32'}
                      alt={creator.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{creator.username}</span>
                  </Link>
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleRating(star)}
                        className="p-1"
                        disabled={!user || isRating}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoveredRating || userRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {template.averageRating.toFixed(1)} ({template.totalRatings} {template.totalRatings === 1 ? 'voto' : 'votos'})
                  </span>
                </div>
                {!user && (
                  <p className="text-sm text-gray-500">
                    Inicia sesión para calificar
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {template.description || 'Sin descripción'}
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={handleUseTemplate}
                disabled={isUsingTemplate || !user}
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUsingTemplate ? 'Creando proyecto...' : 'Usar Plantilla'}
              </button>
              {!user && (
                <p className="mt-2 text-sm text-gray-500">
                  Debes iniciar sesión para usar esta plantilla
                </p>
              )}
            </div>

            <div className="mt-12">
              <CommentSection 
                templateId={template.id} 
                onCommentAdded={loadTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
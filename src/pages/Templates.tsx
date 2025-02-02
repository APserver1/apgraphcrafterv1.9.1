import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Tag, User } from 'lucide-react';
import { Template } from '../types/TemplateTypes';
import { getTemplates, useTemplate } from '../utils/templateManager';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
}

export const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplatesAndSearch();
  }, [searchTerm]); // Buscar cuando cambie el término de búsqueda

  const loadTemplatesAndSearch = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Cargar plantillas
      const fetchedTemplates = await getTemplates();
      setTemplates(fetchedTemplates);
      
      // Extraer tags únicos
      const tags = Array.from(new Set(fetchedTemplates.flatMap(t => t.tags)));
      setAllTags(tags);

      // Buscar usuarios si hay término de búsqueda
      if (searchTerm) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, bio')
          .ilike('username', `%${searchTerm}%`)
          .order('username')
          .limit(20);

        if (profilesError) throw profilesError;
        setUserProfiles(profilesData || []);
      } else {
        setUserProfiles([]);
      }
    } catch (error) {
      console.error('Error loading templates and users:', error);
      setError('Error al cargar el contenido. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleUseTemplate = async (template: Template) => {
    if (!user) {
      alert('Debes iniciar sesión para usar esta plantilla');
      return;
    }

    try {
      const projectId = await useTemplate(template);
      navigate(`/?project=${projectId}`);
    } catch (error) {
      console.error('Error using template:', error);
      alert('Error al usar la plantilla. Por favor, intente de nuevo.');
    }
  };

  // Filtrar resultados combinados
  const filteredResults = [...templates, ...userProfiles.map(profile => ({
    type: 'user' as const,
    ...profile
  }))].filter(item => {
    const matchesSearch = 'type' in item
      ? item.username.toLowerCase().includes(searchTerm.toLowerCase())
      : item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = 'type' in item
      ? true // Los usuarios no tienen tags
      : selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explorar</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar plantillas o usuarios..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Tag size={14} />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => (
            'type' in item ? (
              // Renderizar perfil de usuario
              <Link
                key={item.id}
                to={`/user/${item.username}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-4 flex items-center gap-4">
                  <img
                    src={item.avatar_url || 'https://via.placeholder.com/64'}
                    alt={item.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User size={20} />
                      {item.username}
                    </h3>
                    {item.bio && (
                      <p className="text-sm text-gray-600 mt-1">{item.bio}</p>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              // Renderizar plantilla
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link to={`/templates/${item.id}`}>
                  <div className="aspect-video bg-gray-100 relative">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Sin vista previa
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>

                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleUseTemplate(item)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Usar Plantilla
                  </button>
                </div>
              </div>
            )
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  );
};
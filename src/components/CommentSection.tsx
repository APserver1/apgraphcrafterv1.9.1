import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommentSectionProps {
  templateId: string;
  onCommentAdded: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  templateId,
  onCommentAdded,
}) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    loadComments();
  }, [templateId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('template_id', templateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data as Comment[]);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Error al cargar los comentarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          template_id: templateId,
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment('');
      await loadComments();
      onCommentAdded();
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Error al publicar el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comentarios</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Comentario'}
          </button>
        </form>
      ) : (
        <p className="text-gray-600">
          Debes iniciar sesión para comentar
        </p>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600">No hay comentarios aún</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={comment.profiles.avatar_url || 'https://via.placeholder.com/40'}
                alt={comment.profiles.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.profiles.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
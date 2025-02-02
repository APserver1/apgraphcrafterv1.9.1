import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Verificar si el usuario ya existe
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUsers) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('Este correo electrónico ya está registrado');
        }
        throw signUpError;
      }

      if (!user?.id) throw new Error('No se pudo crear el usuario');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username }]);

      if (profileError) {
        if (profileError.code === '23505') {
          throw new Error('El nombre de usuario ya está en uso');
        }
        throw profileError;
      }

      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ¡Registro exitoso!
        </h3>
        <p className="text-gray-600">
          Por favor, revisa tu correo electrónico para confirmar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de Usuario
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0040ff] focus:border-transparent"
          required
          minLength={3}
          maxLength={20}
          pattern="^[a-zA-Z0-9_-]+$"
          title="Solo letras, números, guiones y guiones bajos"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0040ff] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0040ff] focus:border-transparent"
          minLength={6}
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Mínimo 6 caracteres
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-[#0040ff] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
};
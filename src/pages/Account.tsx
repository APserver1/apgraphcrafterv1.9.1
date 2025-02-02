import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Account = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Por favor, inicia sesión para ver tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Mi Cuenta</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Información Personal</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Nombre de Usuario:</span> {profile?.username}</p>
                  <p><span className="font-medium">Correo Electrónico:</span> {user.email}</p>
                  <p><span className="font-medium">Miembro desde:</span> {new Date(profile?.created_at || '').toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Preferencias</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">Las preferencias de la cuenta estarán disponibles próximamente.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Plan Actual</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">Plan Gratuito</p>
                  <a href="/premium" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    Actualizar a Premium
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
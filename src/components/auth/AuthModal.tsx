import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login'
}) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-center ${
                view === 'login'
                  ? 'border-b-2 border-[#0040ff] text-[#0040ff]'
                  : 'text-gray-500'
              }`}
              onClick={() => setView('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                view === 'register'
                  ? 'border-b-2 border-[#0040ff] text-[#0040ff]'
                  : 'text-gray-500'
              }`}
              onClick={() => setView('register')}
            >
              Registrarse
            </button>
          </div>
        </div>

        {view === 'login' ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}
      </div>
    </div>
  );
};
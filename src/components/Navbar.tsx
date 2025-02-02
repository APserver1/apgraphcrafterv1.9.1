import React, { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from './auth/AuthModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Studio', href: '/studio' },
    { label: 'Cuenta', href: '/account' },
    { label: 'Plantillas', href: '/templates' },
    { label: 'Premium', href: '/premium' },
    { label: 'Términos y Servicios', href: '/terms' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-[#0040ff] shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="ml-3 flex items-center">
                <img
                  src="https://i.imgur.com/FKMp9fq.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-white text-sm">A.P Graph Crafter Alpha 1.9.2</span>
              </Link>
            </div>

            <div className="flex items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to={`/user/${profile?.username}`}
                    className="text-white hover:text-gray-200"
                  >
                    {profile?.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white hover:bg-blue-700 rounded"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } absolute w-64 bg-white shadow-lg rounded-b-lg z-50`}
        >
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-[#0040ff]"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

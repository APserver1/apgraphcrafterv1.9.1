import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart as ChartBar, Play, Users, Zap, ArrowRight } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';

export const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(https://i.imgur.com/OGvxBad.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3) blur(4px)',
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-white sm:text-7xl">
            Transforma Tus Datos En
            <span className="relative whitespace-nowrap text-blue-400">
              <span className="relative"> Experiencias Visuales</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            La forma más avanzada y poderosa de crear gráficas animadas, permitiéndote presentar información de manera clara, entretenida y profesional.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <button
              onClick={() => setShowAuthModal(true)}
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 transition-all hover:scale-105"
            >
              Comenzar Gratis <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section with Image */}
      <div className="py-24 bg-white sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Visualización de Datos</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para dar vida a tus datos
            </p>
          </div>

          <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <img
              src="https://i.imgur.com/hIOJLO4.png"
              alt="Visualización de datos"
              className="rounded-xl shadow-2xl lg:order-2 w-full object-cover aspect-video"
            />
            
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:order-1">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                    <ChartBar className="h-6 w-6 text-white" />
                  </div>
                  Gráficas Dinámicas
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Crea visualizaciones interactivas y animadas que capturan la atención de tu audiencia.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  Fácil de Usar
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Interfaz intuitiva que te permite crear gráficas profesionales sin conocimientos técnicos.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  Resultados Profesionales
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Obtén visualizaciones de calidad profesional listas para usar en tus presentaciones.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src="https://i.imgur.com/QI2mQ8x.jpeg"
          alt="About Us Background"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-20"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Sobre Nosotros</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              A.P Graph Crafter es una iniciativa de A.P Company, garantizando calidad, innovación y un entorno fácil de usar para que lleves tus presentaciones al siguiente nivel.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Empieza gratis hoy
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Descubre el poder de los datos animados con A.P Graph Crafter
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => setShowAuthModal(true)}
                className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white transition-all hover:scale-105"
              >
                Comenzar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView="register"
      />
    </div>
  );
};
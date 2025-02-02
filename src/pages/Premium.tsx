import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: PlanFeature[];
  color: string;
  popular?: boolean;
  free?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    color: 'gray',
    free: true,
    features: [
      { name: 'Sin Acceso a funciones Premium', included: true },
      { name: 'Acceso a 1 plantilla premium por mes', included: true },
      { name: 'Creación de 5 proyectos a la vez', included: true },
      { name: 'Acceso a funciones experimentales', included: false },
      { name: 'Soporte 24/7', included: false },
      { name: 'Solicitud de funciones a los desarrolladores', included: false },
    ]
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 3,
    color: 'blue',
    features: [
      { name: 'Acceso a todas las funciones premium', included: true },
      { name: 'Acceso a 5 plantillas premium por mes', included: true },
      { name: 'Creación de 15 proyectos a la vez', included: true },
      { name: 'Acceso a funciones experimentales', included: false },
      { name: 'Soporte 24/7', included: false },
      { name: 'Solicitud de funciones a los desarrolladores', included: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    color: 'purple',
    popular: true,
    features: [
      { name: 'Acceso a todas las funciones premium', included: true },
      { name: 'Acceso a 15 plantillas premium por mes', included: true },
      { name: 'Creación de 25 proyectos a la vez', included: true },
      { name: 'Acceso a funciones experimentales', included: true },
      { name: 'Soporte 24/7', included: false },
      { name: 'Solicitud de funciones a los desarrolladores', included: false },
    ]
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 15,
    color: 'indigo',
    features: [
      { name: 'Acceso a todas las funciones premium', included: true },
      { name: 'Acceso a 30 plantillas premium por mes', included: true },
      { name: 'Creación ilimitada de proyectos a la vez', included: true },
      { name: 'Acceso a funciones experimentales', included: true },
      { name: 'Soporte 24/7', included: true },
      { name: 'Solicitud de funciones a los desarrolladores', included: true },
    ]
  }
];

export const Premium = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculatePrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    if (isAnnual) {
      const annualPrice = basePrice * 12;
      const discount = annualPrice * 0.15;
      return annualPrice - discount;
    }
    return basePrice;
  };

  const handleSelectPlan = (plan: Plan) => {
    if (!user) {
      // Si el usuario no está autenticado, mostrar modal de login
      return;
    }
    if (plan.free) {
      // Si es el plan gratuito, no hacer nada
      return;
    }
    navigate(`/checkout/${plan.id}?billing=${isAnnual ? 'annual' : 'monthly'}`);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      gray: {
        bg: 'bg-gray-500',
        hover: 'hover:bg-gray-600',
        border: 'border-gray-500',
        text: 'text-gray-500'
      },
      blue: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        border: 'border-blue-500',
        text: 'text-blue-500'
      },
      purple: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600',
        border: 'border-purple-500',
        text: 'text-purple-500'
      },
      indigo: {
        bg: 'bg-indigo-500',
        hover: 'hover:bg-indigo-600',
        border: 'border-indigo-500',
        text: 'text-indigo-500'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Planes y Precios
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative flex items-center p-1 bg-gray-100 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                !isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Anual
            </button>
          </div>
        </div>

        {isAnnual && (
          <p className="text-center mt-4 text-green-600 font-medium">
            ¡15% de descuento en planes anuales!
          </p>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          {plans.map((plan) => {
            const colorClasses = getColorClasses(plan.color);
            const price = calculatePrice(plan.price);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-sm ${
                  plan.popular ? 'border-purple-500 shadow-purple-100' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
                      <Star className="h-4 w-4" />
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${price}
                    </span>
                    <span className="ml-1 text-sm font-medium text-gray-500">
                      /{isAnnual ? 'año' : 'mes'}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 space-y-4 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check
                        className={`h-5 w-5 ${
                          feature.included ? colorClasses.text : 'text-gray-300'
                        }`}
                      />
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={plan.free}
                  className={`w-full rounded-lg px-4 py-3 text-center font-medium text-white transition-colors ${
                    plan.free ? 'bg-gray-300 cursor-not-allowed' : `${colorClasses.bg} ${colorClasses.hover}`
                  }`}
                >
                  {plan.free ? 'Plan Actual' : `Comenzar con ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            ¿Tienes preguntas sobre nuestros planes?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
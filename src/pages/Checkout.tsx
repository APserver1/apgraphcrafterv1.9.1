import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Palette as PayPal, CreditCard, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { 
  stripePromise, 
  paypalOptions, 
  PayPalScriptProvider, 
  PayPalButtons,
  createStripeSession,
  createPayPalSubscription 
} from '../lib/payments';

const paymentMethods = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: PayPal,
    description: 'Pago seguro con PayPal'
  },
  {
    id: 'card',
    name: 'Tarjeta de Crédito/Débito',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express'
  }
];

export const Checkout = () => {
  const { planId } = useParams();
  const [searchParams] = useSearchParams();
  const billingType = searchParams.get('billing') || 'monthly';
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Crear sesión de Stripe
      const session = await createStripeSession(planId!, billingType);
      
      // Redirigir a la página de pago de Stripe
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe!.redirectToCheckout({
        sessionId: session.id
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err) {
      console.error('Error processing Stripe payment:', err);
      setError('Error al procesar el pago. Por favor, intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Crear suscripción de PayPal
      const subscription = await createPayPalSubscription(planId!, billingType);
      
      // La redirección se maneja automáticamente por el botón de PayPal
      return subscription;
    } catch (err) {
      console.error('Error processing PayPal payment:', err);
      setError('Error al procesar el pago. Por favor, intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    if (selectedMethod === 'card') {
      await handleStripePayment();
    } else if (selectedMethod === 'paypal') {
      await handlePayPalPayment();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Por favor, inicia sesión para continuar.</p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/premium')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Planes
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Compra</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Método de Pago
                </h3>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <method.icon className={`w-6 h-6 ${
                          selectedMethod === method.id ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {selectedMethod === 'paypal' ? (
                <PayPalButtons
                  createSubscription={handlePayPalPayment}
                  onApprove={async (data) => {
                    // Actualizar estado de suscripción
                    await supabase
                      .from('subscriptions')
                      .upsert({
                        user_id: user.id,
                        plan_id: planId,
                        billing_type: billingType,
                        status: 'active',
                        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                      });
                    
                    navigate('/checkout/success');
                  }}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    setError('Error al procesar el pago con PayPal');
                  }}
                  style={{ layout: 'vertical' }}
                />
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedMethod}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Procesando...' : 'Realizar Pago'}
                </button>
              )}

              <p className="text-sm text-gray-500 text-center">
                Al realizar el pago, aceptas nuestros{' '}
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  términos y condiciones
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};
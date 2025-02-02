import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from './supabase';

// Cargar las claves desde variables de entorno
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

// Planes y precios
const PLANS = {
  basic: {
    monthly: {
      stripe: 'price_basic_monthly',
      paypal: 'P-basic_monthly',
      amount: 3
    },
    annual: {
      stripe: 'price_basic_annual',
      paypal: 'P-basic_annual',
      amount: 30.6 // $3 * 12 - 15%
    }
  },
  pro: {
    monthly: {
      stripe: 'price_pro_monthly',
      paypal: 'P-pro_monthly',
      amount: 9
    },
    annual: {
      stripe: 'price_pro_annual',
      paypal: 'P-pro_annual',
      amount: 91.8 // $9 * 12 - 15%
    }
  },
  ultra: {
    monthly: {
      stripe: 'price_ultra_monthly',
      paypal: 'P-ultra_monthly',
      amount: 15
    },
    annual: {
      stripe: 'price_ultra_annual',
      paypal: 'P-ultra_annual',
      amount: 153 // $15 * 12 - 15%
    }
  }
};

// Inicializar Stripe
export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// Configuración de PayPal
export const paypalOptions = {
  'client-id': PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'subscription',
  vault: true
};

// Función para crear una sesión de Stripe
export const createStripeSession = async (planId: string, billingType: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const plan = PLANS[planId as keyof typeof PLANS]?.[billingType as 'monthly' | 'annual'];
    if (!plan) throw new Error('Plan no válido');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRIPE_PUBLIC_KEY}`
      },
      body: JSON.stringify({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price: plan.stripe,
          quantity: 1
        }],
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/premium`,
        customer_email: user.email,
        client_reference_id: user.id
      })
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
};

// Función para crear una suscripción de PayPal
export const createPayPalSubscription = async (planId: string, billingType: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const plan = PLANS[planId as keyof typeof PLANS]?.[billingType as 'monthly' | 'annual'];
    if (!plan) throw new Error('Plan no válido');

    return {
      planId: plan.paypal,
      customId: user.id,
      amount: plan.amount
    };
  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    throw error;
  }
};

export { PayPalScriptProvider, PayPalButtons };
/*
  # Crear sistema de suscripciones

  1. Nueva Tabla
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key a profiles)
      - `plan_id` (text, identificador del plan)
      - `billing_type` (text, mensual o anual)
      - `status` (text, estado de la suscripción)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Seguridad
    - Enable RLS
    - Políticas para lectura y escritura
*/

-- Crear tabla de suscripciones
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  billing_type text NOT NULL CHECK (billing_type IN ('monthly', 'annual')),
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Crear índices
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);
CREATE INDEX subscriptions_current_period_end_idx ON subscriptions(current_period_end);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
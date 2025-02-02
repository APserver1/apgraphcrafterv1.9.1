/*
  # Add template ratings and description

  1. Changes
    - Add description column to templates table
    - Create ratings table for template ratings
    - Add RLS policies for ratings

  2. Security
    - Enable RLS on ratings table
    - Add policies for creating and viewing ratings
*/

-- Add description to templates
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS description text;

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(template_id, user_id)
);

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policies for ratings
CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create ratings"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX ratings_template_id_idx ON ratings(template_id);
CREATE INDEX ratings_user_id_idx ON ratings(user_id);
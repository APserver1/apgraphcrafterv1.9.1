/*
  # Add comments and usage tracking

  1. New Tables
    - `template_uses`: Track template usage
      - `id` (uuid, primary key)
      - `template_id` (uuid, references templates)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

    - `comments`: Store template comments
      - `id` (uuid, primary key)
      - `template_id` (uuid, references templates)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing, creating, updating, and deleting comments
    - Add policies for tracking template usage
*/

-- Create template_uses table
CREATE TABLE IF NOT EXISTS template_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS for template_uses
ALTER TABLE template_uses ENABLE ROW LEVEL SECURITY;

-- Policies for template_uses
CREATE POLICY "Anyone can view template uses count"
  ON template_uses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can record template use"
  ON template_uses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to update updated_at on comments
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX template_uses_template_id_idx ON template_uses(template_id);
CREATE INDEX template_uses_user_id_idx ON template_uses(user_id);
CREATE INDEX template_uses_created_at_idx ON template_uses(created_at);

CREATE INDEX comments_template_id_idx ON comments(template_id);
CREATE INDEX comments_user_id_idx ON comments(user_id);
CREATE INDEX comments_created_at_idx ON comments(created_at);
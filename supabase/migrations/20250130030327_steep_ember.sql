/*
  # Fix templates and profiles relation

  1. Changes
    - Add foreign key constraint between templates.user_id and profiles.id
    - Add index for templates.user_id
    - Update templates query to use proper join

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing foreign key if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'templates_user_id_fkey' 
    AND table_name = 'templates'
  ) THEN
    ALTER TABLE templates DROP CONSTRAINT templates_user_id_fkey;
  END IF;
END $$;

-- Add new foreign key constraint
ALTER TABLE templates
ADD CONSTRAINT templates_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;

-- Create index for the foreign key if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'templates' 
    AND indexname = 'templates_user_id_profiles_idx'
  ) THEN
    CREATE INDEX templates_user_id_profiles_idx ON templates(user_id);
  END IF;
END $$;
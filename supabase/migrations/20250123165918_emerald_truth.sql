/*
  # Add relationship between comments and profiles tables

  This migration safely adds a foreign key relationship between comments and profiles tables
  to enable proper joins in queries, handling cases where constraints might already exist.
*/

DO $$ 
BEGIN
  -- Drop the constraint if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'comments_user_id_fkey' 
    AND table_name = 'comments'
  ) THEN
    ALTER TABLE comments DROP CONSTRAINT comments_user_id_fkey;
  END IF;

  -- Add the foreign key constraint
  ALTER TABLE comments
  ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id)
  ON DELETE CASCADE;
END $$;

-- Create index for the foreign key if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND indexname = 'comments_user_id_profiles_idx'
  ) THEN
    CREATE INDEX comments_user_id_profiles_idx ON comments(user_id);
  END IF;
END $$;
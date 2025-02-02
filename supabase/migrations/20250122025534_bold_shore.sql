-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop template_uses policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'template_uses' 
    AND policyname = 'Anyone can view template uses count'
  ) THEN
    DROP POLICY "Anyone can view template uses count" ON template_uses;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'template_uses' 
    AND policyname = 'Authenticated users can record template use'
  ) THEN
    DROP POLICY "Authenticated users can record template use" ON template_uses;
  END IF;

  -- Drop comments policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Anyone can view comments'
  ) THEN
    DROP POLICY "Anyone can view comments" ON comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Authenticated users can create comments'
  ) THEN
    DROP POLICY "Authenticated users can create comments" ON comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Users can update own comments'
  ) THEN
    DROP POLICY "Users can update own comments" ON comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND policyname = 'Users can delete own comments'
  ) THEN
    DROP POLICY "Users can delete own comments" ON comments;
  END IF;
END $$;

-- Create template_uses table if it doesn't exist
CREATE TABLE IF NOT EXISTS template_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS for template_uses
ALTER TABLE template_uses ENABLE ROW LEVEL SECURITY;

-- Create policies for template_uses
CREATE POLICY "Anyone can view template uses count"
  ON template_uses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can record template use"
  ON template_uses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create comments table if it doesn't exist
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

-- Create policies for comments
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

-- Create trigger for comments updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_comments_updated_at'
  ) THEN
    CREATE TRIGGER update_comments_updated_at
      BEFORE UPDATE ON comments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'template_uses' 
    AND indexname = 'template_uses_template_id_idx'
  ) THEN
    CREATE INDEX template_uses_template_id_idx ON template_uses(template_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'template_uses' 
    AND indexname = 'template_uses_user_id_idx'
  ) THEN
    CREATE INDEX template_uses_user_id_idx ON template_uses(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'template_uses' 
    AND indexname = 'template_uses_created_at_idx'
  ) THEN
    CREATE INDEX template_uses_created_at_idx ON template_uses(created_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND indexname = 'comments_template_id_idx'
  ) THEN
    CREATE INDEX comments_template_id_idx ON comments(template_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND indexname = 'comments_user_id_idx'
  ) THEN
    CREATE INDEX comments_user_id_idx ON comments(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'comments' 
    AND indexname = 'comments_created_at_idx'
  ) THEN
    CREATE INDEX comments_created_at_idx ON comments(created_at);
  END IF;
END $$;
/*
  # Update templates table structure
  
  1. Changes
    - Remove thumbnail_index column
    - Make thumbnail column nullable
*/

DO $$ 
BEGIN
  -- Drop thumbnail_index column if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'templates' 
    AND column_name = 'thumbnail_index'
  ) THEN
    ALTER TABLE templates DROP COLUMN thumbnail_index;
  END IF;

  -- Ensure thumbnail column exists and is nullable
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'templates' 
    AND column_name = 'thumbnail'
  ) THEN
    ALTER TABLE templates ADD COLUMN thumbnail text;
  ELSE
    ALTER TABLE templates ALTER COLUMN thumbnail DROP NOT NULL;
  END IF;
END $$;
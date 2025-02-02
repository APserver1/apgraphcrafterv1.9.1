/*
  # Add profile fields
  
  1. New Fields
    - avatar_url: URL de la imagen de perfil
    - banner_url: URL del banner del perfil
    - bio: Biografía del usuario
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS banner_url text,
ADD COLUMN IF NOT EXISTS bio text;
/*
  # Add thumbnail column to templates table

  1. Changes
    - Add thumbnail column to templates table to store base64 encoded preview images
*/

alter table templates
add column if not exists thumbnail text;
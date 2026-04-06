-- Migration: Add content_type column to folders table
-- This column stores the locked file type category (audio, video, image, archive, document, other)
-- It is set automatically when the first file is uploaded to the folder

ALTER TABLE folders ADD COLUMN IF NOT EXISTS content_type TEXT;
COMMENT ON COLUMN folders.content_type IS 'Locked file type category (audio, video, image, archive, document, other). Set by the first file uploaded.';

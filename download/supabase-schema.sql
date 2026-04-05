-- ============================================
-- CLOUD MEDIA HOST - SUPABASE SCHEMA
-- ============================================
-- Ejecuta este SQL en Supabase Dashboard → SQL Editor
-- ============================================

-- Tabla de configuracion de la app
-- Guarda credenciales de Google Drive (Service Account y/o OAuth2), Cloudinary y password admin
CREATE TABLE IF NOT EXISTS app_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- Solo permite 1 fila
  drive_credentials JSONB NOT NULL DEFAULT '{}',     -- Service Account JSON completo
  drive_folder_id TEXT,                              -- ID de la carpeta principal (backward compat)
  folders JSONB NOT NULL DEFAULT '[]'::jsonb,        -- Array de carpetas vinculadas
  cloudinary_cloud_name TEXT,
  cloudinary_upload_preset TEXT,
  admin_password_hash TEXT,
  -- OAuth2 fields (recommended for personal Gmail accounts)
  oauth2_client_id TEXT,                             -- OAuth2 Client ID from Google Cloud Console
  oauth2_client_secret TEXT,                         -- OAuth2 Client Secret
  oauth2_refresh_token TEXT,                         -- OAuth2 Refresh Token (obtained via callback)
  oauth2_user_email TEXT,                            -- Email of the connected Google account
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar fila vacia si no existe
INSERT INTO app_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;


-- Tabla de carpetas/workspaces
-- Cada carpeta vinculada de Google Drive es un workspace independiente
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  drive_folder_id TEXT NOT NULL,             -- ID de la carpeta en Google Drive
  drive_link TEXT,                           -- URL de la carpeta (para carpetas creadas por API)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para buscar por drive_folder_id (evitar duplicados al guardar config)
CREATE INDEX IF NOT EXISTS idx_folders_drive_id ON folders(drive_folder_id);


-- Tabla de archivos
-- Cada archivo subido se registra aqui con metadatos
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY DEFAULT substr(md5(random()::text || clock_timestamp()::text), 1, 12),
  name TEXT NOT NULL,
  original_name TEXT,  -- Original file name (before folder path prefix)
  type TEXT NOT NULL DEFAULT 'application/octet-stream',
  size BIGINT NOT NULL DEFAULT 0,
  size_display TEXT,
  type_display TEXT,
  icon TEXT,
  drive_id TEXT NOT NULL,                    -- ID del archivo en Google Drive
  download_url TEXT NOT NULL,                -- URL de descarga directa
  embed_url TEXT,
  cloudinary_id TEXT,
  cloudinary_url TEXT,
  thumbnail_url TEXT,
  stream_url TEXT,
  folder_id TEXT REFERENCES folders(id) ON DELETE SET NULL,  -- Carpeta a la que pertenece
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- date_display removed: use to_char(created_at, 'DD/MM/YYYY') in queries instead
  -- Previous GENERATED ALWAYS column caused INSERT errors via PostgREST API
);

-- Helper function to get formatted date (replaces generated column)
CREATE OR REPLACE FUNCTION get_date_display() RETURNS TEXT AS $$
  SELECT to_char(NOW() AT TIME ZONE 'America/Santo_Domingo', 'DD/MM/YYYY');
$$ LANGUAGE sql STABLE;

-- Indices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_drive_id ON files(drive_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);


-- ============================================
-- POLITICAS DE SEGURIDAD (Row Level Security)
-- ============================================
-- Descomenta ESTAS lineas si quieres que las consultas
-- requieran el anon key de Supabase (recomendado para produccion)
-- ============================================

-- Habilitar RLS en todas las tablas
-- ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Permitir lectura/escritura con la API key de servicio (service_role)
-- Esto permite que el Worker use el service_role key sin restricciones
-- CREATE POLICY "Service role full access" ON app_config
--   FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Service role full access" ON folders
--   FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Service role full access" ON files
--   FOR ALL USING (true) WITH CHECK (true);


-- ============================================
-- FUNCIONES UTILITARIAS
-- ============================================

-- Funcion para contar archivos por carpeta
CREATE OR REPLACE FUNCTION count_files_by_folder(fid TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*) FROM files WHERE folder_id = fid;
$$ LANGUAGE sql STABLE;


-- Funcion para actualizar el updated_at de config automaticamente
CREATE OR REPLACE FUNCTION update_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER config_updated_at
  BEFORE UPDATE ON app_config
  FOR EACH ROW EXECUTE FUNCTION update_config_timestamp();


-- ============================================
-- VERIFICACION
-- ============================================
-- Ejecuta esto para verificar que todo se creo bien:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- Deberia mostrar: app_config, folders, files


-- ============================================
-- MIGRACION (ejecutar si ya tenias el schema anterior)
-- ============================================
-- Ejecutar ESTO en Supabase SQL Editor si ya tenias la BD creada:
--
-- ALTER TABLE files ADD COLUMN IF NOT EXISTS original_name TEXT;
-- ALTER TABLE files DROP COLUMN IF EXISTS date_display;
--
-- -- OAuth2 columns migration:
-- ALTER TABLE app_config ADD COLUMN IF NOT EXISTS oauth2_client_id TEXT;
-- ALTER TABLE app_config ADD COLUMN IF NOT EXISTS oauth2_client_secret TEXT;
-- ALTER TABLE app_config ADD COLUMN IF NOT EXISTS oauth2_refresh_token TEXT;
-- ALTER TABLE app_config ADD COLUMN IF NOT EXISTS oauth2_user_email TEXT;
-- ============================================

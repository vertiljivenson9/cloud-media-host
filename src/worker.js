/**
 * Cloud Media Host - Main Worker (Supabase Edition)
 * 
 * Database: Supabase PostgreSQL (immediate consistency, no KV delays)
 * 
 * Routes:
 *   GET  /                     → Dashboard HTML (or Setup page if not configured)
 *   GET  /setup                → Setup / Configuration page
 *   GET  /api/docs             → API Documentation
 *   GET  /api/status           → System status
 *   POST /api/config           → Save credentials
 *   GET  /api/config           → Get current config (admin only)
 *   DELETE /api/config         → Reset everything (admin only)
 *   POST /api/upload           → Upload file (optional ?folder_id=xxx)
 *   GET  /api/files            → List all files
 *   GET  /api/files/:id        → Get file info
 *   GET  /api/files/:id/download → Download file
 *   DELETE /api/files/:id      → Delete file (admin only)
 *   DELETE /api/files          → Delete all files (admin only)
 *   POST /api/folders          → Create a new folder/workspace
 *   GET  /api/folders          → List all folders with file counts
 *   GET  /api/folders/:id/files → List files in a specific folder
 *   DELETE /api/folders/:id    → Delete a folder and all its files
 *   POST /api/test-drive       → Test Google Drive connection
 */

import { hashPassword, generateId, formatSize, getFileIcon, isAllowedType } from './jwt.js';
import { uploadFile, deleteFile as deleteDriveFile, getDownloadUrl, getEmbedUrl, createFolder as createDriveFolder, deleteFolder as deleteDriveFolder } from './google-drive.js';
import { isCloudinarySupported, uploadFile as uploadToCloudinary, getVideoThumbnail, getVideoStreamUrl } from './cloudinary-client.js';
import { setupPage, dashboardPage, apiDocsPage } from './templates.js';
import { createClient } from './supabase.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-Folder-ID'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    try {
      const route = matchRoute(path);

      switch (route.pattern) {
        case '/': return handleIndex(request, env);
        case '/setup': return handleSetup(request, env);
        case '/api/docs': return handleApiDocs(request, env, url);
        case '/api/status': return handleStatus(request, env);
        case '/api/config':
          if (request.method === 'POST') return handleSaveConfig(request, env);
          if (request.method === 'DELETE') return handleResetConfig(request, env);
          if (request.method === 'GET') return handleGetConfig(request, env);
          break;
        case '/api/upload':
          if (request.method === 'POST') return handleUpload(request, env, url);
          break;
        case '/api/test-drive':
          if (request.method === 'POST') return handleTestDrive(request, env);
          break;
        case '/api/folders':
          if (request.method === 'POST') return handleCreateFolder(request, env);
          if (request.method === 'GET') return handleListFolders(request, env);
          break;
        case '/api/folders/:id':
          if (request.method === 'DELETE') return handleDeleteFolder(request, env, route.params.id);
          break;
        case '/api/folders/:id/files':
          if (request.method === 'GET') return handleListFolderFiles(request, env, route.params.id);
          break;
        case '/api/files':
          if (request.method === 'GET') return handleListFiles(request, env);
          if (request.method === 'DELETE') return handleDeleteAllFiles(request, env);
          break;
        case '/api/files/:id':
          if (request.method === 'GET') return handleGetFile(request, env, route.params.id);
          if (request.method === 'DELETE') return handleDeleteFile(request, env, route.params.id);
          break;
        case '/api/files/:id/download':
          if (request.method === 'GET') return handleDownloadFile(request, env, route.params.id);
          break;
      }

      return json({ error: 'Not found' }, 404);

    } catch (error) {
      console.error('Worker error:', error);
      return json({ error: error.message }, 500);
    }
  }
};

// ============================================
// ROUTER
// ============================================
function matchRoute(path) {
  const exact = ['/', '/setup', '/api/docs', '/api/status', '/api/config', '/api/upload', '/api/files', '/api/folders', '/api/test-drive'];
  for (const p of exact) {
    if (path === p) return { pattern: p, params: {} };
  }

  if (path.startsWith('/api/folders/') && path.endsWith('/files')) {
    const parts = path.split('/');
    if (parts.length === 5) return { pattern: '/api/folders/:id/files', params: { id: parts[3] } };
  }

  if (path.startsWith('/api/folders/')) {
    const parts = path.split('/');
    if (parts.length === 4) return { pattern: '/api/folders/:id', params: { id: parts[3] } };
  }

  if (path.startsWith('/api/files/')) {
    const parts = path.split('/');
    if (parts.length === 5 && parts[4] === 'download') return { pattern: '/api/files/:id/download', params: { id: parts[3] } };
    if (parts.length === 4) return { pattern: '/api/files/:id', params: { id: parts[3] } };
  }

  return { pattern: null, params: {} };
}

// ============================================
// HELPERS
// ============================================
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

function html(content) {
  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...CORS_HEADERS }
  });
}

function isApiRequest(request) {
  const accept = request.headers.get('Accept') || '';
  return accept.includes('application/json') || request.url.includes('/api/');
}

function getDb(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase no configurado. Agrega SUPABASE_URL y SUPABASE_SERVICE_KEY en wrangler.toml o como secrets en Cloudflare.');
  }
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
}

async function getConfig(env) {
  const db = getDb(env);
  return await db.select('app_config', '*', { filter: { id: 1 }, single: true });
}

async function verifyAdmin(request, env) {
  const config = await getConfig(env);
  if (!config || !config.admin_password_hash) return true;
  const providedKey = request.headers.get('X-Admin-Key');
  if (!providedKey) return false;
  const hash = await hashPassword(providedKey);
  return hash === config.admin_password_hash;
}

// ============================================
// HANDLERS
// ============================================

// GET / — Dashboard or Setup
async function handleIndex(request, env) {
  if (isApiRequest(request)) return handleStatus(request, env);

  let config = null;
  try {
    config = await getConfig(env);
  } catch (e) {
    // Supabase not configured yet — show setup page
    console.error('getConfig error:', e.message);
    return html(setupPage());
  }

  if (!config || !config.drive_credentials) {
    return html(setupPage());
  }

  const db = getDb(env);
  let folders = [];
  let files = [];
  try {
    folders = await db.select('folders', '*', { order: 'created_at.desc' });
    files = await db.select('files', '*', { order: 'created_at.desc' });
  } catch (e) {
    console.error('DB query error:', e.message);
  }

  if (folders.length === 0) {
    config.folders = [];
    return html(setupPage(config));
  }

  // Attach folders to config for setup page compatibility
  config.folders = folders.map(f => ({
    id: f.id,
    name: f.name,
    drive_folder_id: f.drive_folder_id,
    drive_link: f.drive_link,
    created_at: f.created_at,
  }));

  files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return html(dashboardPage(config, files, folders));
}

// GET /setup — Configuration page
async function handleSetup(request, env) {
  if (isApiRequest(request)) return handleStatus(request, env);

  let config = null;
  try {
    config = await getConfig(env);
    if (config) {
      const db = getDb(env);
      const folders = await db.select('folders', '*', { order: 'created_at.desc' });
      config.folders = folders.map(f => ({
        id: f.id,
        name: f.name,
        drive_folder_id: f.drive_folder_id,
        drive_link: f.drive_link,
        created_at: f.created_at,
      }));
    }
  } catch (e) {
    console.error('handleSetup error:', e.message);
  }

  return html(setupPage(config));
}

// GET /api/docs
async function handleApiDocs(request, env, url) {
  return html(apiDocsPage(`${url.protocol}//${url.host}`));
}

// GET /api/status
async function handleStatus(request, env) {
  const db = getDb(env);
  const config = await getConfig(env);
  const fileCount = await db.count('files');
  const folderCount = await db.count('folders');

  return json({
    configured: !!(config && config.drive_credentials),
    database: 'supabase',
    services: {
      drive: !!(config?.drive_credentials),
      cloudinary: !!(config?.cloudinary_cloud_name)
    },
    file_count: fileCount,
    folder_count: folderCount,
    has_admin_password: !!config?.admin_password_hash
  });
}

// POST /api/config — Save configuration
async function handleSaveConfig(request, env) {
  try {
    const body = await request.json();
    const { drive_credentials, folders, cloudinary_cloud_name, cloudinary_upload_preset, admin_password } = body;
    const db = getDb(env);

    // Get existing config FIRST
    const existingConfig = await getConfig(env);

    // Validate credentials
    const credentials = drive_credentials || existingConfig?.drive_credentials;
    if (!credentials) {
      return json({ success: false, error: 'Google Drive credentials son obligatorios' }, 400);
    }

    // Build folder list from request
    const folderList = folders || [];

    if (folderList.length === 0 && !existingConfig) {
      return json({ success: false, error: 'Agrega al menos una carpeta de Google Drive' }, 400);
    }

    if (credentials.client_email && !credentials.private_key || !credentials.client_email && credentials.private_key) {
      return json({ success: false, error: 'Service Account JSON inválido (faltan client_email o private_key)' }, 400);
    }

    // Check admin if modifying existing config
    if (existingConfig?.drive_credentials && existingConfig.admin_password_hash) {
      const isAdmin = await verifyAdmin(request, env);
      if (!isAdmin) {
        return json({ success: false, error: 'Contraseña de admin requerida para modificar la configuración' }, 403);
      }
    }

    // Build config data for app_config table
    const configData = {
      drive_credentials: credentials,
      drive_folder_id: folderList.length > 0 ? folderList[0].drive_folder_id : (existingConfig?.drive_folder_id || null),
      admin_password_hash: admin_password ? await hashPassword(admin_password) : (existingConfig?.admin_password_hash || null),
      updated_at: new Date().toISOString(),
    };

    // Keep existing creation date
    if (existingConfig?.created_at) {
      configData.created_at = existingConfig.created_at;
    }

    // Cloudinary settings
    if (cloudinary_cloud_name && cloudinary_upload_preset) {
      configData.cloudinary_cloud_name = cloudinary_cloud_name;
      configData.cloudinary_upload_preset = cloudinary_upload_preset;
    } else if (existingConfig?.cloudinary_cloud_name) {
      configData.cloudinary_cloud_name = existingConfig.cloudinary_cloud_name;
      configData.cloudinary_upload_preset = existingConfig.cloudinary_upload_preset;
    }

    // Upsert app_config
    if (existingConfig) {
      await db.update('app_config', configData, { id: 1 });
    } else {
      configData.id = 1;
      await db.insert('app_config', configData);
    }

    // Upsert folders: update existing, insert new, remove deleted
    if (folderList.length > 0) {
      const existingFolders = await db.select('folders', '*');
      const existingByDriveId = {};
      for (const ef of existingFolders) {
        existingByDriveId[ef.drive_folder_id] = ef;
      }

      for (const folder of folderList) {
        if (!folder.drive_folder_id) continue;
        const existing = existingByDriveId[folder.drive_folder_id];
        if (existing) {
          await db.update('folders', { name: folder.name }, { id: existing.id });
        } else {
          await db.insert('folders', {
            name: folder.name,
            drive_folder_id: folder.drive_folder_id,
          });
        }
      }
    }

    return json({ success: true, message: `Configuración guardada. ${folderList.length} carpeta(s) vinculada(s).` });

  } catch (error) {
    console.error('Save config error:', error);
    return json({ success: false, error: 'Error al guardar: ' + error.message }, 500);
  }
}

// GET /api/config
async function handleGetConfig(request, env) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) return json({ error: 'Unauthorized' }, 401);

  const config = await getConfig(env);
  if (!config) return json({ configured: false });

  return json({
    configured: true,
    drive_folder_id: config.drive_folder_id,
    cloudinary_cloud_name: config.cloudinary_cloud_name || null,
    has_admin_password: !!config.admin_password_hash,
    created_at: config.created_at,
    database: 'supabase'
  });
}

// DELETE /api/config — Reset everything
async function handleResetConfig(request, env) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

  const db = getDb(env);
  await db.remove('files', {});
  await db.remove('folders', {});
  await db.update('app_config', {
    drive_credentials: {},
    drive_folder_id: null,
    cloudinary_cloud_name: null,
    cloudinary_upload_preset: null,
    admin_password_hash: null,
  }, { id: 1 });

  return json({ success: true, message: 'Configuración eliminada.' });
}

// ============================================
// FOLDER HANDLERS
// ============================================

// POST /api/folders — Create folder via API
async function handleCreateFolder(request, env) {
  const config = await getConfig(env);
  if (!config || !config.drive_credentials) {
    return json({ success: false, error: 'App no configurada' }, 400);
  }

  try {
    const body = await request.json();
    const folderName = (body.name || '').trim();
    if (!folderName) return json({ success: false, error: 'Nombre obligatorio' }, 400);
    if (folderName.length > 100) return json({ success: false, error: 'Nombre muy largo (max 100)' }, 400);

    const db = getDb(env);

    const driveResult = await createDriveFolder(
      config.drive_credentials,
      config.drive_folder_id,
      folderName
    );

    const folderRecord = {
      name: folderName,
      drive_folder_id: driveResult.id,
      drive_link: driveResult.webViewLink,
    };

    const inserted = await db.insert('folders', folderRecord);

    return json({ success: true, folder: inserted });
  } catch (error) {
    console.error('Create folder error:', error);
    return json({ success: false, error: 'Error al crear carpeta: ' + error.message }, 500);
  }
}

// GET /api/folders — List all folders with file counts
async function handleListFolders(request, env) {
  const db = getDb(env);
  const config = await getConfig(env);
  if (!config) return json({ success: false, error: 'App no configurada' }, 400);

  const folders = await db.select('folders', '*', { order: 'created_at.desc' });

  // Count files per folder in one query
  const fileFolderIds = await db.select('files', 'folder_id');
  const countMap = {};
  for (const f of fileFolderIds) {
    if (f.folder_id) countMap[f.folder_id] = (countMap[f.folder_id] || 0) + 1;
  }

  for (const folder of folders) {
    folder.file_count = countMap[folder.id] || 0;
  }

  return json({ folders, total: folders.length });
}

// GET /api/folders/:id/files
async function handleListFolderFiles(request, env, folderId) {
  const db = getDb(env);
  const config = await getConfig(env);
  if (!config) return json({ success: false, error: 'App no configurada' }, 400);

  const folder = await db.select('folders', '*', { filter: { id: folderId }, single: true });
  if (!folder) return json({ success: false, error: 'Carpeta no encontrada' }, 404);

  const files = await db.select('files', '*', { filter: { folder_id: folderId }, order: 'created_at.desc' });

  return json({ folder: { id: folder.id, name: folder.name }, files, total: files.length });
}

// DELETE /api/folders/:id
async function handleDeleteFolder(request, env, folderId) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

  const db = getDb(env);
  const config = await getConfig(env);

  const folder = await db.select('folders', '*', { filter: { id: folderId }, single: true });
  if (!folder) return json({ success: false, error: 'Carpeta no encontrada' }, 404);

  // Delete files in this folder from Drive
  const files = await db.select('files', '*', { filter: { folder_id: folderId } });
  let deletedFromDrive = 0;
  for (const file of files) {
    try {
      if (config?.drive_credentials && file.drive_id) {
        await deleteDriveFile(config.drive_credentials, file.drive_id);
        deletedFromDrive++;
      }
    } catch (e) {
      console.error(`Failed to delete file ${file.id} from Drive:`, e.message);
    }
  }

  // Delete files from DB
  if (files.length > 0) {
    await db.remove('files', { folder_id: folderId });
  }

  // Optionally delete the Drive folder itself (API-created only)
  try {
    if (config?.drive_credentials && folder.drive_link) {
      // Only delete from Drive if it was created via API (has drive_link)
      // Don't delete user-linked folders
    }
  } catch (e) {
    console.error(`Failed to delete Drive folder:`, e.message);
  }

  // Delete folder from DB
  await db.remove('folders', { id: folderId });

  return json({
    success: true,
    message: `Carpeta "${folder.name}" eliminada con ${deletedFromDrive} archivos de Drive`
  });
}

// ============================================
// DRIVE DIAGNOSTIC
// ============================================

async function handleTestDrive(request, env) {
  const config = await getConfig(env);
  if (!config || !config.drive_credentials) {
    return json({ success: false, error: 'No hay credenciales configuradas' }, 400);
  }

  const results = { steps: [], database: 'supabase' };
  const creds = config.drive_credentials;

  // Step 1
  results.steps.push({
    step: 1, name: 'Formato de credenciales', status: creds.client_email ? 'ok' : 'fail',
    detail: creds.client_email ? `Email: ${creds.client_email}` : 'Falta client_email'
  });
  if (!creds.client_email || !creds.private_key) return json(results);

  // Step 2
  try {
    const { getAccessToken } = await import('./jwt.js');
    await getAccessToken(creds);
    results.steps.push({ step: 2, name: 'Access token', status: 'ok', detail: 'Token OK' });
  } catch (e) {
    results.steps.push({ step: 2, name: 'Access token', status: 'fail', detail: e.message });
    return json(results);
  }

  // Step 3
  const db = getDb(env);
  const folders = await db.select('folders', '*');
  const defaultFolderId = config.drive_folder_id;
  results.steps.push({
    step: 3, name: 'Carpetas', status: folders.length > 0 ? 'ok' : 'warn',
    detail: `${folders.length} en BD. Default: ${defaultFolderId || 'NO DEFINIDA'}`
  });

  if (!defaultFolderId) {
    results.steps.push({ step: 4, name: 'Carpeta principal', status: 'fail', detail: 'No hay carpeta principal. Guarda la config de nuevo.' });
    return json(results);
  }

  // Step 4: Test folder access
  try {
    const { getAccessToken } = await import('./jwt.js');
    const token = await getAccessToken(creds);

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${defaultFolderId}'+in+parents&fields=files(id,name,size,mimeType)&pageSize=3`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (res.status === 404 || res.status === 403) {
      results.steps.push({
        step: 4, name: 'Acceso a carpeta', status: 'fail',
        detail: `${res.status}: La Service Account no tiene acceso a esta carpeta.`
      });
      results.steps.push({
        step: 5, name: 'SOLUCION', status: 'fix',
        detail: `Comparte la carpeta con "${creds.client_email}" como Editor.`
      });
    } else if (!res.ok) {
      results.steps.push({ step: 4, name: 'Acceso a carpeta', status: 'fail', detail: `Error ${res.status}` });
    } else {
      const data = await res.json();
      const fileList = data.files || [];
      results.steps.push({
        step: 4, name: 'Acceso a carpeta', status: 'ok',
        detail: `Carpeta OK. ${fileList.length} archivo(s) visible(s).`
      });
      results.steps.push({
        step: 5, name: 'Archivos', status: fileList.length > 0 ? 'ok' : 'warn',
        detail: fileList.length > 0
          ? fileList.map(f => `- ${f.name} (${formatSize(parseInt(f.size || 0))})`).join(' | ')
          : 'Carpeta vacia.'
      });
      results.success = true;
    }
  } catch (e) {
    results.steps.push({ step: 4, name: 'Acceso a carpeta', status: 'fail', detail: e.message });
  }

  return json(results);
}

// ============================================
// FILE HANDLERS
// ============================================

// POST /api/upload
async function handleUpload(request, env, url) {
  const config = await getConfig(env);
  if (!config || !config.drive_credentials) {
    return json({ success: false, error: 'App no configurada' }, 400);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return json({ success: false, error: 'No se encontró el archivo (campo "file")' }, 400);

    const fileName = file.name || 'unnamed';
    const contentType = file.type || 'application/octet-stream';
    console.log('Upload:', fileName, contentType);

    if (!isAllowedType(contentType)) {
      return json({ success: false, error: `Tipo no permitido: ${contentType}. Usa MP3, MP4, ZIP o imágenes.` }, 400);
    }

    const fileData = await file.arrayBuffer();
    if (fileData.byteLength > 104857600) {
      return json({ success: false, error: 'Máximo 100MB.' }, 400);
    }

    // Determine target folder
    let folderId = url.searchParams.get('folder_id') || formData.get('folder_id') || request.headers.get('X-Folder-ID') || null;
    let targetDriveFolderId = config.drive_folder_id;
    const db = getDb(env);

    if (folderId) {
      const folderRecord = await db.select('folders', '*', { filter: { id: folderId }, single: true });
      if (!folderRecord) return json({ success: false, error: 'Carpeta no encontrada' }, 400);
      targetDriveFolderId = folderRecord.drive_folder_id;
      if (!targetDriveFolderId) return json({ success: false, error: 'Carpeta sin ID de Drive' }, 400);
    }

    console.log('Target Drive folder:', targetDriveFolderId);

    // Upload to Google Drive
    const driveResult = await uploadFile(
      config.drive_credentials, targetDriveFolderId, fileName, contentType, fileData
    );
    console.log('Drive OK:', driveResult.id);

    // Build file record
    const fileRecord = {
      name: fileName,
      type: contentType,
      size: fileData.byteLength || driveResult.size || 0,
      size_display: formatSize(fileData.byteLength || driveResult.size || 0),
      type_display: getFileTypeDisplay(contentType),
      icon: getFileIcon(contentType),
      drive_id: driveResult.id,
      download_url: driveResult.downloadUrl,
      embed_url: getEmbedUrl(driveResult.id),
      date_display: new Date().toLocaleDateString('es'),
    };

    if (folderId) fileRecord.folder_id = folderId;

    // Optional: Cloudinary
    if (config.cloudinary_cloud_name && isCloudinarySupported(contentType)) {
      try {
        const cloudResult = await uploadToCloudinary(
          config.cloudinary_cloud_name, config.cloudinary_upload_preset,
          fileName, contentType, fileData
        );
        fileRecord.cloudinary_id = cloudResult.publicId;
        fileRecord.cloudinary_url = cloudResult.url;
        if (cloudResult.resourceType === 'video') {
          fileRecord.thumbnail_url = getVideoThumbnail(config.cloudinary_cloud_name, cloudResult.publicId);
          fileRecord.stream_url = getVideoStreamUrl(config.cloudinary_cloud_name, cloudResult.publicId);
        }
      } catch (cloudError) {
        console.error('Cloudinary warning:', cloudError.message);
      }
    }

    // Insert into Supabase (IMMEDIATE — no KV delay!)
    const inserted = await db.insert('files', fileRecord);
    console.log('Saved to DB:', inserted?.id || 'ok');

    return json({ success: true, file: inserted || fileRecord });

  } catch (error) {
    console.error('Upload error:', error);
    return json({ success: false, error: 'Error al subir: ' + error.message }, 500);
  }
}

// GET /api/files
async function handleListFiles(request, env) {
  const db = getDb(env);
  const config = await getConfig(env);
  if (!config) return json({ success: false, error: 'App no configurada' }, 400);

  const files = await db.select('files', '*', { order: 'created_at.desc' });
  return json({ files, total: files.length });
}

// GET /api/files/:id
async function handleGetFile(request, env, id) {
  const db = getDb(env);
  const file = await db.select('files', '*', { filter: { id }, single: true });
  if (!file) return json({ error: 'Archivo no encontrado' }, 404);
  return json({ file });
}

// GET /api/files/:id/download
async function handleDownloadFile(request, env, id) {
  const db = getDb(env);
  const file = await db.select('files', '*', { filter: { id }, single: true });
  if (!file) return json({ error: 'Archivo no encontrado' }, 404);

  if (file.stream_url && (request.headers.get('Accept')?.includes('video') || request.headers.get('Range'))) {
    return Response.redirect(file.stream_url, 302);
  }
  return Response.redirect(file.download_url, 302);
}

// DELETE /api/files/:id
async function handleDeleteFile(request, env, id) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

  const db = getDb(env);
  const file = await db.select('files', '*', { filter: { id }, single: true });
  if (!file) return json({ success: false, error: 'Archivo no encontrado' }, 404);

  const config = await getConfig(env);

  try {
    if (config?.drive_credentials && file.drive_id) {
      await deleteDriveFile(config.drive_credentials, file.drive_id);
    }
  } catch (e) {
    console.error('Drive delete warning:', e.message);
  }

  await db.remove('files', { id });
  return json({ success: true, message: 'Archivo eliminado' });
}

// DELETE /api/files — Delete all
async function handleDeleteAllFiles(request, env) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

  const db = getDb(env);
  const config = await getConfig(env);
  const files = await db.select('files', 'id, drive_id');

  let deleted = 0, errors = 0;
  for (const file of files) {
    try {
      if (config?.drive_credentials && file.drive_id) {
        await deleteDriveFile(config.drive_credentials, file.drive_id);
        deleted++;
      }
    } catch (e) {
      errors++;
      console.error(`Failed to delete ${file.id}:`, e.message);
    }
  }

  await db.remove('files', {});

  return json({ success: true, message: `${deleted} archivos eliminados de Drive${errors > 0 ? `, ${errors} errores` : ''}` });
}

// ============================================
// UTILITIES
// ============================================
function getFileTypeDisplay(contentType) {
  if (!contentType) return 'Archivo';
  if (contentType.startsWith('audio/')) return 'Audio';
  if (contentType.startsWith('video/')) return 'Video';
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('7z')) return 'Comprimido';
  if (contentType.startsWith('image/')) return 'Imagen';
  return 'Archivo';
}

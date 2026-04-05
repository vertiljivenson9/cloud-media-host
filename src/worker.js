/**
 * Cloud Media Host - Main Worker
 * 
 * Routes:
 *   GET  /                     → Dashboard HTML (or Setup page if not configured)
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
 */

import { hashPassword, generateId, formatSize, getFileIcon, isAllowedType } from './jwt.js';
import { uploadFile, deleteFile as deleteDriveFile, getDownloadUrl, getEmbedUrl, createFolder as createDriveFolder, deleteFolder as deleteDriveFolder } from './google-drive.js';
import { isCloudinarySupported, uploadFile as uploadToCloudinary, getVideoThumbnail, getVideoStreamUrl } from './cloudinary-client.js';
import { setupPage, dashboardPage, apiDocsPage } from './templates.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-Folder-ID'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    try {
      // ---- ROUTER ----
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
  // Exact routes first
  const exact = ['/', '/setup', '/api/docs', '/api/status', '/api/config', '/api/upload', '/api/files', '/api/folders'];
  for (const p of exact) {
    if (path === p) return { pattern: p, params: {} };
  }

  // /api/folders/:id/files — must match before /api/folders/:id
  if (path.startsWith('/api/folders/') && path.endsWith('/files')) {
    const parts = path.split('/');
    if (parts.length === 5) {
      return { pattern: '/api/folders/:id/files', params: { id: parts[3] } };
    }
  }

  // /api/folders/:id
  if (path.startsWith('/api/folders/')) {
    const parts = path.split('/');
    if (parts.length === 4) {
      return { pattern: '/api/folders/:id', params: { id: parts[3] } };
    }
  }

  // Parameterized routes for files
  if (path.startsWith('/api/files/')) {
    const parts = path.split('/');
    if (parts.length === 5 && parts[4] === 'download') {
      return { pattern: '/api/files/:id/download', params: { id: parts[3] } };
    }
    if (parts.length === 4) {
      return { pattern: '/api/files/:id', params: { id: parts[3] } };
    }
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

async function getAdminKey(env) {
  const config = await env.MEDIA_KV.get('app:config', 'json');
  return config?.admin_password_hash || null;
}

async function verifyAdmin(request, env) {
  const storedHash = await getAdminKey(env);
  if (!storedHash) return true; // No password set = open access
  const providedKey = request.headers.get('X-Admin-Key');
  if (!providedKey) return false;
  const hash = await hashPassword(providedKey);
  return hash === storedHash;
}

async function getConfig(env) {
  return await env.MEDIA_KV.get('app:config', 'json');
}

// ============================================
// HANDLERS
// ============================================

// GET / — Serve dashboard or setup page
async function handleIndex(request, env) {
  if (isApiRequest(request)) {
    return handleStatus(request, env);
  }

  const config = await getConfig(env);

  // Not configured → show setup
  if (!config || !config.drive_credentials) {
    return html(setupPage());
  }

  // Configured but no folders → show setup with existing config preloaded
  const storedFolders = config.folders || [];
  if (storedFolders.length === 0) {
    return html(setupPage(config));
  }

  // Configured → show dashboard
  const fileIds = await env.MEDIA_KV.get('app:files', 'json') || [];
  const files = [];
  for (const id of fileIds) {
    const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
    if (fileData) files.push(fileData);
  }

  // Load folders
  const folderIds = await env.MEDIA_KV.get('app:folders', 'json') || [];
  const folders = [];
  for (const id of folderIds) {
    const folderData = await env.MEDIA_KV.get(`folder:${id}`, 'json');
    if (folderData) folders.push(folderData);
  }
  folders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Sort files by newest first
  files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return html(dashboardPage(config, files, folders));
}

// GET /setup — Setup / Configuration page (accessible even when configured)
async function handleSetup(request, env) {
  if (isApiRequest(request)) {
    return handleStatus(request, env);
  }

  const config = await getConfig(env);
  // Always show setup page with existing config preloaded (if any)
  return html(setupPage(config));
}

// GET /api/docs — API documentation
async function handleApiDocs(request, env, url) {
  const baseUrl = `${url.protocol}//${url.host}`;
  return html(apiDocsPage(baseUrl));
}

// GET /api/status — System status
async function handleStatus(request, env) {
  const config = await getConfig(env);
  const fileIds = await env.MEDIA_KV.get('app:files', 'json') || [];
  const folderIds = await env.MEDIA_KV.get('app:folders', 'json') || [];

  return json({
    configured: !!(config && config.drive_credentials),
    services: {
      drive: !!(config?.drive_credentials),
      cloudinary: !!(config?.cloudinary_cloud_name)
    },
    file_count: fileIds.length,
    folder_count: folderIds.length,
    has_admin_password: !!config?.admin_password_hash
  });
}

// POST /api/config — Save configuration
async function handleSaveConfig(request, env) {
  try {
    const body = await request.json();
    const { drive_credentials, folders, cloudinary_cloud_name, cloudinary_upload_preset, admin_password, drive_folder_id } = body;

    // Support both old format (single drive_folder_id) and new format (folders array)
    const folderList = folders || (drive_folder_id ? [{ name: 'Principal', drive_folder_id }] : []);

    // If no credentials sent but existing config has them, keep existing (partial update)
    const credentials = drive_credentials || existingConfig?.drive_credentials;
    if (!credentials) {
      return json({ success: false, error: 'Google Drive credentials son obligatorios' }, 400);
    }

    if (folderList.length === 0) {
      return json({ success: false, error: 'Agrega al menos una carpeta de Google Drive' }, 400);
    }

    // Validate service account format
    if (!credentials.client_email || !credentials.private_key) {
      return json({ success: false, error: 'Service Account JSON inválido (faltan client_email o private_key)' }, 400);
    }

    // Check if there's already a config (needs admin password to overwrite)
    const existingConfig = await getConfig(env);
    if (existingConfig?.drive_credentials && existingConfig.admin_password_hash) {
      const isAdmin = await verifyAdmin(request, env);
      if (!isAdmin) {
        return json({ success: false, error: 'Contraseña de admin requerida para modificar la configuración' }, 403);
      }
    }

    // Build config object (store credentials but hash the password)
    const config = {
      drive_credentials: credentials,
      drive_folder_id: folderList[0].drive_folder_id, // Backward compat: first folder as default
      folders: folderList,
      admin_password_hash: admin_password ? await hashPassword(admin_password) : (existingConfig?.admin_password_hash || null),
      created_at: new Date().toISOString()
    };

    // Optional: Cloudinary (keep existing if not sent)
    if (cloudinary_cloud_name && cloudinary_upload_preset) {
      config.cloudinary_cloud_name = cloudinary_cloud_name;
      config.cloudinary_upload_preset = cloudinary_upload_preset;
    } else if (existingConfig?.cloudinary_cloud_name) {
      config.cloudinary_cloud_name = existingConfig.cloudinary_cloud_name;
      config.cloudinary_upload_preset = existingConfig.cloudinary_upload_preset;
    }

    // Preserve original creation date
    if (existingConfig?.created_at) {
      config.created_at = existingConfig.created_at;
    }

    // Save to KV
    await env.MEDIA_KV.put('app:config', JSON.stringify(config));

    // Initialize file list
    const existingFiles = await env.MEDIA_KV.get('app:files', 'json');
    if (!existingFiles) {
      await env.MEDIA_KV.put('app:files', JSON.stringify([]));
    }

    // Create workspace entries for each folder
    const folderIds = [];
    const existingFolderIds = await env.MEDIA_KV.get('app:folders', 'json') || [];
    const existingFolderMap = {};
    for (const fid of existingFolderIds) {
      const fd = await env.MEDIA_KV.get(`folder:${fid}`, 'json');
      if (fd) existingFolderMap[fd.drive_folder_id] = fd;
    }

    for (const folder of folderList) {
      let workspaceId = existingFolderMap[folder.drive_folder_id]?.id;
      if (!workspaceId) {
        workspaceId = generateId();
      }
      const folderData = {
        id: workspaceId,
        name: folder.name,
        drive_folder_id: folder.drive_folder_id,
        created_at: existingFolderMap[folder.drive_folder_id]?.created_at || new Date().toISOString()
      };
      await env.MEDIA_KV.put(`folder:${workspaceId}`, JSON.stringify(folderData));
      folderIds.push(workspaceId);
    }
    await env.MEDIA_KV.put('app:folders', JSON.stringify(folderIds));

    return json({ success: true, message: `Configuración guardada. ${folderList.length} carpeta(s) vinculada(s).` });

  } catch (error) {
    return json({ success: false, error: 'Error al guardar: ' + error.message }, 500);
  }
}

// GET /api/config — Get current config (admin only)
async function handleGetConfig(request, env) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const config = await getConfig(env);
  if (!config) {
    return json({ configured: false });
  }

  // Don't expose full credentials in response
  return json({
    configured: true,
    drive_folder_id: config.drive_folder_id,
    cloudinary_cloud_name: config.cloudinary_cloud_name || null,
    has_admin_password: !!config.admin_password_hash,
    created_at: config.created_at
  });
}

// DELETE /api/config — Reset everything
async function handleResetConfig(request, env) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  // Delete all keys (list and delete individually)
  const list = await env.MEDIA_KV.list({ prefix: '' });
  for (const key of list.keys) {
    await env.MEDIA_KV.delete(key.name);
  }

  return json({ success: true, message: 'Configuración eliminada. La app volverá al estado inicial.' });
}

// ============================================
// FOLDER HANDLERS
// ============================================

// POST /api/folders — Create a new folder/workspace
async function handleCreateFolder(request, env) {
  const config = await getConfig(env);
  if (!config || !config.drive_credentials) {
    return json({ success: false, error: 'App no configurada. Ve a / para configurar.' }, 400);
  }

  try {
    const body = await request.json();
    const folderName = (body.name || '').trim();

    if (!folderName) {
      return json({ success: false, error: 'El nombre de la carpeta es obligatorio' }, 400);
    }

    if (folderName.length > 100) {
      return json({ success: false, error: 'El nombre de la carpeta es demasiado largo (max 100 caracteres)' }, 400);
    }

    // Create folder in Google Drive
    const driveResult = await createDriveFolder(
      config.drive_credentials,
      config.drive_folder_id,
      folderName
    );

    // Generate folder ID for our system
    const folderId = generateId();

    // Build folder record
    const folderRecord = {
      id: folderId,
      name: folderName,
      drive_id: driveResult.id,
      drive_link: driveResult.webViewLink,
      created_at: new Date().toISOString(),
      file_count: 0
    };

    // Save folder record to KV
    await env.MEDIA_KV.put(`folder:${folderId}`, JSON.stringify(folderRecord));

    // Add to folder list
    const foldersList = await env.MEDIA_KV.get('app:folders', 'json') || [];
    foldersList.unshift(folderId);
    await env.MEDIA_KV.put('app:folders', JSON.stringify(foldersList));

    return json({
      success: true,
      folder: folderRecord
    });

  } catch (error) {
    console.error('Create folder error:', error);
    return json({ success: false, error: 'Error al crear carpeta: ' + error.message }, 500);
  }
}

// GET /api/folders — List all folders with file counts
async function handleListFolders(request, env) {
  const config = await getConfig(env);
  if (!config) {
    return json({ success: false, error: 'App no configurada' }, 400);
  }

  const folderIds = await env.MEDIA_KV.get('app:folders', 'json') || [];
  const fileIds = await env.MEDIA_KV.get('app:files', 'json') || [];

  // Count files per folder
  const fileCountMap = {};
  for (const fid of fileIds) {
    const fileData = await env.MEDIA_KV.get(`file:${fid}`, 'json');
    if (fileData && fileData.folder_id) {
      fileCountMap[fileData.folder_id] = (fileCountMap[fileData.folder_id] || 0) + 1;
    }
  }

  const folders = [];
  for (const id of folderIds) {
    const folderData = await env.MEDIA_KV.get(`folder:${id}`, 'json');
    if (folderData) {
      folderData.file_count = fileCountMap[id] || 0;
      folders.push(folderData);
    }
  }

  folders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return json({ folders, total: folders.length });
}

// GET /api/folders/:id/files — List files in a specific folder
async function handleListFolderFiles(request, env, folderId) {
  const config = await getConfig(env);
  if (!config) {
    return json({ success: false, error: 'App no configurada' }, 400);
  }

  // Verify folder exists
  const folderData = await env.MEDIA_KV.get(`folder:${folderId}`, 'json');
  if (!folderData) {
    return json({ success: false, error: 'Carpeta no encontrada' }, 404);
  }

  // Get all files and filter by folder_id
  const fileIds = await env.MEDIA_KV.get('app:files', 'json') || [];
  const files = [];

  for (const id of fileIds) {
    const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
    if (fileData && fileData.folder_id === folderId) {
      files.push(fileData);
    }
  }

  files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return json({
    folder: { id: folderData.id, name: folderData.name },
    files,
    total: files.length
  });
}

// DELETE /api/folders/:id — Delete a folder and all its files
async function handleDeleteFolder(request, env, folderId) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  const folderData = await env.MEDIA_KV.get(`folder:${folderId}`, 'json');
  if (!folderData) {
    return json({ success: false, error: 'Carpeta no encontrada' }, 404);
  }

  const config = await getConfig(env);

  // Delete all files in this folder from Drive and KV
  const fileIds = await env.MEDIA_KV.get('app:files', 'json') || [];
  let deletedFiles = 0;
  const remainingFileIds = [];

  for (const id of fileIds) {
    const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
    if (fileData && fileData.folder_id === folderId) {
      // Delete from Google Drive
      try {
        if (config?.drive_credentials && fileData.drive_id) {
          await deleteDriveFile(config.drive_credentials, fileData.drive_id);
          deletedFiles++;
        }
      } catch (e) {
        console.error(`Failed to delete file ${id} from Drive:`, e.message);
      }
      await env.MEDIA_KV.delete(`file:${id}`);
    } else {
      remainingFileIds.push(id);
    }
  }

  // Update file list (remove deleted files)
  await env.MEDIA_KV.put('app:files', JSON.stringify(remainingFileIds));

  // Delete the Drive folder itself (only for API-created folders, not user-linked ones)
  try {
    const driveFolderId = folderData.drive_id; // Only API-created folders have drive_id
    if (config?.drive_credentials && driveFolderId) {
      await deleteDriveFolder(config.drive_credentials, driveFolderId);
    }
  } catch (e) {
    console.error(`Failed to delete Drive folder ${folderId}:`, e.message);
  }

  // Remove folder from KV
  await env.MEDIA_KV.delete(`folder:${folderId}`);

  // Remove from folder list
  const foldersList = await env.MEDIA_KV.get('app:folders', 'json') || [];
  const updatedFolders = foldersList.filter(fid => fid !== folderId);
  await env.MEDIA_KV.put('app:folders', JSON.stringify(updatedFolders));

  return json({
    success: true,
    message: `Carpeta "${folderData.name}" eliminada con ${deletedFiles} archivos`
  });
}

// ============================================
// FILE HANDLERS
// ============================================

// POST /api/upload — Upload a file (optional folder_id via query param, form field, or header)
async function handleUpload(request, env, url) {
  const config = await getConfig(env);
  if (!config || !config.drive_credentials) {
    return json({ success: false, error: 'App no configurada. Ve a / para configurar.' }, 400);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return json({ success: false, error: 'No se encontró el archivo (campo "file")' }, 400);
    }

    const fileName = file.name || 'unnamed';
    const contentType = file.type || 'application/octet-stream';

    if (!isAllowedType(contentType)) {
      return json({ success: false, error: `Tipo no permitido: ${contentType}. Usa MP3, MP4, ZIP o imágenes.` }, 400);
    }

    // Read file data
    const fileData = await file.arrayBuffer();

    // Check file size (max 100MB for Worker limits)
    if (fileData.byteLength > 104857600) {
      return json({ success: false, error: 'Archivo demasiado grande. Máximo 100MB.' }, 400);
    }

    // Determine folder_id from: query param > form field > header
    let folderId = url.searchParams.get('folder_id') || formData.get('folder_id') || request.headers.get('X-Folder-ID') || null;

    // If a folder_id is provided, verify it exists and get the Drive folder ID
    let targetDriveFolderId = config.drive_folder_id; // Default: first linked folder
    let folderRecord = null;

    if (folderId) {
      folderRecord = await env.MEDIA_KV.get(`folder:${folderId}`, 'json');
      if (!folderRecord) {
        return json({ success: false, error: 'Carpeta no encontrada. El folder_id no es válido.' }, 400);
      }
      // Support both field names: drive_folder_id (setup-linked) and drive_id (API-created)
      targetDriveFolderId = folderRecord.drive_folder_id || folderRecord.drive_id;
      if (!targetDriveFolderId) {
        return json({ success: false, error: 'La carpeta no tiene un ID de Google Drive asociado.' }, 400);
      }
    }

    // Upload to Google Drive
    const driveResult = await uploadFile(
      config.drive_credentials,
      targetDriveFolderId,
      fileName,
      contentType,
      fileData
    );

    // Generate file ID
    const fileId = generateId();

    // Build file record
    const fileRecord = {
      id: fileId,
      name: fileName,
      type: contentType,
      size: fileData.byteLength || driveResult.size || 0,
      size_display: formatSize(fileData.byteLength || driveResult.size || 0),
      type_display: getFileTypeDisplay(contentType),
      icon: getFileIcon(contentType),
      drive_id: driveResult.id,
      download_url: driveResult.downloadUrl,
      embed_url: getEmbedUrl(driveResult.id),
      created_at: new Date().toISOString(),
      date_display: new Date().toLocaleDateString('es')
    };

    // Add folder_id to file record if provided
    if (folderId) {
      fileRecord.folder_id = folderId;
    }

    // Optional: Upload to Cloudinary (images and videos only)
    if (config.cloudinary_cloud_name && isCloudinarySupported(contentType)) {
      try {
        const cloudResult = await uploadToCloudinary(
          config.cloudinary_cloud_name,
          config.cloudinary_upload_preset,
          fileName,
          contentType,
          fileData
        );
        fileRecord.cloudinary_id = cloudResult.publicId;
        fileRecord.cloudinary_url = cloudResult.url;

        if (cloudResult.resourceType === 'video') {
          fileRecord.thumbnail_url = getVideoThumbnail(config.cloudinary_cloud_name, cloudResult.publicId);
          fileRecord.stream_url = getVideoStreamUrl(config.cloudinary_cloud_name, cloudResult.publicId);
        }
      } catch (cloudError) {
        // Cloudinary failed but file is already in Drive - non-critical
        console.error('Cloudinary upload warning:', cloudError.message);
      }
    }

    // Save file record to KV
    await env.MEDIA_KV.put(`file:${fileId}`, JSON.stringify(fileRecord));

    // Add to file list
    const filesList = await env.MEDIA_KV.get('app:files', 'json') || [];
    filesList.unshift(fileId);
    await env.MEDIA_KV.put('app:files', JSON.stringify(filesList));

    return json({
      success: true,
      file: fileRecord
    });

  } catch (error) {
    console.error('Upload error:', error);
    return json({ success: false, error: 'Error al subir: ' + error.message }, 500);
  }
}

// GET /api/files — List all files
async function handleListFiles(request, env) {
  const config = await getConfig(env);
  if (!config) {
    return json({ success: false, error: 'App no configurada' }, 400);
  }

  const fileIds = await env.MEDIA_KV.get('app:files', 'json') || [];
  const files = [];

  for (const id of fileIds) {
    const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
    if (fileData) files.push(fileData);
  }

  // Sort by newest first
  files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return json({ files, total: files.length });
}

// GET /api/files/:id — Get file info
async function handleGetFile(request, env, id) {
  const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
  if (!fileData) {
    return json({ error: 'Archivo no encontrado' }, 404);
  }
  return json({ file: fileData });
}

// GET /api/files/:id/download — Download/redirect to file
async function handleDownloadFile(request, env, id) {
  const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
  if (!fileData) {
    return json({ error: 'Archivo no encontrado' }, 404);
  }

  // If Cloudinary streaming URL exists for videos, use that
  if (fileData.stream_url && request.headers.get('Accept')?.includes('video') || request.headers.get('Range')) {
    return Response.redirect(fileData.stream_url, 302);
  }

  // Default: redirect to Google Drive
  return Response.redirect(fileData.download_url, 302);
}

// DELETE /api/files/:id — Delete a file
async function handleDeleteFile(request, env, id) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
  if (!fileData) {
    return json({ success: false, error: 'Archivo no encontrado' }, 404);
  }

  const config = await getConfig(env);

  // Delete from Google Drive
  try {
    if (config?.drive_credentials && fileData.drive_id) {
      await deleteDriveFile(config.drive_credentials, fileData.drive_id);
    }
  } catch (e) {
    console.error('Drive delete warning:', e.message);
  }

  // Remove from KV
  await env.MEDIA_KV.delete(`file:${id}`);

  // Remove from file list
  const filesList = await env.MEDIA_KV.get('app:files', 'json') || [];
  const updatedList = filesList.filter(fid => fid !== id);
  await env.MEDIA_KV.put('app:files', JSON.stringify(updatedList));

  return json({ success: true, message: 'Archivo eliminado' });
}

// DELETE /api/files — Delete all files
async function handleDeleteAllFiles(request, env) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  const config = await getConfig(env);
  const filesList = await env.MEDIA_KV.get('app:files', 'json') || [];

  let deleted = 0;
  let errors = 0;

  for (const id of filesList) {
    const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
    if (fileData && config?.drive_credentials && fileData.drive_id) {
      try {
        await deleteDriveFile(config.drive_credentials, fileData.drive_id);
        deleted++;
      } catch (e) {
        errors++;
        console.error(`Failed to delete ${id} from Drive:`, e.message);
      }
    }
    await env.MEDIA_KV.delete(`file:${id}`);
  }

  // Reset file list
  await env.MEDIA_KV.put('app:files', JSON.stringify([]));

  return json({
    success: true,
    message: `${deleted} archivos eliminados de Drive${errors > 0 ? `, ${errors} errores` : ''}`
  });
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

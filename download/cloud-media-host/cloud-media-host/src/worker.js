/**
 * Cloud Media Host - Main Worker
 * 
 * Routes:
 *   GET  /                 → Dashboard HTML (or Setup page if not configured)
 *   GET  /api/docs         → API Documentation
 *   GET  /api/status       → System status
 *   POST /api/config       → Save credentials
 *   GET  /api/config       → Get current config (admin only)
 *   DELETE /api/config     → Reset everything (admin only)
 *   POST /api/upload       → Upload file
 *   GET  /api/files        → List all files
 *   GET  /api/files/:id    → Get file info
 *   GET  /api/files/:id/download → Download file
 *   DELETE /api/files/:id  → Delete file (admin only)
 *   DELETE /api/files      → Delete all files (admin only)
 */

import { hashPassword, generateId, formatSize, getFileIcon, isAllowedType } from './jwt.js';
import { uploadFile, deleteFile as deleteDriveFile, getDownloadUrl, getEmbedUrl } from './google-drive.js';
import { isCloudinarySupported, uploadFile as uploadToCloudinary, getVideoThumbnail, getVideoStreamUrl } from './cloudinary-client.js';
import { setupPage, dashboardPage, apiDocsPage } from './templates.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key'
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
        case '/api/docs': return handleApiDocs(request, env, url);
        case '/api/status': return handleStatus(request, env);
        case '/api/config':
          if (request.method === 'POST') return handleSaveConfig(request, env);
          if (request.method === 'DELETE') return handleResetConfig(request, env);
          if (request.method === 'GET') return handleGetConfig(request, env);
          break;
        case '/api/upload':
          if (request.method === 'POST') return handleUpload(request, env);
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
  const exact = ['/', '/api/docs', '/api/status', '/api/config', '/api/upload', '/api/files'];
  for (const p of exact) {
    if (path === p) return { pattern: p, params: {} };
  }

  // Parameterized routes
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

  // Configured → show dashboard
  const fileIds = await env.MEDIA_KV.get('app:files', 'json') || [];
  const files = [];
  for (const id of fileIds) {
    const fileData = await env.MEDIA_KV.get(`file:${id}`, 'json');
    if (fileData) files.push(fileData);
  }

  // Sort by newest first
  files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return html(dashboardPage(config, files));
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

  return json({
    configured: !!(config && config.drive_credentials),
    services: {
      drive: !!(config?.drive_credentials),
      cloudinary: !!(config?.cloudinary_cloud_name)
    },
    file_count: fileIds.length,
    has_admin_password: !!config?.admin_password_hash
  });
}

// POST /api/config — Save configuration
async function handleSaveConfig(request, env) {
  try {
    const body = await request.json();
    const { drive_credentials, drive_folder_id, cloudinary_cloud_name, cloudinary_upload_preset, admin_password } = body;

    if (!drive_credentials || !drive_folder_id) {
      return json({ success: false, error: 'Google Drive credentials y folder ID son obligatorios' }, 400);
    }

    // Validate service account format
    if (!drive_credentials.client_email || !drive_credentials.private_key) {
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
      drive_credentials: drive_credentials,
      drive_folder_id: drive_folder_id,
      admin_password_hash: admin_password ? await hashPassword(admin_password) : null,
      created_at: new Date().toISOString()
    };

    // Optional: Cloudinary
    if (cloudinary_cloud_name && cloudinary_upload_preset) {
      config.cloudinary_cloud_name = cloudinary_cloud_name;
      config.cloudinary_upload_preset = cloudinary_upload_preset;
    }

    // Save to KV
    await env.MEDIA_KV.put('app:config', JSON.stringify(config));

    // Initialize file list
    const existingFiles = await env.MEDIA_KV.get('app:files', 'json');
    if (!existingFiles) {
      await env.MEDIA_KV.put('app:files', JSON.stringify([]));
    }

    return json({ success: true, message: 'Configuración guardada correctamente' });

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

// POST /api/upload — Upload a file
async function handleUpload(request, env) {
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

    // Upload to Google Drive
    const driveResult = await uploadFile(
      config.drive_credentials,
      config.drive_folder_id,
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

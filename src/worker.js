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
 *   GET  /api/auth              → Start OAuth2 consent flow (redirect to Google)
 *   GET  /api/auth/callback     → Handle OAuth2 callback from Google
 *   POST /api/auth/disconnect   → Disconnect OAuth2 (remove refresh token)
 *   GET  /api/debug            → Debug: test Supabase connection and table integrity
 *   GET  /api/verify-tables    → Verify required tables exist in Supabase
 */

import { hashPassword, generateId, formatSize, getFileIcon, isAllowedType } from './jwt.js';
import { uploadFile, deleteFile as deleteDriveFile, getDownloadUrl, getEmbedUrl, createFolder as createDriveFolder, deleteFolder as deleteDriveFolder, refreshOAuth2Token, exchangeCodeForTokens, buildOAuth2Url, getDriveAccessToken, verifyCredentials } from './google-drive.js';
import { isCloudinarySupported, uploadFile as uploadToCloudinary, getVideoThumbnail, getVideoStreamUrl } from './cloudinary-client.js';
import { setupPage, dashboardPage, apiDocsPage, loginPage } from './templates.js';
import { createClient } from './supabase.js';
import { verifyFirebaseToken, extractFirebaseToken, authenticateRequest } from './firebase-auth.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-Folder-ID, Authorization, X-Firebase-Auth, X-Google-Access-Token, X-API-Key'
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
        case '/api/auth':
          if (request.method === 'GET') return handleAuthStart(request, env, url);
          break;
        case '/api/auth/callback':
          if (request.method === 'GET') return handleAuthCallback(request, env, url);
          break;
        case '/api/auth/disconnect':
          if (request.method === 'POST') return handleAuthDisconnect(request, env);
          break;
        case '/api/drive/folders':
          if (request.method === 'GET') return handleListDriveFolders(request, env);
          break;
        case '/api/auth/me':
          if (request.method === 'GET') return handleAuthMe(request, env);
          break;
        case '/api/auth/firebase-config':
          if (request.method === 'GET') return handleFirebaseConfig(request, env);
          break;
        case '/api/debug':
          if (request.method === 'GET') return handleDebug(request, env);
          break;
        case '/api/verify-tables':
          if (request.method === 'GET') return handleVerifyTables(request, env);
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
  const exact = ['/', '/setup', '/api/docs', '/api/status', '/api/config', '/api/upload', '/api/files', '/api/folders', '/api/test-drive', '/api/auth', '/api/auth/me', '/api/auth/firebase-config', '/api/auth/disconnect', '/api/debug', '/api/verify-tables', '/api/drive/folders'];
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
  // Method 1: Firebase Auth (preferred)
  if (env.FIREBASE_PROJECT_ID) {
    const token = extractFirebaseToken(request);
    if (token) {
      try {
        const user = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);
        if (user) return true;
      } catch (e) {
        console.error('Firebase auth verification failed:', e.message);
      }
    }
  }

  // Method 2: Admin password (fallback)
  const config = await getConfig(env);
  if (!config || !config.admin_password_hash) return true;
  const providedKey = request.headers.get('X-Admin-Key');
  if (!providedKey) return false;
  const hash = await hashPassword(providedKey);
  return hash === config.admin_password_hash;
}

// ============================================
// FOLDER API KEY AUTHENTICATION
// ============================================

// Generate a deterministic API key for a folder using HMAC-SHA256
// Secret is derived from Supabase service key (always available)
async function generateFolderApiKey(folderId, env) {
  const secret = env.SUPABASE_SERVICE_KEY || 'fallback-secret';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const data = encoder.encode(`cmh-folder:${folderId}`);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const hex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `cmh_${folderId.substring(0, 8)}_${hex.substring(0, 32)}`;
}

// Verify an API key against a folder ID
async function verifyFolderApiKey(request, folderId, env) {
  // Check X-API-Key header or Authorization: Bearer cmh_xxx
  let providedKey = request.headers.get('X-API-Key');
  if (!providedKey) {
    const authHeader = request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer cmh_')) {
      providedKey = authHeader.substring(7);
    }
  }
  if (!providedKey || !providedKey.startsWith('cmh_')) return false;
  
  const expectedKey = await generateFolderApiKey(folderId, env);
  return providedKey === expectedKey;
}

// ============================================
// HANDLERS
// ============================================

// GET /api/auth/me — Get current Firebase user info
async function handleAuthMe(request, env) {
  if (!env.FIREBASE_PROJECT_ID) {
    return json({ authenticated: false, firebase_enabled: false });
  }

  const token = extractFirebaseToken(request);
  if (!token) {
    return json({ authenticated: false, firebase_enabled: true });
  }

  try {
    const user = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);
    return json({ authenticated: true, firebase_enabled: true, user });
  } catch (e) {
    return json({ authenticated: false, firebase_enabled: true, error: e.message }, 401);
  }
}

// GET /api/auth/firebase-config — Return Firebase config for frontend
async function handleFirebaseConfig(request, env) {
  const config = {
    firebase_enabled: !!env.FIREBASE_PROJECT_ID,
    project_id: env.FIREBASE_PROJECT_ID || null,
    api_key: env.FIREBASE_API_KEY || null,
    auth_domain: env.FIREBASE_PROJECT_ID ? `${env.FIREBASE_PROJECT_ID}.firebaseapp.com` : null,
    storage_bucket: env.FIREBASE_STORAGE_BUCKET || null,
    messaging_sender_id: env.FIREBASE_MESSAGING_SENDER_ID || null,
    app_id: env.FIREBASE_APP_ID || null,
  };
  return json(config);
}

// GET / — Dashboard or Setup (or Login if Firebase is configured and user is not authenticated)
async function handleIndex(request, env) {
  if (isApiRequest(request)) return handleStatus(request, env);

  // Check Firebase auth status for frontend
  const { user, firebaseConfigured } = await authenticateRequest(request, env);

  // If Firebase is configured, require authentication
  if (firebaseConfigured && !user) {
    // Build Firebase config for the login page
    const loginFirebaseConfig = {
      apiKey: env.FIREBASE_API_KEY || null,
      authDomain: env.FIREBASE_PROJECT_ID ? `${env.FIREBASE_PROJECT_ID}.firebaseapp.com` : null,
      projectId: env.FIREBASE_PROJECT_ID || null,
      storageBucket: env.FIREBASE_STORAGE_BUCKET || null,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || null,
      appId: env.FIREBASE_APP_ID || null,
    };
    return html(loginPage(loginFirebaseConfig));
  }

  let config = null;
  try {
    config = await getConfig(env);
  } catch (e) {
    // Supabase not configured yet — show setup page (user is authenticated if Firebase is on)
    console.error('getConfig error:', e.message);
    return html(setupPage(null, { firebaseConfigured, user }));
  }

  // If Firebase is configured and user is authenticated, show dashboard even without Drive credentials
  // Drive credentials are optional now
  if (!config) {
    config = { folders: [] };
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

  if (folders.length === 0 && !firebaseConfigured) {
    // No Firebase, no folders — show setup
    config.folders = [];
    return html(setupPage(config, { firebaseConfigured, user }));
  }

  if (folders.length === 0 && firebaseConfigured) {
    // Firebase configured, authenticated, but no folders — still show dashboard
    // (setup accessible via settings icon)
  }

  // Attach folders to config for setup page compatibility
  config.folders = folders.map(f => ({
    id: f.id,
    name: f.name,
    drive_folder_id: f.drive_folder_id,
    drive_link: f.drive_link,
    created_at: f.created_at,
    api_key: await generateFolderApiKey(f.id, env),
  }));

  files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return html(dashboardPage(config, files, folders, { firebaseConfigured, user }));
}

// GET /setup — Configuration page (requires authentication if Firebase is configured)
async function handleSetup(request, env) {
  if (isApiRequest(request)) return handleStatus(request, env);

  const { user, firebaseConfigured } = await authenticateRequest(request, env);

  // If Firebase is configured, require authentication to access setup
  if (firebaseConfigured && !user) {
    const loginFirebaseConfig = {
      apiKey: env.FIREBASE_API_KEY || null,
      authDomain: env.FIREBASE_PROJECT_ID ? `${env.FIREBASE_PROJECT_ID}.firebaseapp.com` : null,
      projectId: env.FIREBASE_PROJECT_ID || null,
      storageBucket: env.FIREBASE_STORAGE_BUCKET || null,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || null,
      appId: env.FIREBASE_APP_ID || null,
    };
    return html(loginPage(loginFirebaseConfig));
  }

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
        api_key: await generateFolderApiKey(f.id, env),
      }));
    }
  } catch (e) {
    console.error('handleSetup error:', e.message);
  }

  return html(setupPage(config, { firebaseConfigured, user }));
}

// GET /api/docs
async function handleApiDocs(request, env, url) {
  return html(apiDocsPage(`${url.protocol}//${url.host}`));
}

// GET /api/status
async function handleStatus(request, env) {
  try {
    const db = getDb(env);
    const config = await getConfig(env);
    let fileCount = 0;
    let folderCount = 0;
    try { fileCount = await db.count('files'); } catch (e) { /* table might not exist */ }
    try { folderCount = await db.count('folders'); } catch (e) { /* table might not exist */ }

    return json({
      configured: !!(config && (config.drive_credentials || config.oauth2_refresh_token)),
      database: 'supabase',
      services: {
        drive: !!(config?.drive_credentials || config?.oauth2_refresh_token),
        cloudinary: !!(config?.cloudinary_cloud_name),
        firebase: !!(env.FIREBASE_PROJECT_ID)
      },
      file_count: fileCount,
      folder_count: folderCount,
      has_admin_password: !!config?.admin_password_hash
    });
  } catch (e) {
    return json({ configured: false, error: e.message, database: 'supabase' });
  }
}

// POST /api/config — Save configuration
async function handleSaveConfig(request, env) {
  try {
    const body = await request.json();
    const { drive_credentials, folders, cloudinary_cloud_name, cloudinary_upload_preset, admin_password, oauth2_client_id, oauth2_client_secret } = body;
    const db = getDb(env);

    // Get existing config FIRST
    const existingConfig = await getConfig(env);

    // Validate credentials - accept OAuth2, Service Account, or Firebase Auth (Google Sign-In)
    const credentials = drive_credentials || existingConfig?.drive_credentials;
    const hasOAuth2 = !!(oauth2_client_id || existingConfig?.oauth2_client_id);
    const hasFirebase = !!env.FIREBASE_PROJECT_ID;
    if (!credentials && !hasOAuth2 && !hasFirebase) {
      return json({ success: false, error: 'Se necesita OAuth2, Service Account, o Firebase Auth credentials' }, 400);
    }

    // Build folder list from request
    const folderList = folders || [];

    // Firebase Auth is sufficient for auth - don't require drive creds or OAuth2
    if (folderList.length === 0 && !existingConfig && !hasFirebase) {
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
      drive_credentials: credentials || existingConfig?.drive_credentials || null,
      drive_folder_id: folderList.length > 0 ? folderList[0].drive_folder_id : (existingConfig?.drive_folder_id || null),
      admin_password_hash: admin_password ? await hashPassword(admin_password) : (existingConfig?.admin_password_hash || null),
      updated_at: new Date().toISOString(),
    };

    // OAuth2 settings
    if (oauth2_client_id) {
      configData.oauth2_client_id = oauth2_client_id;
    } else if (existingConfig?.oauth2_client_id) {
      configData.oauth2_client_id = existingConfig.oauth2_client_id;
    }
    if (oauth2_client_secret) {
      configData.oauth2_client_secret = oauth2_client_secret;
    } else if (existingConfig?.oauth2_client_secret) {
      configData.oauth2_client_secret = existingConfig.oauth2_client_secret;
    }
    // Never overwrite refresh_token on config save (it comes from OAuth2 callback)
    if (existingConfig?.oauth2_refresh_token) {
      configData.oauth2_refresh_token = existingConfig.oauth2_refresh_token;
    }
    if (existingConfig?.oauth2_user_email) {
      configData.oauth2_user_email = existingConfig.oauth2_user_email;
    }

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
  if (!config || (!config.drive_credentials && !config.oauth2_refresh_token)) {
    return json({ success: false, error: 'App no configurada' }, 400);
  }

  // Require authentication
  if (env.FIREBASE_PROJECT_ID) {
    const { user: firebaseUser } = await authenticateRequest(request, env);
    if (!firebaseUser) {
      return json({ success: false, error: 'No autenticado', code: 'UNAUTHORIZED' }, 401);
    }
  }

  try {
    const body = await request.json();
    const folderName = (body.name || '').trim();
    if (!folderName) return json({ success: false, error: 'Nombre obligatorio' }, 400);
    if (folderName.length > 100) return json({ success: false, error: 'Nombre muy largo (max 100)' }, 400);

    const db = getDb(env);

    const driveResult = await createDriveFolder(
      config,
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

  // Generate API keys for each folder
  for (const folder of folders) {
    folder.file_count = countMap[folder.id] || 0;
    folder.api_key = await generateFolderApiKey(folder.id, env);
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

  // Auth: accept Firebase session OR folder API key
  if (env.FIREBASE_PROJECT_ID) {
    const { user: firebaseUser } = await authenticateRequest(request, env);
    const hasApiKey = await verifyFolderApiKey(request, folderId, env);
    if (!firebaseUser && !hasApiKey) {
      return json({ success: false, error: 'No autenticado. Usa Firebase Auth o X-API-Key.', code: 'UNAUTHORIZED' }, 401);
    }
  }

  // Pagination support
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')));
  const offset = (page - 1) * limit;

  // Type filter
  const typeFilter = url.searchParams.get('type') || ''; // audio, video, image, archive

  // Get total count first
  let baseFilter = { folder_id: folderId };
  
  // Build the query with all files first, then paginate in memory
  // (Supabase client may not support complex filtering)
  const allFiles = await db.select('files', '*', { filter: baseFilter, order: 'created_at.desc' });
  
  // Apply type filter
  let filteredFiles = allFiles;
  if (typeFilter) {
    const typeMap = {
      audio: ['audio/'],
      video: ['video/'],
      image: ['image/'],
      archive: ['application/zip', 'application/x-zip', 'application/x-rar', 'application/x-7z', 'application/gzip'],
    };
    const prefixes = typeMap[typeFilter.toLowerCase()];
    if (prefixes) {
      filteredFiles = allFiles.filter(f => prefixes.some(p => (f.type || '').startsWith(p)));
    }
  }

  const total = filteredFiles.length;
  const totalPages = Math.ceil(total / limit);
  const files = filteredFiles.slice(offset, offset + limit);

  return json({
    folder: { id: folder.id, name: folder.name, drive_folder_id: folder.drive_folder_id },
    files,
    pagination: {
      page,
      limit,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
    filters: { type: typeFilter || null }
  });
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
      if ((config?.drive_credentials || config?.oauth2_refresh_token) && file.drive_id) {
        await deleteDriveFile(config, file.drive_id);
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

  // Delete folder from DB
  await db.remove('folders', { id: folderId });

  return json({
    success: true,
    message: `Carpeta "${folder.name}" eliminada con ${deletedFromDrive} archivos de Drive`
  });
}

// ============================================
// OAUTH2 HANDLERS
// ============================================

// GET /api/auth — Start OAuth2 consent flow
async function handleAuthStart(request, env, url) {
  const config = await getConfig(env);
  if (!config || !config.oauth2_client_id) {
    return json({ error: 'OAuth2 no configurado. Agrega Client ID y Client Secret en Setup.' }, 400);
  }

  // Build the redirect URI based on the current request
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback`;

  // Generate state for CSRF protection
  const state = crypto.randomUUID();

  const authUrl = buildOAuth2Url(config.oauth2_client_id, redirectUri, state);

  // Return the URL (frontend will redirect) rather than redirecting directly,
  // so we can show the URL in case of popup issues
  return json({
    auth_url: authUrl,
    redirect_uri: redirectUri,
    state: state,
    message: 'Redirige al usuario a esta URL para autorizar el acceso a Google Drive.'
  });
}

// GET /api/auth/callback — Handle OAuth2 callback from Google
async function handleAuthCallback(request, env, url) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Note: Full CSRF state validation requires persistent storage (KV/cookie).
  // State is generated client-side and should be validated in production.
  // For now, we log a warning if state is missing.
  if (!state) {
    console.warn('OAuth2 callback received without state parameter — possible CSRF');
  }

  if (error) {
    return html(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Error OAuth2</title>
      <style>body{background:#09090B;color:#fafafa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
      .box{max-width:500px;text-align:center;padding:24px}h1{color:#EF4444}p{color:#a1a1aa;margin-top:12px;font-size:14px}</style></head>
      <body><div class="box"><h1>Error de autorización</h1><p>${error}: ${url.searchParams.get('error_description') || 'Unknown error'}</p>
      <a href="/setup" style="color:#F97316;margin-top:20px;display:inline-block">← Volver a Setup</a></div></body></html>`);
  }

  if (!code) {
    return html(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Error</title>
      <style>body{background:#09090B;color:#fafafa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
      .box{max-width:500px;text-align:center;padding:24px}h1{color:#EF4444}p{color:#a1a1aa;margin-top:12px;font-size:14px}</style></head>
      <body><div class="box"><h1>Error</h1><p>No se recibió código de autorización.</p>
      <a href="/setup" style="color:#F97316;margin-top:20px;display:inline-block">← Volver a Setup</a></div></body></html>`);
  }

  try {
    const db = getDb(env);
    const config = await getConfig(env);

    if (!config || !config.oauth2_client_id || !config.oauth2_client_secret) {
      return html(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Error</title>
        <style>body{background:#09090B;color:#fafafa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
        .box{max-width:500px;text-align:center;padding:24px}h1{color:#EF4444}p{color:#a1a1aa;margin-top:12px;font-size:14px}</style></head>
        <body><div class="box"><h1>Error de configuración</h1><p>OAuth2 Client ID y Client Secret deben estar configurados en Setup.</p>
        <a href="/setup" style="color:#F97316;margin-top:20px;display:inline-block">← Volver a Setup</a></div></body></html>`);
    }

    const origin = new URL(request.url).origin;
    const redirectUri = `${origin}/api/auth/callback`;

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      config.oauth2_client_id,
      config.oauth2_client_secret,
      code,
      redirectUri
    );

    if (!tokens.refresh_token) {
      return html(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Advertencia</title>
        <style>body{background:#09090B;color:#fafafa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
        .box{max-width:500px;text-align:center;padding:24px}h1{color:#eab308}p{color:#a1a1aa;margin-top:12px;font-size:14px}</style></head>
        <body><div class="box"><h1>Sin refresh token</h1><p>No se obtuvo refresh token. Intenta de nuevo y asegúrate de hacer clic en "Permitir" cuando se te pida consentimiento.</p>
        <a href="/setup" style="color:#F97316;margin-top:20px;display:inline-block">← Volver a Setup</a></div></body></html>`);
    }

    // Store refresh token in Supabase
    await db.update('app_config', {
      oauth2_refresh_token: tokens.refresh_token,
      oauth2_user_email: undefined, // Will be populated later if needed
      updated_at: new Date().toISOString(),
    }, { id: 1 });

    // Test the token by getting user info
    let userInfo = null;
    try {
      const token = await refreshOAuth2Token(config.oauth2_client_id, config.oauth2_client_secret, tokens.refresh_token);
      const aboutRes = await fetch('https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress)', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (aboutRes.ok) {
        userInfo = await aboutRes.json();
        if (userInfo?.user?.emailAddress) {
          await db.update('app_config', { oauth2_user_email: userInfo.user.emailAddress }, { id: 1 });
        }
      }
    } catch (e) {
      console.error('Could not get user info:', e.message);
    }

    const email = userInfo?.user?.emailAddress || 'cuenta conectada';
    return html(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Conexión exitosa</title>
      <style>body{background:#09090B;color:#fafafa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
      .box{max-width:500px;text-align:center;padding:24px}h1{color:#22C55E}p{color:#a1a1aa;margin-top:12px;font-size:14px}
      .email{color:#F97316;font-weight:600;font-size:16px;margin-top:16px}
      a{color:#F97316;margin-top:24px;display:inline-block;font-size:14px}</style></head>
      <body><div class="box"><h1>✅ Cuenta conectada</h1>
      <p>Tu cuenta de Google Drive está ahora vinculada.</p>
      <div class="email">${email}</div>
      <p style="font-size:12px;color:#71717A;margin-top:8px">Ya puedes subir archivos a tus carpetas de Drive.</p>
      <a href="/">→ Ir al Dashboard</a></div></body></html>`);

  } catch (err) {
    console.error('OAuth2 callback error:', err);
    return html(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Error</title>
      <style>body{background:#09090B;color:#fafafa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
      .box{max-width:500px;text-align:center;padding:24px}h1{color:#EF4444}p{color:#a1a1aa;margin-top:12px;font-size:14px;font-family:monospace;word-break:break-all}</style></head>
      <body><div class="box"><h1>Error al conectar</h1><p>${err.message}</p>
      <a href="/setup" style="color:#F97316;margin-top:20px;display:inline-block">← Volver a Setup</a></div></body></html>`);
  }
}

// POST /api/auth/disconnect — Remove OAuth2 credentials
async function handleAuthDisconnect(request, env) {
  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

  try {
    const db = getDb(env);
    await db.update('app_config', {
      oauth2_refresh_token: null,
      oauth2_user_email: null,
      updated_at: new Date().toISOString(),
    }, { id: 1 });
    return json({ success: true, message: 'OAuth2 desconectado.' });
  } catch (e) {
    return json({ success: false, error: e.message }, 500);
  }
}

// ============================================
// DRIVE FOLDER BROWSER
// ============================================

// GET /api/drive/folders — List folders from Google Drive (for folder picker)
async function handleListDriveFolders(request, env) {
  try {
    const url = new URL(request.url);
    const parentId = url.searchParams.get('parentId') || 'root';
    const pageToken = url.searchParams.get('pageToken') || null;
    const searchQuery = url.searchParams.get('q') || '';

    const config = await getConfig(env);
    if (!config) {
      return json({ success: false, error: 'App no configurada' }, 400);
    }

    const hasCreds = !!(config.drive_credentials);
    const hasOAuth2 = !!(config.oauth2_client_id && config.oauth2_refresh_token);
    if (!hasCreds && !hasOAuth2) {
      return json({ success: false, error: 'No hay credenciales de Google Drive configuradas. Configura OAuth2 o Service Account primero.' }, 400);
    }

    const authResult = await getDriveAccessToken(config);
    const token = authResult.token;

    // Build query: only folders, not trashed, under parentId
    let queryParts = [
      `'${parentId}' in parents`,
      "mimeType='application/vnd.google-apps.folder'",
      'trashed=false'
    ];
    // Add search filter if provided
    if (searchQuery) {
      queryParts.push(`name contains '${searchQuery.replace(/'/g, "\\'")}'`);
    }
    const query = queryParts.join(' and ');

    const params = new URLSearchParams({
      q: query,
      fields: 'nextPageToken, files(id,name,parents)',
      pageSize: '50',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true'
    });

    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    const data = await res.json();

    if (!res.ok) {
      return json({
        success: false,
        error: 'Error al listar carpetas de Google Drive',
        detail: data.error?.message || data
      }, res.status);
    }

    return json({
      success: true,
      folders: data.files || [],
      nextPageToken: data.nextPageToken || null,
      parentId
    });
  } catch (err) {
    return json({
      success: false,
      error: 'Error interno listando carpetas',
      detail: err.message
    }, 500);
  }
}

// ============================================
// DRIVE DIAGNOSTIC
// ============================================

async function handleTestDrive(request, env) {
  const config = await getConfig(env);
  const hasCreds = !!(config.drive_credentials);
  const hasOAuth2 = !!(config.oauth2_client_id && config.oauth2_refresh_token);
  if (!hasCreds && !hasOAuth2) {
    return json({ success: false, error: 'No hay credenciales configuradas' }, 400);
  }

  const results = { steps: [], database: 'supabase' };

  // Step 1: Check which auth method is available
  results.steps.push({
    step: 1, name: 'Metodo de autenticacion',
    status: hasOAuth2 ? 'ok' : (hasCreds ? 'warn' : 'fail'),
    detail: hasOAuth2
      ? `OAuth2 configurado (cliente: ${config.oauth2_client_id.substring(0, 20)}...)`
      : hasCreds
        ? `Service Account: ${config.drive_credentials.client_email} (nota: no puede crear archivos en Drive personal)`
        : 'Sin credenciales'
  });

  // Step 2: Test token
  try {
    const authResult = await getDriveAccessToken(config);
    results.steps.push({
      step: 2, name: 'Access token', status: 'ok',
      detail: `Token OK via ${authResult.method}`
    });
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
    const authResult = await getDriveAccessToken(config);
    const token = authResult.token;
    const authMethod = authResult.method;

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${defaultFolderId}'+in+parents&fields=files(id,name,size,mimeType)&pageSize=3`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (res.status === 404 || res.status === 403) {
      results.steps.push({
        step: 4, name: 'Acceso a carpeta', status: 'fail',
        detail: `${res.status}: ${authMethod === 'oauth2' ? 'El token OAuth2 no tiene acceso a esta carpeta.' : 'La Service Account no tiene acceso a esta carpeta.'}`
      });
      results.steps.push({
        step: 5, name: 'SOLUCION', status: 'fix',
        detail: authMethod === 'oauth2'
          ? 'Asegurate de que la carpeta pertenece a la cuenta de Google conectada.'
          : `Comparte la carpeta con "${config.drive_credentials?.client_email}" como Editor. O mejor: configura OAuth2 en Setup.`
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
// DEBUG & DIAGNOSTICS
// ============================================

// GET /api/debug — Full Supabase connection and table integrity test
async function handleDebug(request, env) {
  const results = {
    timestamp: new Date().toISOString(),
    supabase: { connected: false, url: null, error: null },
    tables: {},
    insert_test: null,
  };

  const requiredTables = ['app_config', 'folders', 'files'];

  // Step 1: Test Supabase connection
  try {
    const db = getDb(env);
    results.supabase.url = env.SUPABASE_URL ? env.SUPABASE_URL.replace(/\/.*$/, '') : null;
    results.supabase.connected = true;
  } catch (e) {
    results.supabase.error = e.message;
    return json(results);
  }

  const db = getDb(env);

  // Step 2: Test each table
  for (const table of requiredTables) {
    const tableResult = { exists: false, count: null, error: null };
    try {
      // Try SELECT with LIMIT 1 to test table existence
      await db.select(table, '*', { limit: 1 });
      tableResult.exists = true;
    } catch (e) {
      tableResult.error = e.message;
    }

    // Try to get row count
    if (tableResult.exists) {
      try {
        tableResult.count = await db.count(table);
      } catch (e) {
        tableResult.count_error = e.message;
      }
    }

    results.tables[table] = tableResult;
  }

  // Step 3: Test insert capability (insert + delete a test row)
  try {
    const testId = '__debug_test_' + Date.now();
    try {
      await db.insert('files', {
        name: testId,
        type: 'application/octet-stream',
        size: 0,
        size_display: '0 B',
        type_display: 'Debug',
        icon: '📄',
        drive_id: testId,
        download_url: 'https://example.com',
        embed_url: 'https://example.com',
        // date_display is GENERATED ALWAYS — do NOT include in INSERT
      });
    } catch (insertErr) {
      results.insert_test = { success: false, error: insertErr.message, step: 'insert' };
      return json(results);
    }

    // Try to find and delete the test row
    try {
      // Find by name since we don't know the auto-generated id
      const testRows = await db.select('files', 'id', { filter: { name: testId } });
      if (testRows.length > 0) {
        await db.remove('files', { id: testRows[0].id });
        results.insert_test = { success: true, step: 'insert + delete', detail: 'Test row inserted and deleted successfully' };
      } else {
        results.insert_test = { success: true, step: 'insert', detail: 'Insert succeeded but could not find row to delete (may use different PK)' };
      }
    } catch (deleteErr) {
      results.insert_test = { success: true, step: 'insert', warning: 'Insert works but delete test failed: ' + deleteErr.message };
    }
  } catch (e) {
    results.insert_test = { success: false, error: e.message };
  }

  return json(results);
}

// GET /api/verify-tables — Quick check if required tables exist
async function handleVerifyTables(request, env) {
  const requiredTables = ['app_config', 'folders', 'files'];
  const results = { tables: {}, all_ok: true, database: 'supabase' };

  let db;
  try {
    db = getDb(env);
  } catch (e) {
    return json({ all_ok: false, database: 'supabase', connection_error: e.message });
  }

  for (const table of requiredTables) {
    try {
      await db.select(table, '*', { limit: 1 });
      const count = await db.count(table);
      results.tables[table] = { exists: true, rows: count };
    } catch (e) {
      results.tables[table] = { exists: false, error: e.message };
      results.all_ok = false;
    }
  }

  return json(results);
}

// ============================================
// FILE HANDLERS
// ============================================

// POST /api/upload — Step-by-step upload with detailed error reporting
async function handleUpload(request, env, url) {
  // Verify Firebase auth if configured
  if (env.FIREBASE_PROJECT_ID) {
    const { user, firebaseConfigured } = await authenticateRequest(request, env);
    if (firebaseConfigured && !user) {
      return json({ success: false, error: 'Autenticacion requerida', step: 1, detail: 'Inicia sesion para subir archivos.' }, 401);
    }
  }

  // Step 1: Read config from Supabase
  let config;
  try {
    config = await getConfig(env);
  } catch (e) {
    return json({ success: false, error: 'Error al leer configuración', step: 1, detail: e.message }, 500);
  }

  if (!config) {
    return json({ success: false, error: 'App no configurada', step: 1, detail: 'No se pudo leer la configuracion de la base de datos.' }, 400);
  }

  // Accept Google OAuth access token from frontend (via Firebase Auth + Google Sign-In)
  const googleAccessToken = request.headers.get('X-Google-Access-Token') || null;
  
  // Check if we have ANY valid auth method
  const hasCreds = !!(config.drive_credentials);
  const hasOAuth2 = !!(config.oauth2_client_id && config.oauth2_refresh_token);
  const hasFirebaseToken = !!googleAccessToken;
  if (!hasCreds && !hasOAuth2 && !hasFirebaseToken) {
    return json({ success: false, error: 'Sin credenciales de Drive', step: 1, detail: 'Configura OAuth2, Service Account, o inicia sesion con Google para subir archivos.' }, 400);
  }

  // Parse form data
  let formData, file;
  try {
    formData = await request.formData();
    file = formData.get('file');
  } catch (e) {
    return json({ success: false, error: 'Error al leer FormData', step: 1, detail: e.message }, 400);
  }

  if (!file) {
    return json({ success: false, error: 'No se encontró el archivo (campo "file")', step: 1, detail: 'El FormData no contiene un campo llamado "file".' }, 400);
  }

  const fileName = file.name || 'unnamed';
  const contentType = file.type || 'application/octet-stream';
  console.log('Upload:', fileName, contentType);

  // Step 2: Validate file type and size (skip for directory uploads)
  if (!isAllowedType(contentType)) {
    return json({ success: false, error: `Tipo no permitido: ${contentType}`, step: 2, detail: 'Usa MP3, MP4, ZIP o imágenes.' }, 400);
  }

  // Extract relative path for folder uploads (webkitRelativePath)
  const relativePath = file.webkitRelativePath || null;


  let fileData;
  try {
    fileData = await file.arrayBuffer();
  } catch (e) {
    return json({ success: false, error: 'Error al leer archivo', step: 2, detail: e.message }, 400);
  }

  if (fileData.byteLength > 104857600) {
    return json({ success: false, error: 'Máximo 100MB.', step: 2, detail: `Tamaño del archivo: ${formatSize(fileData.byteLength)} (límite: 100MB)` }, 400);
  }

  if (fileData.byteLength === 0) {
    return json({ success: false, error: 'Archivo vacío.', step: 2, detail: 'El archivo tiene 0 bytes.' }, 400);
  }

  // Step 3: Determine target Drive folder
  let folderId = url.searchParams.get('folder_id') || formData.get('folder_id') || request.headers.get('X-Folder-ID') || null;
  let targetDriveFolderId = config.drive_folder_id;
  let db;

  try {
    db = getDb(env);
  } catch (e) {
    return json({ success: false, error: 'Error de conexión a Supabase', step: 3, detail: e.message }, 500);
  }

  if (folderId) {
    try {
      const folderRecord = await db.select('folders', '*', { filter: { id: folderId }, single: true });
      if (!folderRecord) {
        return json({ success: false, error: 'Carpeta no encontrada', step: 3, detail: `No existe carpeta con id "${folderId}" en la base de datos.` }, 404);
      }
      targetDriveFolderId = folderRecord.drive_folder_id;
      if (!targetDriveFolderId) {
        return json({ success: false, error: 'Carpeta sin ID de Drive', step: 3, detail: `La carpeta "${folderRecord.name}" (id: ${folderId}) no tiene drive_folder_id asociado.` }, 400);
      }
    } catch (e) {
      return json({ success: false, error: 'Error al buscar carpeta', step: 3, detail: e.message }, 500);
    }
  }

  if (!targetDriveFolderId) {
    return json({ success: false, error: 'No hay carpeta de destino', step: 3, detail: 'No se definió drive_folder_id en la configuración y no se proporcionó folder_id.' }, 400);
  }

  // Step 3.5: Per-folder file type lock
  // The first file uploaded to a folder locks it to that type category.
  // Subsequent uploads must match the same category.
  if (folderId) {
    try {
      const existingFiles = await db.select('files', 'type', { filter: { folder_id: folderId }, limit: 1 });
      if (existingFiles && existingFiles.length > 0 && existingFiles[0].type) {
        const lockedCategory = getFileTypeCategory(existingFiles[0].type);
        const uploadCategory = getFileTypeCategory(contentType);
        if (lockedCategory !== uploadCategory) {
          const lockedDesc = getCategoryDescription(lockedCategory);
          const uploadDesc = getCategoryDescription(uploadCategory);
          return json({
            success: false,
            error: `Tipo de archivo no permitido en esta carpeta`,
            code: 'WRONG_FILE_TYPE',
            step: 3,
            detail: `La carpeta "${folderRecord?.name || folderId}" esta bloqueada para tipo: ${lockedDesc}. No puedes subir ${uploadDesc} aqui. El primer archivo subido a una carpeta define su tipo de contenido. Si necesitas subir otro tipo de archivo, crea una carpeta nueva desde el dashboard.`
          }, 422);
        }
      }
    } catch (e) {
      // Non-critical: continue with upload if type check fails
      console.warn('Folder type lock check failed:', e.message);
    }
  }

  console.log('Target Drive folder:', targetDriveFolderId);

  // Step 4: Upload to Google Drive
  let driveResult;
  try {
    driveResult = await uploadFile(
      config, targetDriveFolderId, fileName, contentType, fileData, googleAccessToken
    );
    console.log('Drive OK:', driveResult.id);
  } catch (e) {
    return json({ success: false, error: 'Error al subir a Google Drive', step: 4, detail: e.message }, 500);
  }

  if (!driveResult || !driveResult.id) {
    return json({ success: false, error: 'Google Drive no devolvió ID de archivo', step: 4, detail: `Respuesta de Drive: ${JSON.stringify(driveResult || {})}` }, 500);
  }

  // Build file record — use relative path as display name if from folder upload
  const displayName = relativePath || fileName;
  const fileRecord = {
    name: displayName,
    original_name: fileName,
    type: contentType,
    size: fileData.byteLength || driveResult.size || 0,
    size_display: formatSize(fileData.byteLength || driveResult.size || 0),
    type_display: getFileTypeDisplay(contentType),
    icon: getFileIcon(contentType),
    drive_id: driveResult.id,
    download_url: driveResult.downloadUrl,
    embed_url: getEmbedUrl(driveResult.id),
    // date_display is GENERATED ALWAYS in Supabase — auto-calculated, do NOT insert
  };

  if (folderId) fileRecord.folder_id = folderId;

  // Optional: Cloudinary (non-critical)
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

  // Step 5: Insert into Supabase
  let inserted;
  try {
    inserted = await db.insert('files', fileRecord);
    console.log('Saved to DB:', inserted?.id || 'ok');
  } catch (e) {
    // The file is already on Google Drive — report but don't delete
    return json({
      success: false,
      error: 'Error al guardar en la base de datos',
      step: 5,
      detail: e.message,
      warning: `El archivo ya fue subido a Google Drive (id: ${driveResult.id}) pero no se pudo registrar en la base de datos. Esto es probablemente un problema de schema o permisos de Supabase.`,
      drive_file_id: driveResult.id,
      drive_download_url: driveResult.downloadUrl,
    }, 500);
  }

  if (!inserted) {
    return json({
      success: false,
      error: 'La base de datos no devolvió el registro insertado',
      step: 5,
      detail: 'db.insert() retornó null. El archivo pudo haberse insertado pero no se confirmó.',
      drive_file_id: driveResult.id,
    }, 500);
  }

  return json({ success: true, file: inserted || fileRecord });
}

// GET /api/files
async function handleListFiles(request, env) {
  const db = getDb(env);
  const config = await getConfig(env);
  if (!config) return json({ success: false, error: 'App no configurada' }, 400);

  // Pagination support
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')));
  const offset = (page - 1) * limit;

  // Type filter
  const typeFilter = url.searchParams.get('type') || ''; // audio, video, image, archive

  const allFiles = await db.select('files', '*', { order: 'created_at.desc' });

  // Apply type filter
  let filteredFiles = allFiles;
  if (typeFilter) {
    const typeMap = {
      audio: ['audio/'],
      video: ['video/'],
      image: ['image/'],
      archive: ['application/zip', 'application/x-zip', 'application/x-rar', 'application/x-7z', 'application/gzip'],
    };
    const prefixes = typeMap[typeFilter.toLowerCase()];
    if (prefixes) {
      filteredFiles = allFiles.filter(f => prefixes.some(p => (f.type || '').startsWith(p)));
    }
  }

  const total = filteredFiles.length;
  const totalPages = Math.ceil(total / limit);
  const files = filteredFiles.slice(offset, offset + limit);

  return json({
    files,
    pagination: {
      page,
      limit,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
    filters: { type: typeFilter || null }
  });
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
    if ((config?.drive_credentials || config?.oauth2_refresh_token) && file.drive_id) {
      await deleteDriveFile(config, file.drive_id);
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
      if ((config?.drive_credentials || config?.oauth2_refresh_token) && file.drive_id) {
        await deleteDriveFile(config, file.drive_id);
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

// Get file type category from MIME type
function getFileTypeCategory(contentType) {
  if (!contentType) return 'other';
  const t = contentType.toLowerCase();
  if (t.startsWith('audio/')) return 'audio';
  if (t.startsWith('video/')) return 'video';
  if (t.startsWith('image/')) return 'image';
  if (t.includes('zip') || t.includes('rar') || t.includes('7z') || t.includes('gzip') || t.includes('tar')) return 'archive';
  if (t.includes('pdf') || t.includes('document') || t.includes('spreadsheet') || t.includes('presentation') || t.includes('msword') || t.includes('officedocument')) return 'document';
  return 'other';
}

// Get friendly description of a file type category
function getCategoryDescription(category) {
  const descriptions = {
    audio: 'Audio (MP3, WAV, OGG, AAC, FLAC...)',
    video: 'Video (MP4, WebM, AVI, MOV...)',
    image: 'Imagen (JPG, PNG, GIF, WebP, SVG...)',
    archive: 'Archivo comprimido (ZIP, RAR, 7Z, TAR...)',
    document: 'Documento (PDF, DOC, XLS, PPT...)',
    other: 'Otros archivos',
  };
  return descriptions[category] || category;
}

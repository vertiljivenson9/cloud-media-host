/**
 * Google Drive API Client
 * Supports two authentication modes:
 *   1. OAuth2 User Credentials (recommended for personal Gmail accounts)
 *   2. Service Account JWT (only works with Google Workspace Shared Drives)
 * 
 * Upload flow:
 *   - Resumable upload (supports large files up to 5TB)
 *   - Automatic public permission setting
 *   - Returns public download URLs
 */

import { getAccessToken } from './jwt.js';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// ============================================
// OAUTH2 TOKEN MANAGEMENT
// ============================================

/**
 * Refresh an OAuth2 access token using a refresh token
 * @param {string} clientId - OAuth2 Client ID
 * @param {string} clientSecret - OAuth2 Client Secret
 * @param {string} refreshToken - Stored refresh token
 * @returns {Promise<string>} Access token
 */
export async function refreshOAuth2Token(clientId, clientSecret, refreshToken) {
  const response = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&refresh_token=${encodeURIComponent(refreshToken)}&grant_type=refresh_token`
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OAuth2 token refresh failed (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Exchange an authorization code for tokens (used in OAuth2 callback)
 * @param {string} clientId
 * @param {string} clientSecret
 * @param {string} code - Authorization code from Google
 * @param {string} redirectUri
 * @returns {Promise<{access_token, refresh_token, expires_in}>}
 */
export async function exchangeCodeForTokens(clientId, clientSecret, code, redirectUri) {
  const response = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}&grant_type=authorization_code`
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OAuth2 code exchange failed (${response.status}): ${error}`);
  }

  return await response.json();
}

/**
 * Generate the OAuth2 consent URL
 * @param {string} clientId
 * @param {string} redirectUri
 * @param {string} [state] - Optional state parameter for CSRF protection
 * @returns {string} URL to redirect user to
 */
export function buildOAuth2Url(clientId, redirectUri, state) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/drive',
    access_type: 'offline',
    prompt: 'consent', // Force consent to always get refresh token
  });
  if (state) params.set('state', state);
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Get an access token using the best available method.
 * Priority: OAuth2 (refresh token) > Service Account JWT
 * 
 * @param {object} config - App config from Supabase
 * @returns {Promise<{token: string, method: 'oauth2'|'service_account'}>}
 */
export async function getDriveAccessToken(config) {
  // Try OAuth2 first (works for personal Gmail)
  if (config.oauth2_client_id && config.oauth2_client_secret && config.oauth2_refresh_token) {
    try {
      const token = await refreshOAuth2Token(
        config.oauth2_client_id,
        config.oauth2_client_secret,
        config.oauth2_refresh_token
      );
      return { token, method: 'oauth2' };
    } catch (e) {
      console.error('OAuth2 token refresh failed, falling back to Service Account:', e.message);
    }
  }

  // Fall back to Service Account (only works with Shared Drives)
  if (config.drive_credentials && config.drive_credentials.client_email && config.drive_credentials.private_key) {
    try {
      const token = await getAccessToken(config.drive_credentials);
      return { token, method: 'service_account' };
    } catch (e) {
      throw new Error(`Service Account auth failed: ${e.message}. Configure OAuth2 credentials for personal Gmail accounts.`);
    }
  }

  throw new Error('No valid Drive credentials configured. Set up OAuth2 credentials in the setup page.');
}

// ============================================
// FILE OPERATIONS (unified, work with both auth methods)
// ============================================

/**
 * Upload a file to Google Drive (resumable upload - supports large files)
 * Automatically selects the best available auth method.
 * 
 * @param {object} config - App config (must contain OAuth2 or Service Account creds)
 * @param {string} folderId - Target Drive folder ID
 * @param {string} fileName - Name for the file in Drive
 * @param {string} contentType - MIME type
 * @param {ArrayBuffer} fileData - File bytes
 * @param {string} [accessToken] - Optional pre-existing Google OAuth access token (e.g. from Firebase Auth)
 * @returns {Promise<{id, name, mimeType, size, webViewLink, downloadUrl}>}
 */
export async function uploadFile(config, folderId, fileName, contentType, fileData, accessToken = null) {
  let token;
  if (accessToken) {
    token = accessToken;
  } else {
    const result = await getDriveAccessToken(config);
    token = result.token;
  }

  // Step 1: Initiate resumable upload
  const initResponse = await fetch(
    `${DRIVE_UPLOAD}/files?uploadType=resumable`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: fileName,
        parents: [folderId]
      })
    }
  );

  if (!initResponse.ok) {
    const error = await initResponse.text();
    // Provide helpful error message for service account quota issue
    if (error.includes('storageQuotaExceeded') || error.includes('storage quota')) {
      throw new Error(
        `Service Account no tiene cuota de almacenamiento. Solucion: Configura OAuth2 (credenciales de usuario) en la pagina de setup. ` +
        `Las cuentas personales de Gmail necesitan OAuth2 para subir archivos a Drive.`
      );
    }
    throw new Error(`Drive upload init failed (${initResponse.status}): ${error}`);
  }

  const uploadUrl = initResponse.headers.get('Location');
  if (!uploadUrl) {
    throw new Error('Drive upload init returned no Location header. Status: ' + initResponse.status);
  }

  // Step 2: Upload the file data
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: fileData
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text();
    if (error.includes('storageQuotaExceeded') || error.includes('storage quota')) {
      throw new Error(
        `Service Account no tiene cuota de almacenamiento. Solucion: Configura OAuth2 en la pagina de setup.`
      );
    }
    throw new Error(`Drive upload failed (${uploadResponse.status}): ${error}`);
  }

  let fileInfo;
  try {
    fileInfo = await uploadResponse.json();
  } catch(e) {
    throw new Error('Drive upload response was not valid JSON');
  }

  if (!fileInfo || !fileInfo.id) {
    throw new Error('Drive upload returned no file ID in response');
  }

  // Step 3: Make file publicly accessible (anyone with link can view)
  try {
    await fetch(
      `${DRIVE_API}/files/${fileInfo.id}/permissions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      }
    );
  } catch (e) {
    // Permission setting failed but file uploaded - non-critical
    console.error('Warning: Could not set file permissions:', e.message);
  }

  // Step 4: Get public download URL
  const downloadUrl = `https://drive.usercontent.google.com/download?id=${fileInfo.id}&export=download&confirm=t`;

  return {
    id: fileInfo.id,
    name: fileInfo.name,
    mimeType: fileInfo.mimeType,
    size: fileInfo.size ? parseInt(fileInfo.size) : 0,
    webViewLink: fileInfo.webViewLink,
    downloadUrl: downloadUrl
  };
}

/**
 * Get public download URL for a file
 */
export function getDownloadUrl(driveFileId) {
  return `https://drive.usercontent.google.com/download?id=${driveFileId}&export=download&confirm=t`;
}

/**
 * Get embed/stream URL for a file
 */
export function getEmbedUrl(driveFileId) {
  return `https://drive.google.com/file/d/${driveFileId}/preview`;
}

/**
 * Delete a file from Google Drive
 * Works with both OAuth2 and Service Account auth.
 * @param {object} config - App config
 * @param {string} driveFileId - Drive file ID to delete
 * @param {string} [accessToken] - Optional pre-existing Google OAuth access token
 */
export async function deleteFile(config, driveFileId, accessToken = null) {
  let token;
  if (accessToken) {
    token = accessToken;
  } else {
    const result = await getDriveAccessToken(config);
    token = result.token;
  }

  const response = await fetch(
    `${DRIVE_API}/files/${driveFileId}`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok && response.status !== 204) {
    const error = await response.text();
    throw new Error(`Drive delete failed: ${error}`);
  }

  return true;
}

/**
 * Get file info from Google Drive
 * @param {object} config - App config
 * @param {string} driveFileId - Drive file ID
 * @param {string} [accessToken] - Optional pre-existing Google OAuth access token
 */
export async function getFileInfo(config, driveFileId, accessToken = null) {
  let token;
  if (accessToken) {
    token = accessToken;
  } else {
    const result = await getDriveAccessToken(config);
    token = result.token;
  }

  const response = await fetch(
    `${DRIVE_API}/files/${driveFileId}?fields=id,name,size,mimeType,createdTime`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    throw new Error('File not found in Google Drive');
  }

  return await response.json();
}

/**
 * List files in a folder (used for sync/verification)
 * @param {object} config - App config
 * @param {string} folderId - Drive folder ID
 * @param {string} [accessToken] - Optional pre-existing Google OAuth access token
 */
export async function listFiles(config, folderId, accessToken = null) {
  let token;
  if (accessToken) {
    token = accessToken;
  } else {
    const result = await getDriveAccessToken(config);
    token = result.token;
  }

  const response = await fetch(
    `${DRIVE_API}/files?q='${folderId}'+in+parents&fields=files(id,name,size,mimeType,createdTime)&pageSize=100`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Drive list failed: ${error}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Create a folder in Google Drive inside a parent folder
 * @param {object} config - App config
 * @param {string} parentFolderId - Parent Drive folder ID
 * @param {string} folderName - Name for new folder
 * @param {string} [accessToken] - Optional pre-existing Google OAuth access token
 */
export async function createFolder(config, parentFolderId, folderName, accessToken = null) {
  let token;
  if (accessToken) {
    token = accessToken;
  } else {
    const result = await getDriveAccessToken(config);
    token = result.token;
  }

  const response = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Drive create folder failed: ${error}`);
  }

  const folderInfo = await response.json();
  return {
    id: folderInfo.id,
    name: folderInfo.name,
    webViewLink: folderInfo.webViewLink
  };
}

/**
 * Delete a folder from Google Drive (by ID)
 * @param {object} config - App config
 * @param {string} driveFolderId - Drive folder ID to delete
 * @param {string} [accessToken] - Optional pre-existing Google OAuth access token
 */
export async function deleteFolder(config, driveFolderId, accessToken = null) {
  let token;
  if (accessToken) {
    token = accessToken;
  } else {
    const result = await getDriveAccessToken(config);
    token = result.token;
  }

  const response = await fetch(
    `${DRIVE_API}/files/${driveFolderId}`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  if (!response.ok && response.status !== 204) {
    const error = await response.text();
    throw new Error(`Drive folder delete failed: ${error}`);
  }

  return true;
}

/**
 * Verify that Drive credentials are valid
 * Tests OAuth2 first, then Service Account
 */
export async function verifyCredentials(config) {
  // Test OAuth2
  if (config.oauth2_client_id && config.oauth2_client_secret && config.oauth2_refresh_token) {
    try {
      await refreshOAuth2Token(config.oauth2_client_id, config.oauth2_client_secret, config.oauth2_refresh_token);
      return { valid: true, method: 'oauth2' };
    } catch (error) {
      return { valid: false, method: 'oauth2', error: error.message };
    }
  }

  // Test Service Account
  if (config.drive_credentials) {
    try {
      await getAccessToken(config.drive_credentials);
      return { valid: true, method: 'service_account' };
    } catch (error) {
      return { valid: false, method: 'service_account', error: error.message };
    }
  }

  return { valid: false, error: 'No Drive credentials configured' };
}

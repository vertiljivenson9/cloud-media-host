/**
 * Google Drive API Client
 * Handles upload, download, list, delete operations
 */

import { getAccessToken } from './jwt.js';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Upload a file to Google Drive (resumable upload - supports large files)
 * 
 * Flow:
 * 1. Get OAuth2 access token via JWT
 * 2. Initiate resumable upload session
 * 3. Upload file bytes
 * 4. Set file permissions to public
 */
export async function uploadFile(serviceAccount, folderId, fileName, contentType, fileData) {
  const token = await getAccessToken(serviceAccount);

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
 */
export async function deleteFile(serviceAccount, driveFileId) {
  const token = await getAccessToken(serviceAccount);

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
 */
export async function getFileInfo(serviceAccount, driveFileId) {
  const token = await getAccessToken(serviceAccount);

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
 */
export async function listFiles(serviceAccount, folderId) {
  const token = await getAccessToken(serviceAccount);

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
 */
export async function createFolder(serviceAccount, parentFolderId, folderName) {
  const token = await getAccessToken(serviceAccount);

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
 * Note: This moves it to trash, it doesn't permanently delete.
 * For permanent deletion, add ?supportsAllDrives=true&supportsTeamDrives=true and use trashed=false
 */
export async function deleteFolder(serviceAccount, driveFolderId) {
  const token = await getAccessToken(serviceAccount);

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
 * Verify that service account credentials are valid
 * by attempting to get an access token
 */
export async function verifyCredentials(serviceAccount) {
  try {
    await getAccessToken(serviceAccount);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

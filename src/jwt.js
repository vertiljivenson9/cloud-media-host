/**
 * JWT signing for Google Service Account authentication
 * Uses Web Crypto API (available in Cloudflare Workers)
 */

// Base64URL encoding (RFC 4648)
function base64urlEncode(str) {
  if (typeof str === 'string') {
    str = new TextEncoder().encode(str);
  }
  return btoa(String.fromCharCode(...str))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Convert PEM private key to ArrayBuffer for Web Crypto
export function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/-----BEGIN RSA PRIVATE KEY-----/, '')
    .replace(/-----END RSA PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const binaryString = atob(b64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Import PEM private key into Web Crypto API
async function importPrivateKey(pem) {
  return await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(pem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

// Create a signed JWT for Google OAuth2
export async function createGoogleJWT(serviceAccount) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600 // 1 hour
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // Sign the token with the private key
  const privateKey = await importPrivateKey(serviceAccount.private_key);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureBase64 = base64urlEncode(new Uint8Array(signature));
  return `${unsignedToken}.${signatureBase64}`;
}

// Exchange JWT for an OAuth2 access token
export async function getAccessToken(serviceAccount) {
  const jwt = await createGoogleJWT(serviceAccount);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Simple hash function for admin passwords (SHA-256)
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a short unique ID
export function generateId() {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 12);
}

// Format file size
export function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

// Get file icon based on type
export function getFileIcon(type) {
  if (!type) return '📄';
  if (type.startsWith('audio/')) return '🎵';
  if (type.startsWith('video/')) return '🎬';
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return '📦';
  if (type.startsWith('image/')) return '🖼️';
  return '📄';
}

// Get allowed content types — allows all file types
export function isAllowedType(contentType) {
  // Allow all file types — the user manages what goes in each folder
  return true;
}

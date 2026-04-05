/**
 * Firebase Auth - ID Token Verification for Cloudflare Workers
 * 
 * Verifies Firebase ID tokens using Google's public JWKS certificates.
 * No external dependencies - uses Web Crypto API (available in Workers).
 * 
 * Usage:
 *   import { verifyFirebaseToken, getFirebaseProjectId } from './firebase-auth.js';
 *   const user = await verifyFirebaseToken(idToken, env.FIREBASE_PROJECT_ID);
 */

// Cache Google's public keys (JWKS) at module level
// In Workers, this persists across requests within the same isolate
let cachedKeys = null;
let keysExpireAt = 0;
const KEYS_CACHE_TTL = 3600 * 1000; // 1 hour

/**
 * Base64URL decode (RFC 4648)
 */
function base64urlDecode(str) {
  // Replace URL-safe characters with standard Base64 characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if necessary
  while (base64.length % 4) base64 += '=';
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decode JWT without verification (for reading header/payload)
 */
function decodeJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  
  const header = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[1])));
  
  return { header, payload, signature: parts[2] };
}

/**
 * Fetch Google's public keys (JWKS) for Firebase token verification
 * Uses caching to avoid repeated HTTP requests.
 */
async function getGooglePublicKeys() {
  const now = Date.now();
  if (cachedKeys && now < keysExpireAt) {
    return cachedKeys;
  }

  const response = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
    {
      headers: { 'Accept': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Google public keys: ${response.status}`);
  }

  // The response is a JSON object mapping key IDs to X.509 certificate strings
  const keysData = await response.json();
  
  // Convert X.509 certificates to public keys
  const keys = {};
  for (const [kid, certPem] of Object.entries(keysData)) {
    try {
      // Convert PEM to ArrayBuffer
      const pemContents = certPem
        .replace('-----BEGIN CERTIFICATE-----', '')
        .replace('-----END CERTIFICATE-----', '')
        .replace(/\s/g, '');
      const binaryString = atob(pemContents);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Import public key for RSA verification
      const publicKey = await crypto.subtle.importKey(
        'spki',
        bytes.buffer,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        false,
        ['verify']
      );
      
      keys[kid] = publicKey;
    } catch (e) {
      console.error(`Failed to import key ${kid}:`, e.message);
    }
  }

  cachedKeys = keys;
  keysExpireAt = now + KEYS_CACHE_TTL;

  return keys;
}

/**
 * Verify a Firebase ID token
 * 
 * @param {string} idToken - The Firebase ID token (JWT) from the client
 * @param {string} projectId - Firebase project ID
 * @returns {Promise<{uid: string, email: string, name: string, picture: string, email_verified: boolean, iat: number, exp: number}>}
 */
export async function verifyFirebaseToken(idToken, projectId) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('No ID token provided');
  }

  if (!projectId) {
    throw new Error('Firebase project ID not configured. Add FIREBASE_PROJECT_ID to your environment.');
  }

  // Decode the JWT (without verification - we'll verify signature below)
  const decoded = decodeJwt(idToken);
  const { header, payload } = decoded;

  // Step 1: Verify algorithm
  if (header.alg !== 'RS256') {
    throw new Error(`Invalid algorithm: ${header.alg}. Expected RS256.`);
  }

  // Step 2: Verify issuer
  const expectedIssuers = [
    `https://securetoken.google.com/${projectId}`,
    `https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.TokenService`,
  ];
  if (!expectedIssuers.includes(payload.iss)) {
    throw new Error(`Invalid issuer: ${payload.iss}. Expected ${expectedIssuers[0]}`);
  }

  // Step 3: Verify audience
  if (payload.aud !== projectId) {
    throw new Error(`Invalid audience: ${payload.aud}. Expected ${projectId}`);
  }

  // Step 4: Verify expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }

  // Step 5: Verify issued-at (not too far in the past)
  if (payload.iat && payload.iat > now + 300) {
    // Allow 5 minutes clock skew
    throw new Error('Token issued in the future');
  }

  // Step 6: Verify subject
  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new Error('Token missing subject');
  }
  if (payload.sub.length > 128) {
    throw new Error('Subject too long');
  }

  // Step 7: Verify signature using Google's public keys
  const keys = await getGooglePublicKeys();
  const publicKey = keys[header.kid];

  if (!publicKey) {
    throw new Error(`No public key found for kid: ${header.kid}. The token may have been signed with a revoked key.`);
  }

  // Split token and verify signature
  const [encodedHeader, encodedPayload, signature] = idToken.split('.');
  const signedData = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
  const signatureBytes = base64urlDecode(signature);

  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signatureBytes,
    signedData
  );

  if (!isValid) {
    throw new Error('Invalid token signature');
  }

  // Return decoded user info
  return {
    uid: payload.sub,
    email: payload.email || null,
    email_verified: !!payload.email_verified,
    name: payload.name || null,
    picture: payload.picture || null,
    iat: payload.iat,
    exp: payload.exp,
    auth_time: payload.auth_time || null,
    firebase: payload.firebase || {},
  };
}

/**
 * Extract Firebase ID token from a request
 * Checks Authorization header: "Bearer <token>"
 * Also checks query parameter: ?auth=<token>
 * Also checks X-Firebase-Auth header
 * 
 * @param {Request} request
 * @returns {string|null}
 */
export function extractFirebaseToken(request) {
  // Check Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token && !token.startsWith('ey')) {
      // Non-JWT tokens (like Supabase service keys) - skip
      // Firebase tokens start with "eyJ"
      return null;
    }
    if (token.startsWith('eyJ')) {
      return token;
    }
  }

  // Check custom header
  const firebaseAuth = request.headers.get('X-Firebase-Auth');
  if (firebaseAuth && firebaseAuth.startsWith('eyJ')) {
    return firebaseAuth;
  }

  // Check query parameter
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('auth');
  if (queryToken && queryToken.startsWith('eyJ')) {
    return queryToken;
  }

  // Check cookie (__session set by login page after Firebase auth)
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const eqIndex = cookie.indexOf('=');
    if (eqIndex === -1) continue;
    const name = cookie.substring(0, eqIndex).trim();
    if (name === '__session') {
      const token = cookie.substring(eqIndex + 1).trim();
      if (token.startsWith('eyJ')) return token;
    }
  }

  return null;
}

/**
 * Middleware: Verify Firebase auth and return user info
 * Returns null if Firebase is not configured or no token provided (allows open access)
 * Returns user object if authenticated
 * Throws error if token is invalid
 * 
 * @param {Request} request
 * @param {object} env - Cloudflare Worker env
 * @returns {Promise<{user: object|null, firebaseConfigured: boolean}>
 */
export async function authenticateRequest(request, env) {
  const projectId = env.FIREBASE_PROJECT_ID;

  // Firebase not configured - allow open access
  if (!projectId) {
    return { user: null, firebaseConfigured: false };
  }

  const token = extractFirebaseToken(request);

  // No token provided - not authenticated
  if (!token) {
    return { user: null, firebaseConfigured: true };
  }

  // Verify token
  const user = await verifyFirebaseToken(token, projectId);
  return { user, firebaseConfigured: true };
}

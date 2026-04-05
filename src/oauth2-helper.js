/**
 * OAuth2 Token Helper - Get refresh token for Google Drive API
 * 
 * This script creates a local HTTP server that handles the OAuth2 callback,
 * so we can get a refresh token without deploying the Worker first.
 * 
 * Usage: node get-oauth2-token.js
 * 
 * Prerequisites:
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create OAuth 2.0 Client ID (Web application type)
 * 3. Add http://localhost:8787/api/auth/callback as authorized redirect URI
 * 4. Copy Client ID and Client Secret below
 */

const http = require('http');
const https = require('https');
const url = require('url');

// ======== CONFIGURE THESE ========
const CLIENT_ID = '106692980277503122246.apps.googleusercontent.com'; // TODO: Replace with your OAuth2 Client ID
const CLIENT_SECRET = 'GOCSPX-xxx'; // TODO: Replace with your OAuth2 Client Secret
const REDIRECT_URI = 'http://localhost:8787/api/auth/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
].join(' ');

// Google OAuth2 endpoints
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function buildAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent', // Force consent to get refresh token
  });
  return `${AUTH_URL}?${params.toString()}`;
}

function exchangeCode(code) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON: ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Start local server
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  
  if (parsed.pathname === '/api/auth/callback' && parsed.query.code) {
    console.log('\n✅ Authorization code received!');
    console.log('   Exchanging for tokens...');
    
    try {
      const tokens = await exchangeCode(parsed.query.code);
      
      if (tokens.refresh_token) {
        console.log('\n🎉 SUCCESS! Here are your tokens:\n');
        console.log('═══════════════════════════════════════════════');
        console.log('  REFRESH TOKEN:');
        console.log('  ' + tokens.refresh_token);
        console.log('═══════════════════════════════════════════════');
        console.log('\n  Access Token (expires in ' + tokens.expires_in + 's):');
        console.log('  ' + tokens.access_token);
        console.log('\n');
        console.log('📋 Copy the REFRESH TOKEN and paste it in your app config.\n');
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <html><body style="background:#09090B;color:#fafafa;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
            <div style="max-width:600px;text-align:center">
              <h1 style="color:#22C55E">✅ Autenticacion exitosa!</h1>
              <p>Tu cuenta de Google Drive esta conectada.</p>
              <p style="color:#a1a1aa;margin-top:16px">Puedes cerrar esta ventana y volver a la aplicacion.</p>
              <p style="color:#71717a;font-size:12px;margin-top:8px">El refresh token se ha impreso en la consola del servidor.</p>
            </div>
          </body></html>
        `);
      } else {
        console.log('⚠️  No refresh token received. Make sure you used prompt=consent.');
        console.log('   Response:', JSON.stringify(tokens, null, 2));
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>Error: No refresh token</h1><p>Check console for details.</p>');
      }
      
      // Close server after handling callback
      setTimeout(() => {
        console.log('Server shutting down...');
        server.close();
        process.exit(0);
      }, 2000);
      
    } catch (err) {
      console.error('❌ Token exchange failed:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>Error: ' + err.message + '</h1>');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8787, () => {
  const authUrl = buildAuthUrl();
  console.log('═══════════════════════════════════════════════');
  console.log('  Google Drive OAuth2 Token Generator');
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log('  Client ID: ' + CLIENT_ID);
  console.log('  Redirect:  ' + REDIRECT_URI);
  console.log('');
  console.log('  Open this URL in your browser to authenticate:');
  console.log('');
  console.log('  ' + authUrl);
  console.log('');
  console.log('  Waiting for callback on port 8787...');
  console.log('═══════════════════════════════════════════════');
});

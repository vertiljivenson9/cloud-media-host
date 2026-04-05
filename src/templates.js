/**
 * Cloud Media Host - Design System + Templates
 * 
 * Design inspired by:
 *   - Linear.app (dark, precise, fast)
 *   - Vercel Dashboard (minimal, black/white)
 *   - Cloudflare R2 (orange accent, clean)
 *   - GoFile.io (drag-drop centric)
 *   - Lucide Icons (SVG, stroke-based)
 *
 * Design Tokens:
 *   Font:     Inter (Google Fonts)
 *   Icons:    Lucide-style inline SVG
 *   Primary:  #F97316 (orange-500)
 *   Surface:  zinc scale (#09090B → #27272A)
 *   Radius:   12px cards, 8px inputs, 6px badges
 */

// ============================================
// ICONS (Lucide-style SVG)
// ============================================
const IC = {
  cloud: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  cloudCheck: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><polyline points="15 13 17 15 21 11"/></svg>`,
  upload: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  file: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
  music: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  film: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>`,
  archive: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`,
  image: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  externalLink: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  lock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  alert: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  hardDrive: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>`,
  globe: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  refreshCw: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
};

function icon(name) {
  return IC[name] || IC.file;
}

function fileIconByType(type) {
  if (!type) return icon('file');
  if (type.startsWith('audio/')) return icon('music');
  if (type.startsWith('video/')) return icon('film');
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return icon('archive');
  if (type.startsWith('image/')) return icon('image');
  return icon('file');
}

// ============================================
// SHARED CSS (Design System)
// ============================================
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --bg-root: #09090B;
    --bg-surface: #18181B;
    --bg-surface-2: #27272A;
    --bg-surface-3: #3F3F46;
    --border: #27272A;
    --border-hover: #3F3F46;
    --text-primary: #FAFAFA;
    --text-secondary: #A1A1AA;
    --text-muted: #71717A;
    --accent: #F97316;
    --accent-hover: #FB923C;
    --accent-subtle: rgba(249, 115, 22, 0.1);
    --success: #22C55E;
    --success-subtle: rgba(34, 197, 94, 0.1);
    --danger: #EF4444;
    --danger-subtle: rgba(239, 68, 68, 0.1);
    --info: #3B82F6;
    --info-subtle: rgba(59, 130, 246, 0.1);
    --radius-lg: 12px;
    --radius-md: 8px;
    --radius-sm: 6px;
    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font);
    background: var(--bg-root);
    color: var(--text-primary);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a { color: var(--accent); text-decoration: none; }
  a:hover { color: var(--accent-hover); }

  /* ---- INPUTS ---- */
  input[type="text"], input[type="password"], textarea {
    width: 100%;
    background: var(--bg-root);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 10px 12px;
    color: var(--text-primary);
    font-family: var(--font);
    font-size: 14px;
    transition: border-color var(--transition);
    outline: none;
  }
  input:focus, textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }
  input::placeholder, textarea::placeholder { color: var(--text-muted); }
  textarea { resize: vertical; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; }

  /* ---- BUTTONS ---- */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 16px;
    border: none; border-radius: var(--radius-md);
    font-family: var(--font); font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all var(--transition);
    white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent-hover); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--bg-surface-2); color: var(--text-primary); border-color: var(--border-hover); }
  .btn-danger { background: var(--danger-subtle); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-block { width: 100%; }
  .btn svg { flex-shrink: 0; }

  /* ---- CARDS ---- */
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
    transition: border-color var(--transition);
  }
  .card:hover { border-color: var(--border-hover); }

  /* ---- BADGES ---- */
  .badge {
    display: inline-flex; align-items: center;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .badge-accent { background: var(--accent-subtle); color: var(--accent); }
  .badge-success { background: var(--success-subtle); color: var(--success); }
  .badge-muted { background: var(--bg-surface-2); color: var(--text-muted); }

  /* ---- MODALS ---- */
  .modal-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 200;
    align-items: center; justify-content: center;
    padding: 20px;
  }
  .modal-overlay.open { display: flex; }
  .modal-box {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    animation: modalIn 200ms ease;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px 0;
  }
  .modal-header h2 { font-size: 16px; font-weight: 600; }
  .modal-close {
    background: none; border: none; color: var(--text-muted);
    cursor: pointer; padding: 4px; border-radius: var(--radius-sm);
    display: flex; transition: all var(--transition);
  }
  .modal-close:hover { color: var(--text-primary); background: var(--bg-surface-2); }
  .modal-body { padding: 20px 24px 24px; }

  /* ---- TOAST ---- */
  .toast-container {
    position: fixed; bottom: 20px; right: 20px;
    z-index: 300; display: flex; flex-direction: column; gap: 8px;
  }
  .toast {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 12px 16px;
    font-size: 13px; color: var(--text-primary);
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: toastIn 300ms ease;
  }
  .toast.success { border-color: rgba(34,197,94,0.3); }
  .toast.success .toast-icon { color: var(--success); }
  .toast.error { border-color: rgba(239,68,68,0.3); }
  .toast.error .toast-icon { color: var(--danger); }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// ============================================
// SETUP PAGE
// ============================================
export function setupPage() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Setup - Cloud Media Host</title>
<style>
${BASE_CSS}
  body { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
  .setup-container { max-width: 560px; width: 100%; }
  .setup-logo { text-align: center; margin-bottom: 32px; }
  .setup-logo svg { color: var(--accent); margin-bottom: 12px; }
  .setup-logo h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
  .setup-logo p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
  .setup-card { margin-bottom: 16px; }
  .setup-card h2 { font-size: 15px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .setup-card h2 .badge { margin-left: auto; }
  .field-label { display: block; font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px; }
  .field-hint { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
  .field-group { margin-top: 16px; }
  .field-group:first-child { margin-top: 0; }
  .steps-box {
    margin-top: 16px; padding: 12px; background: var(--bg-root); border-radius: var(--radius-md);
    font-size: 12px; color: var(--text-muted); line-height: 1.8;
  }
  .steps-box strong { color: var(--text-secondary); }
  .toggle-row { display: flex; align-items: center; gap: 10px; margin-top: 16px; cursor: pointer; }
  .toggle-row input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent); }
  .toggle-row label { margin: 0; cursor: pointer; font-size: 14px; color: var(--text-primary); }
  .optional-fields { display: none; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
  .optional-fields.visible { display: block; }
  .save-status {
    margin-top: 16px; padding: 12px 16px; border-radius: var(--radius-md);
    font-size: 13px; display: none;
  }
  .save-status.visible { display: flex; align-items: center; gap: 8px; }
  .save-status.ok { background: var(--success-subtle); color: var(--success); border: 1px solid rgba(34,197,94,0.2); }
  .save-status.err { background: var(--danger-subtle); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
  .footer-text { text-align: center; margin-top: 24px; font-size: 12px; color: var(--text-muted); }
  .footer-text a { color: var(--text-secondary); }
</style>
</head>
<body>
<div class="setup-container">
  <div class="setup-logo">
    ${IC.cloud}
    <h1>Cloud Media Host</h1>
    <p>Archivo almacenamiento gratuito sobre Google Drive + Cloudflare</p>
  </div>

  <div class="card setup-card">
    <h2>
      <span style="color:var(--accent)">${IC.hardDrive}</span>
      Google Drive
      <span class="badge badge-accent">Requerido</span>
    </h2>

    <div class="field-group">
      <label class="field-label">Service Account JSON</label>
      <textarea id="driveJson" rows="5" placeholder='{"type":"service_account","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com"}'></textarea>
      <div class="field-hint">Contenido completo del archivo JSON descargado de Google Cloud Console</div>
    </div>

    <div class="field-group">
      <label class="field-label">Carpeta ID</label>
      <input type="text" id="driveFolder" placeholder="1aBcDeFgHiJkLmNoPqRsTuVwXyZ">
      <div class="field-hint">ID de la carpeta compartida en Google Drive</div>
    </div>

    <div class="steps-box">
      <strong>Como obtenerlo:</strong><br>
      1. Ir a <a href="https://console.cloud.google.com" target="_blank">console.cloud.google.com</a><br>
      2. Crear proyecto → Habilitar <strong>Google Drive API</strong><br>
      3. Crear <strong>Cuenta de servicio</strong> → Descargar clave JSON<br>
      4. Crear carpeta en Drive → Copiar ID de la URL<br>
      5. <strong>Compartir</strong> la carpeta con el email de la cuenta de servicio
    </div>
  </div>

  <div class="card setup-card">
    <h2>
      <span style="color:var(--info)">${IC.globe}</span>
      Cloudinary
      <span class="badge badge-muted">Opcional</span>
    </h2>
    <div class="toggle-row" onclick="document.getElementById('enableCld').click()">
      <input type="checkbox" id="enableCld">
      <label for="enableCld">Habilitar para thumbnails y streaming de video</label>
    </div>
    <div class="optional-fields" id="cldFields">
      <div class="field-group">
        <label class="field-label">Cloud Name</label>
        <input type="text" id="cloudName" placeholder="tu_cloud_name">
      </div>
      <div class="field-group">
        <label class="field-label">Upload Preset (unsigned)</label>
        <input type="text" id="uploadPreset" placeholder="unsigned_preset">
      </div>
      <div class="field-hint">Crear en Cloudinary Dashboard → Settings → Upload → Upload Presets</div>
    </div>
  </div>

  <div class="card setup-card">
    <h2>
      <span style="color:var(--text-muted)">${IC.lock}</span>
      Seguridad
    </h2>
    <div class="field-group">
      <label class="field-label">Contrasena de administrador</label>
      <input type="password" id="adminPwd" placeholder="Dejar vacio = acceso abierto a todos">
      <div class="field-hint">Solo necesario si quieres restringir eliminacion y cambios de configuracion</div>
    </div>
  </div>

  <button class="btn btn-primary btn-block" id="saveBtn" style="margin-top:20px;padding:12px 16px;font-size:15px" onclick="saveConfig()">
    ${IC.check} Guardar y empezar
  </button>

  <div class="save-status" id="saveStatus"></div>

  <div class="footer-text">
    Archivos almacenados en tu Google Drive (15 GB gratis) · Servido por Cloudflare Workers
  </div>
</div>

<script>
document.getElementById('enableCld').addEventListener('change', e => {
  document.getElementById('cldFields').classList.toggle('visible', e.target.checked);
});

async function saveConfig() {
  const btn = document.getElementById('saveBtn');
  const status = document.getElementById('saveStatus');
  btn.disabled = true;
  status.className = 'save-status';
  status.innerHTML = '';

  const driveJson = document.getElementById('driveJson').value.trim();
  const driveFolder = document.getElementById('driveFolder').value.trim();
  const enableCloud = document.getElementById('enableCld').checked;
  const adminPwd = document.getElementById('adminPwd').value.trim();

  if (!driveJson) { showErr('El Service Account JSON es obligatorio'); return; }
  if (!driveFolder) { showErr('El Folder ID es obligatorio'); return; }

  let creds;
  try {
    creds = JSON.parse(driveJson);
    if (!creds.client_email || !creds.private_key) throw new Error('Campos faltantes');
  } catch (e) { showErr('JSON invalido: ' + e.message); return; }

  const config = { drive_credentials: creds, drive_folder_id: driveFolder, admin_password: adminPwd || null };
  if (enableCloud) {
    config.cloudinary_cloud_name = document.getElementById('cloudName').value.trim();
    config.cloudinary_upload_preset = document.getElementById('uploadPreset').value.trim();
    if (!config.cloudinary_cloud_name || !config.cloudinary_upload_preset) { showErr('Cloud Name y Upload Preset son obligatorios'); return; }
  }

  try {
    const res = await fetch('/api/config', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(config) });
    const data = await res.json();
    if (data.success) { showOk('Configuracion guardada. Redirigiendo...'); setTimeout(() => location.reload(), 1200); }
    else showErr(data.error || 'Error desconocido');
  } catch (e) { showErr('Error de conexion: ' + e.message); }
  btn.disabled = false;

  function showErr(msg) { status.className='save-status visible err'; status.innerHTML='${IC.alert} '+msg; btn.disabled=false; }
  function showOk(msg) { status.className='save-status visible ok'; status.innerHTML='${IC.check} '+msg; }
}
</script>
</body>
</html>`;
}


// ============================================
// DASHBOARD
// ============================================
export function dashboardPage(config, files = []) {
  const hasCloudinary = !!config.cloudinary_cloud_name;

  const fileListHtml = files.length === 0
    ? `<div class="empty-state">
        <div class="empty-icon">${IC.upload}</div>
        <p style="color:var(--text-secondary);font-size:15px;font-weight:500">Sin archivos</p>
        <p style="color:var(--text-muted);font-size:13px;margin-top:4px">Arrastra archivos al area de arriba o haz click para seleccionar</p>
      </div>`
    : files.map(f => `
      <div class="file-row" data-id="${f.id}">
        <div class="file-icon-wrap type-${(f.type_display||'').toLowerCase()}">
          ${fileIconByType(f.type)}
        </div>
        <div class="file-info">
          <div class="file-name">${escapeHtml(f.name)}</div>
          <div class="file-meta">${f.size_display||'?'} &middot; ${(f.type_display||'?').toLowerCase()} &middot; ${f.date_display||'?'}</div>
        </div>
        <div class="file-actions">
          <button class="btn-icon-only" onclick="copyUrl('${f.download_url||''}')" title="Copiar enlace">${IC.copy}</button>
          ${f.type_display==='Video'?`<button class="btn-icon-only" onclick="playMedia('${f.id}','video')" title="Reproducir">${IC.play}</button>`:''}
          ${f.type_display==='Audio'?`<button class="btn-icon-only" onclick="playMedia('${f.id}','audio')" title="Reproducir">${IC.play}</button>`:''}
          <button class="btn-icon-only" onclick="downloadFile('${f.id}')" title="Descargar">${IC.download}</button>
        </div>
      </div>
    `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cloud Media Host</title>
<style>
${BASE_CSS}
  .app-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(9,9,11,0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .app-logo { display: flex; align-items: center; gap: 10px; }
  .app-logo svg { color: var(--accent); }
  .app-logo span { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
  .app-nav { display: flex; align-items: center; gap: 4px; }
  .app-nav .service-chip {
    display: flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 9999px;
    font-size: 11px; font-weight: 500;
    background: var(--bg-surface-2); color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  .app-nav .service-chip .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); }
  .nav-sep { width: 1px; height: 20px; background: var(--border); margin: 0 8px; }
  .btn-icon-only {
    background: none; border: 1px solid transparent; color: var(--text-muted);
    padding: 6px; border-radius: var(--radius-sm); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all var(--transition);
  }
  .btn-icon-only:hover { color: var(--text-primary); background: var(--bg-surface-2); border-color: var(--border); }

  .app-main { max-width: 920px; margin: 0 auto; padding: 24px; }

  /* Upload */
  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius-lg);
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition);
    background: transparent;
    margin-bottom: 24px;
  }
  .upload-zone:hover, .upload-zone.dragover {
    border-color: var(--accent);
    background: var(--accent-subtle);
  }
  .upload-zone .uz-icon { color: var(--text-muted); margin-bottom: 12px; }
  .upload-zone:hover .uz-icon, .upload-zone.dragover .uz-icon { color: var(--accent); }
  .upload-zone p { color: var(--text-secondary); font-size: 14px; }
  .upload-zone .uz-hint { color: var(--text-muted); font-size: 12px; margin-top: 4px; }
  .upload-zone input { display: none; }

  /* Progress */
  .progress-wrap { display: none; margin-bottom: 20px; }
  .progress-wrap.active { display: block; }
  .progress-track { height: 4px; background: var(--bg-surface-2); border-radius: 9999px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 9999px; transition: width 300ms ease; width: 0; }
  .progress-label { font-size: 13px; color: var(--text-muted); }

  /* Stats */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  @media (max-width: 640px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
  .stat-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 16px;
  }
  .stat-val { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }
  .stat-lbl { font-size: 12px; color: var(--text-muted); margin-top: 2px; font-weight: 500; }

  /* File list */
  .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .list-header h2 { font-size: 14px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
  .search-input {
    background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md);
    padding: 7px 12px 7px 32px; color: var(--text-primary); font-size: 13px; width: 200px;
    outline: none; transition: border-color var(--transition);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: 10px center;
  }
  .search-input:focus { border-color: var(--accent); }

  .file-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    margin-bottom: 6px;
    transition: all var(--transition);
  }
  .file-row:hover { background: var(--bg-surface); border-color: var(--border-hover); }
  .file-icon-wrap {
    width: 40px; height: 40px; border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .type-audio { background: rgba(168,85,247,0.1); color: #A855F7; }
  .type-video { background: rgba(239,68,68,0.1); color: #EF4444; }
  .type-comprimido { background: rgba(234,179,8,0.1); color: #EAB308; }
  .type-imagen { background: rgba(59,130,246,0.1); color: #3B82F6; }
  .type-archivo { background: var(--bg-surface-2); color: var(--text-muted); }
  .file-info { flex: 1; min-width: 0; }
  .file-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .file-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .file-actions { display: flex; gap: 2px; opacity: 0; transition: opacity var(--transition); }
  .file-row:hover .file-actions { opacity: 1; }
  @media (max-width: 640px) { .file-actions { opacity: 1; } }

  .empty-state { text-align: center; padding: 64px 24px; }
  .empty-icon { color: var(--text-muted); margin-bottom: 12px; }

  /* Player modal */
  .media-player video, .media-player audio { width: 100%; border-radius: var(--radius-md); margin-top: 12px; outline: none; }
  .media-title { font-size: 14px; font-weight: 500; }
</style>
</head>
<body>

<div class="app-header">
  <div class="app-logo">
    ${IC.cloud}
    <span>Cloud Media Host</span>
  </div>
  <div class="app-nav">
    <div class="service-chip"><span class="dot"></span> Drive</div>
    ${hasCloudinary ? '<div class="service-chip"><span class="dot"></span> CDN</div>' : ''}
    <div class="nav-sep"></div>
    <button class="btn-icon-only" onclick="openModal('adminModal')" title="Admin">${IC.settings}</button>
    <a href="/api/docs" target="_blank" class="btn-icon-only" title="API Docs">${IC.book}</a>
  </div>
</div>

<main class="app-main">
  <div class="upload-zone" id="dropZone">
    <div class="uz-icon">${IC.upload}</div>
    <p>Suelta archivos aqui o haz click para seleccionar</p>
    <p class="uz-hint">MP3 &middot; MP4 &middot; ZIP &middot; PNG &middot; JPG</p>
    <input type="file" id="fileInput" multiple accept=".mp3,.mp4,.zip,.rar,.7z,.jpg,.jpeg,.png,.gif,.webp,.wav,.ogg,.aac,.webm">
  </div>

  <div class="progress-wrap" id="progressWrap">
    <div class="progress-label" id="progressLabel">Subiendo...</div>
    <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
  </div>

  <div class="stats-row">
    <div class="stat-card"><div class="stat-val">${files.length}</div><div class="stat-lbl">Archivos</div></div>
    <div class="stat-card"><div class="stat-val">${formatTotalSize(files)}</div><div class="stat-lbl">Almacenado</div></div>
    <div class="stat-card"><div class="stat-val">${countByType(files,'audio')}</div><div class="stat-lbl">Audio</div></div>
    <div class="stat-card"><div class="stat-val">${countByType(files,'video')}</div><div class="stat-lbl">Video</div></div>
  </div>

  <div class="list-header">
    <h2>Archivos</h2>
    <input type="text" class="search-input" placeholder="Buscar..." oninput="filterFiles(this.value)">
  </div>
  <div id="fileList">${fileListHtml}</div>
</main>

<!-- Media Player Modal -->
<div class="modal-overlay" id="playerModal">
  <div class="modal-box" style="max-width:720px">
    <div class="modal-header">
      <h2>Reproductor</h2>
      <button class="modal-close" onclick="closeModal('playerModal')">${IC.x}</button>
    </div>
    <div class="modal-body media-player" id="playerContainer"></div>
  </div>
</div>

<!-- Admin Modal -->
<div class="modal-overlay" id="adminModal">
  <div class="modal-box" style="max-width:480px">
    <div class="modal-header">
      <h2>Administracion</h2>
      <button class="modal-close" onclick="closeModal('adminModal')">${IC.x}</button>
    </div>
    <div class="modal-body">
      ${config.admin_password ? `
      <div style="margin-bottom:16px">
        <label class="field-label">Contrasena de admin</label>
        <input type="password" id="adminPass" placeholder="Ingresa tu contrasena" style="margin-top:6px">
      </div>` : ''}

      <div style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:500;color:var(--text-secondary);margin-bottom:6px">Archivos</div>
        <button class="btn btn-danger btn-block" onclick="deleteAllFiles()" style="justify-content:center">
          ${IC.trash} Eliminar todos los archivos
        </button>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:500;color:var(--text-secondary);margin-bottom:6px">Sistema</div>
        <button class="btn btn-danger btn-block" onclick="resetConfig()" style="justify-content:center">
          ${IC.refreshCw} Resetear toda la configuracion
        </button>
      </div>

      <div style="padding:16px;background:var(--bg-root);border-radius:var(--radius-md);font-size:12px;color:var(--text-muted);line-height:2">
        <strong style="color:var(--text-secondary)">Info del sistema</strong><br>
        Drive Folder: <code style="color:var(--accent);font-size:11px">${config.drive_folder_id||'?'}</code><br>
        Cloudinary: ${hasCloudinary?'<span style="color:var(--success)">Configurado</span>':'<span style="color:var(--text-muted)">No configurado</span>'}<br>
        Admin: ${config.admin_password?'<span style="color:var(--success)">Protegido</span>':'<span style="color:var(--text-muted)">Sin proteccion</span>'}
      </div>
    </div>
  </div>
</div>

<div class="toast-container" id="toastContainer"></div>

<script>
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); if(e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); });
fileInput.addEventListener('change', () => { if(fileInput.files.length) uploadFiles(fileInput.files); });

async function uploadFiles(files) {
  const pw = document.getElementById('progressWrap');
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  pw.classList.add('active');
  for(let i=0;i<files.length;i++){
    label.textContent = 'Subiendo ' + files[i].name + ' (' + (i+1) + '/' + files.length + ')';
    fill.style.width = ((i/files.length)*100)+'%';
    const fd = new FormData(); fd.append('file', files[i]);
    try { const r = await fetch('/api/upload',{method:'POST',body:fd}); const d = await r.json(); if(!d.success) toast(d.error||'Error','error'); }
    catch(e) { toast('Error subiendo ' + files[i].name,'error'); }
  }
  label.textContent = 'Completado';
  fill.style.width = '100%';
  setTimeout(() => { pw.classList.remove('active'); fill.style.width='0'; }, 2000);
  location.reload();
}

function copyUrl(url) { if(!url){toast('Sin URL','error');return;} navigator.clipboard.writeText(url).then(()=>toast('Enlace copiado al portapapeles','success')); }
function downloadFile(id) { window.location.href = '/api/files/'+id+'/download'; }

async function playMedia(id, type) {
  const c = document.getElementById('playerContainer');
  c.innerHTML = '<p style="color:var(--text-muted)">Cargando...</p>';
  openModal('playerModal');
  try {
    const r = await fetch('/api/files/'+id); const d = await r.json();
    if(d.file) {
      const tag = type==='video' ? 'video' : 'audio';
      c.innerHTML = '<div class="media-title">'+escapeHtml(d.file.name)+'</div><'+tag+' controls autoplay src="/api/files/'+id+'/download" style="width:100%;border-radius:8px;margin-top:12px"></'+tag+'>';
    } else c.innerHTML = '<p style="color:var(--danger)">Archivo no encontrado</p>';
  } catch(e) { c.innerHTML = '<p style="color:var(--danger)">Error</p>'; }
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

async function deleteAllFiles() {
  const h = {}; const p = document.getElementById('adminPass');
  if(p&&p.value){h['X-Admin-Key']=p.value;localStorage.setItem('cmh_admin',p.value);}
  if(!confirm('Eliminar TODOS los archivos?')) return;
  const r = await fetch('/api/files',{method:'DELETE',headers:h}); const d = await r.json();
  toast(d.success?'Archivos eliminados':(d.error||'Error'), d.success?'success':'error');
  if(d.success) setTimeout(()=>location.reload(),800);
}

async function resetConfig() {
  const h = {}; const p = document.getElementById('adminPass');
  if(p&&p.value){h['X-Admin-Key']=p.value;localStorage.setItem('cmh_admin',p.value);}
  if(!confirm('RESETEAR toda la configuracion?')) return;
  const r = await fetch('/api/config',{method:'DELETE',headers:h}); const d = await r.json();
  toast(d.success?'App reseteada':(d.error||'Error'), d.success?'success':'error');
  if(d.success) setTimeout(()=>location.reload(),800);
}

function filterFiles(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.file-row').forEach(r => {
    const n = r.querySelector('.file-name').textContent.toLowerCase();
    r.style.display = n.includes(q)?'flex':'none';
  });
}

function toast(msg, type) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast ' + (type||'');
  t.innerHTML = '<span class="toast-icon">'+(type==='success'?IC.check:IC.alert)+'</span><span>'+msg+'</span>';
  c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(8px)'; t.style.transition='all 300ms'; setTimeout(()=>t.remove(),300); },3000);
}

function formatTotalSize(files) {
  const b = files.reduce((s,f)=>s+(f.size||0),0);
  if(b<1024) return b+' B'; if(b<1048576) return (b/1024).toFixed(1)+' KB'; if(b<1073741824) return (b/1048576).toFixed(1)+' MB'; return (b/1073741824).toFixed(1)+' GB';
}
function countByType(files,t) { return files.filter(f=>(f.type_display||'').toLowerCase().includes(t)).length; }
function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

document.querySelectorAll('.modal-overlay').forEach(m => { m.addEventListener('click', e => { if(e.target===m) m.classList.remove('open'); }); });
</script>
</body>
</html>`;
}


// ============================================
// API DOCS
// ============================================
export function apiDocsPage(baseUrl) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>API Reference - Cloud Media Host</title>
<style>
${BASE_CSS}
  .docs { max-width: 780px; margin: 0 auto; padding: 32px 24px; }
  .docs h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
  .docs .subtitle { color: var(--text-muted); font-size: 14px; margin-bottom: 32px; }
  .docs h2 { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 32px 0 12px; }
  .endpoint { margin-bottom: 16px; }
  .endpoint-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .method-badge { padding: 3px 8px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .m-get { background: var(--success-subtle); color: var(--success); }
  .m-post { background: var(--info-subtle); color: var(--info); }
  .m-delete { background: var(--danger-subtle); color: var(--danger); }
  .endpoint-path { font-family: 'SF Mono','Fira Code',monospace; font-size: 14px; color: var(--text-primary); }
  .endpoint-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
  pre { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; overflow-x: auto; font-size: 12px; line-height: 1.7; margin: 8px 0; }
  code { font-family: 'SF Mono','Fira Code',monospace; }
  pre code { color: var(--text-secondary); }
  .kw { color: var(--info); }
  .str { color: var(--success); }
  .cmt { color: var(--text-muted); }
  .docs a { color: var(--accent); }
</style>
</head>
<body>
<div class="docs">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">${IC.cloud} <span style="color:var(--text-muted);font-size:13px;font-weight:500">API Reference</span></div>
  <h1>Cloud Media Host</h1>
  <p class="subtitle">Base URL: <code style="color:var(--accent)">${baseUrl}</code></p>

  <h2>Configuracion</h2>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-get">GET</span><span class="endpoint-path">/api/status</span></div>
    <p class="endpoint-desc">Estado actual del sistema y servicios configurados</p>
    <pre><code><span class="cmt">// Response</span>
{ <span class="str">"configured"</span>: true, <span class="str">"services"</span>: { <span class="str">"drive"</span>: true, <span class="str">"cloudinary"</span>: false }, <span class="str">"file_count"</span>: 5 }</code></pre>
  </div>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-post">POST</span><span class="endpoint-path">/api/config</span></div>
    <p class="endpoint-desc">Guardar credenciales (solo primera vez o con admin password)</p>
    <pre><code><span class="cmt">// Body</span>
{ <span class="str">"drive_credentials"</span>: { ... }, <span class="str">"drive_folder_id"</span>: <span class="str">"1xKj..."</span> }
<span class="cmt">// Header (si ya hay config): X-Admin-Key: password</span></code></pre>
  </div>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-delete">DEL</span><span class="endpoint-path">/api/config</span></div>
    <p class="endpoint-desc">Resetear toda la configuracion (admin)</p>
  </div>

  <h2>Archivos</h2>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-post">POST</span><span class="endpoint-path">/api/upload</span></div>
    <p class="endpoint-desc">Subir archivo (multipart/form-data, campo "file")</p>
    <pre><code><span class="cmt">// Response</span>
{ <span class="str">"success"</span>: true, <span class="str">"file"</span>: { <span class="str">"id"</span>: <span class="str">"abc123"</span>, <span class="str">"name"</span>: <span class="str">"song.mp3"</span>, <span class="str">"download_url"</span>: <span class="str">"https://..."</span> } }</code></pre>
  </div>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-get">GET</span><span class="endpoint-path">/api/files</span></div>
    <p class="endpoint-desc">Listar todos los archivos</p>
  </div>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-get">GET</span><span class="endpoint-path">/api/files/:id</span></div>
    <p class="endpoint-desc">Informacion de un archivo especifico</p>
  </div>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-get">GET</span><span class="endpoint-path">/api/files/:id/download</span></div>
    <p class="endpoint-desc">Descargar archivo (redirect 302 a Google Drive)</p>
  </div>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-delete">DEL</span><span class="endpoint-path">/api/files/:id</span></div>
    <p class="endpoint-desc">Eliminar un archivo (admin)</p>
  </div>

  <div class="endpoint">
    <div class="endpoint-head"><span class="method-badge m-delete">DEL</span><span class="endpoint-path">/api/files</span></div>
    <p class="endpoint-desc">Eliminar todos los archivos (admin)</p>
  </div>

  <h2>Ejemplos</h2>

  <h2 style="font-size:14px;color:var(--text-secondary);text-transform:none;letter-spacing:0">Node.js</h2>
  <pre><code><span class="kw">const</span> form = <span class="kw">new</span> FormData();
form.append(<span class="str">'file'</span>, fs.createReadStream(<span class="str">'song.mp3'</span>));
<span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">'${baseUrl}/api/upload'</span>, { method: <span class="str">'POST'</span>, body: form });
<span class="kw">const</span> data = <span class="kw">await</span> res.json();
<span class="cmt">// data.file.download_url = enlace publico</span></code></pre>

  <h2 style="font-size:14px;color:var(--text-secondary);text-transform:none;letter-spacing:0">Python</h2>
  <pre><code><span class="kw">import</span> requests
<span class="kw">with</span> open(<span class="str">"song.mp3"</span>, <span class="str">"rb"</span>) <span class="kw">as</span> f:
    r = requests.post(<span class="str">"${baseUrl}/api/upload"</span>, files={<span class="str">"file"</span>: f})
archivo = r.json()

<span class="cmt"># Streaming download</span>
r = requests.get(<span class="str">f"${baseUrl}/api/files/{archivo['file']['id']}/download"</span>, stream=<span class="kw">True</span>)
<span class="kw">with</span> open(<span class="str">"out.mp3"</span>, <span class="str">"wb"</span>) <span class="kw">as</span> f:
    <span class="kw">for</span> chunk <span class="kw">in</span> r.iter_content(8192): f.write(chunk)</code></pre>

  <h2 style="font-size:14px;color:var(--text-secondary);text-transform:none;letter-spacing:0">cURL</h2>
  <pre><code>curl -X POST <span class="str">"${baseUrl}/api/upload"</span> -F <span class="str">"file=@song.mp3"</span>
curl <span class="str">"${baseUrl}/api/files"</span>
curl -L <span class="str">"${baseUrl}/api/files/ID/download"</span> -o song.mp3
curl -X DELETE <span class="str">"${baseUrl}/api/files/ID"</span> -H <span class="str">"X-Admin-Key: password"</span></code></pre>
</div>
</body>
</html>`;
}

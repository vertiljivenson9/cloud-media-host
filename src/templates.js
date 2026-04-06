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
  chevronLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  refreshCw: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  folder: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
  folderPlus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
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

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatTotalSize(files) {
  const b = files.reduce((s,f) => s + (f.size || 0), 0);
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB';
  return (b / 1073741824).toFixed(1) + ' GB';
}

function countByType(files, t) {
  return files.filter(f => (f.type_display || '').toLowerCase().includes(t)).length;
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
export function setupPage(existingConfig, authState) {
  authState = authState || { firebaseConfigured: false, user: null };
  const savedFolders = existingConfig?.folders || [];
  const hasCreds = !!existingConfig?.drive_credentials;
  const isConfigured = hasCreds && savedFolders.length > 0;

  // Build folder entries HTML with API info for already-saved folders
  const savedEntriesHtml = savedFolders.map((f, i) => {
    const fid = f.id || '';
    const driveFid = f.drive_folder_id || '';
    return `
    <div class="folder-entry ${fid ? 'has-id' : ''}" data-index="${i}" ${fid ? 'data-folder-id="'+fid+'"' : ''}>
      <div class="folder-entry-top">
        <input type="text" class="folder-name" placeholder="Nombre (ej: Mi app de musica)" value="${f.name || ''}">
        <button class="btn-remove" data-remove="1" type="button" title="Quitar">${IC.x}</button>
      </div>
      <div class="folder-entry-bottom">
        <input type="text" class="folder-url" placeholder="https://drive.google.com/drive/folders/... o solo el ID" value="${driveFid}">
        <button type="button" class="browse-drive-btn" onclick="openDrivePicker(this)" title="Buscar en Google Drive">${IC.folder} Buscar en Drive</button>
      </div>
      ${fid ? `
      <div class="folder-api-section" onclick="this.classList.toggle('expanded')">
        <div class="folder-api-toggle">
          <span style="color:var(--accent)">${IC.book}</span>
          <span>API de integracion</span>
          <span style="margin-left:auto;color:var(--text-muted);font-size:11px">▼</span>
        </div>
        <div class="folder-api-content">
          <div class="folder-api-row">
            <span class="folder-api-label">Subir archivo</span>
            <code class="folder-api-code">POST /api/upload?folder_id=${fid}</code>
            <button class="btn-copy-api" onclick="event.stopPropagation();copyApiUrl('POST /api/upload?folder_id=${fid}')">${IC.copy}</button>
          </div>
          <div class="folder-api-row">
            <span class="folder-api-label">Listar archivos</span>
            <code class="folder-api-code">GET /api/folders/${fid}/files</code>
            <button class="btn-copy-api" onclick="event.stopPropagation();copyApiUrl('GET /api/folders/${fid}/files')">${IC.copy}</button>
          </div>
          <div class="folder-api-row">
            <span class="folder-api-label">Eliminar carpeta</span>
            <code class="folder-api-code">DELETE /api/folders/${fid}</code>
            <button class="btn-copy-api" onclick="event.stopPropagation();copyApiUrl('DELETE /api/folders/${fid}')">${IC.copy}</button>
          </div>
          <div class="folder-api-row" style="border-bottom:none;padding-bottom:4px">
            <span class="folder-api-label" style="color:var(--accent);font-weight:600">API Key</span>
            <code class="folder-api-code" id="apikey-${fid}" style="font-size:10px;letter-spacing:0.5px">${f.api_key || 'generando...'}</code>
            <button class="btn-copy-api" onclick="event.stopPropagation();copyApiUrl('${f.api_key || ''}')" title="Copiar API Key">${IC.copy}</button>
          </div>
          <div class="folder-api-info" style="padding-top:2px;padding-bottom:2px">
            Usa esta key en el header <code>X-API-Key</code> o <code>Authorization: Bearer</code> para acceder a esta carpeta desde aplicaciones externas. Ejemplo:<br>
            <code style="background:var(--bg-root);padding:1px 5px;border-radius:3px;font-size:10px;color:var(--accent);font-family:'SF Mono','Fira Code',monospace">curl -H "X-API-Key: ${f.api_key || '...'}" https://TU-WORKER.workers.dev/api/folders/${fid}/files</code>
          </div>
          <div class="folder-api-info">
            Para usar la API, incluye el header <code>X-Folder-ID: ${fid}</code> o envia <code>folder_id</code> como parametro. Consulta la <a href="/api/docs" target="_blank">documentacion completa</a> para mas detalles y ejemplos en multiples lenguajes.
          </div>
        </div>
      </div>` : ''}
    </div>`;
  }).join('');

  // Always show at least one empty entry if no saved folders exist
  const folderEntriesHtml = savedEntriesHtml || `
    <div class="folder-entry" data-index="0">
      <div class="folder-entry-top">
        <input type="text" class="folder-name" placeholder="Nombre (ej: Mi app de musica)" value="">
        <button class="btn-remove" data-remove="1" type="button" title="Quitar">${IC.x}</button>
      </div>
      <div class="folder-entry-bottom">
        <input type="text" class="folder-url" placeholder="https://drive.google.com/drive/folders/... o solo el ID" value="">
        <button type="button" class="browse-drive-btn" onclick="openDrivePicker(this)" title="Buscar en Google Drive">${IC.folder} Buscar en Drive</button>
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${isConfigured ? 'Configuracion' : 'Setup'} - Cloud Media Host</title>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<style>
${BASE_CSS}
  body { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
  .setup-container { max-width: 640px; width: 100%; }
  .setup-logo { text-align: center; margin-bottom: 32px; }
  .setup-logo svg { color: var(--accent); margin-bottom: 12px; }
  .setup-logo h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
  .setup-logo p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
  .back-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;
    cursor: pointer; transition: color var(--transition);
    background: none; border: none; font-family: var(--font);
    padding: 0;
  }
  .back-link:hover { color: var(--accent); }
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

  /* Folder list */
  .folder-entry {
    display: flex; flex-direction: column; gap: 8px;
    padding: 12px; background: var(--bg-root); border-radius: var(--radius-md);
    margin-bottom: 8px; border: 1px solid var(--border); position: relative;
  }
  .folder-entry-top { display: flex; align-items: center; gap: 8px; }
  .folder-entry-top input { flex: 1; padding: 8px 10px; font-size: 13px; }
  .folder-entry-bottom { display: flex; gap: 8px; }
  .folder-entry-bottom input { flex: 1; padding: 8px 10px; font-size: 12px; font-family: 'SF Mono','Fira Code',monospace; }
  .folder-entry .btn-remove {
    background: none; border: none; color: var(--text-muted); cursor: pointer;
    padding: 4px; border-radius: var(--radius-sm); display: flex; transition: all var(--transition);
  }
  .folder-entry .btn-remove:hover { color: var(--danger); background: var(--danger-subtle); }
  .add-folder-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px; border: 1px dashed var(--border); border-radius: var(--radius-md);
    background: transparent; color: var(--text-muted); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all var(--transition); width: 100%;
    font-family: var(--font);
  }
  .add-folder-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-subtle); }

  /* Per-folder API section */
  .folder-api-section {
    margin-top: 4px; border-top: 1px solid var(--border); padding-top: 0;
    cursor: pointer; border-radius: var(--radius-sm);
    overflow: hidden;
  }
  .folder-api-toggle {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 4px 4px; font-size: 12px; font-weight: 500;
    color: var(--text-secondary); user-select: none;
  }
  .folder-api-toggle span:last-child {
    transition: transform var(--transition);
  }
  .folder-api-section.expanded .folder-api-toggle span:last-child {
    transform: rotate(180deg);
  }
  .folder-api-content {
    max-height: 0; overflow: hidden;
    transition: max-height 250ms ease;
  }
  .folder-api-section.expanded .folder-api-content {
    max-height: 300px;
  }
  .folder-api-row {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 4px; border-bottom: 1px solid var(--border);
  }
  .folder-api-row:last-of-type { border-bottom: none; }
  .folder-api-label {
    font-size: 11px; color: var(--text-muted); min-width: 100px; flex-shrink: 0;
  }
  .folder-api-code {
    flex: 1; font-size: 11px; color: var(--accent);
    background: var(--bg-surface); padding: 3px 8px;
    border-radius: var(--radius-sm); font-family: 'SF Mono','Fira Code',monospace;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .folder-api-info {
    font-size: 11px; color: var(--text-muted); line-height: 1.6;
    padding: 8px 4px 4px;
  }
  .folder-api-info code {
    background: var(--bg-surface); padding: 1px 5px; border-radius: 3px;
    color: var(--accent); font-family: 'SF Mono','Fira Code',monospace; font-size: 11px;
  }
  .btn-copy-api {
    background: none; border: 1px solid var(--border); color: var(--text-muted);
    padding: 4px 6px; border-radius: var(--radius-sm); cursor: pointer;
    display: flex; transition: all var(--transition); flex-shrink: 0;
  }
  .btn-copy-api:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-subtle); }

  /* Creds collapse */
  .creds-section.is-collapsed .steps-box { display: none; }
  .creds-toggle {
    display: inline-flex; align-items: center; gap: 4px;
    background: none; border: none; color: var(--text-muted);
    font-size: 12px; cursor: pointer; padding: 2px 0;
    font-family: var(--font); transition: color var(--transition);
  }
  .creds-toggle:hover { color: var(--text-secondary); }
  .creds-section.is-collapsed textarea { display: none; }
  .creds-section.is-collapsed .creds-toggle::after { content: ''; }

  /* Folder Picker Button */
  .browse-drive-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border: none; border-radius: var(--radius-md);
    background: var(--accent); color: #fff;
    font-family: var(--font); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all var(--transition); white-space: nowrap;
    flex-shrink: 0;
  }
  .browse-drive-btn:hover { background: var(--accent-hover); }
  .browse-drive-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .browse-drive-btn svg { flex-shrink: 0; }
  .folder-entry-bottom { display: flex; gap: 8px; align-items: center; }

  /* Drive Folder Picker Modal */
  .drive-picker-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
    z-index: 500; align-items: center; justify-content: center; padding: 20px;
  }
  .drive-picker-overlay.open { display: flex; }
  .drive-picker-box {
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); width: 100%; max-width: 560px;
    max-height: 80vh; display: flex; flex-direction: column;
    animation: modalIn 200ms ease;
  }
  .drive-picker-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 20px; border-bottom: 1px solid var(--border);
  }
  .drive-picker-header h3 { font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .drive-picker-search {
    padding: 10px 20px; border-bottom: 1px solid var(--border);
  }
  .drive-picker-search input {
    width: 100%; padding: 8px 10px; font-size: 13px;
    background: var(--bg-root); border: 1px solid var(--border);
    border-radius: var(--radius-md); color: var(--text-primary);
    font-family: var(--font); outline: none;
  }
  .drive-picker-search input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }
  .drive-picker-breadcrumb {
    padding: 8px 20px; font-size: 12px; color: var(--text-muted);
    border-bottom: 1px solid var(--border); display: flex; align-items: center;
    gap: 4px; flex-wrap: wrap; min-height: 34px;
  }
  .drive-picker-breadcrumb .bc-item {
    cursor: pointer; color: var(--text-secondary); transition: color var(--transition);
    padding: 2px 4px; border-radius: 4px;
  }
  .drive-picker-breadcrumb .bc-item:hover { color: var(--accent); background: var(--accent-subtle); }
  .drive-picker-breadcrumb .bc-sep { color: var(--text-muted); font-size: 11px; }
  .drive-picker-list {
    flex: 1; overflow-y: auto; padding: 4px 0;
  }
  .drive-picker-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px; cursor: pointer; transition: background var(--transition);
    border-bottom: 1px solid rgba(39,39,42,0.5);
  }
  .drive-picker-item:hover { background: var(--bg-surface-2); }
  .drive-picker-item.selected { background: var(--accent-subtle); border-left: 3px solid var(--accent); }
  .drive-picker-item .dpi-icon { color: var(--accent); flex-shrink: 0; display: flex; }
  .drive-picker-item .dpi-name { flex: 1; font-size: 13px; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .drive-picker-item .dpi-action { flex-shrink: 0; }
  .drive-picker-item .dpi-action button {
    background: none; border: 1px solid var(--border); color: var(--text-muted);
    padding: 4px 8px; border-radius: var(--radius-sm); font-size: 11px;
    font-family: var(--font); cursor: pointer; transition: all var(--transition);
    display: flex; align-items: center; gap: 4px;
  }
  .drive-picker-item .dpi-action button:hover { color: var(--info); border-color: var(--info); background: var(--info-subtle); }
  .drive-picker-item .dpi-enter {
    background: none; border: none; color: var(--text-muted);
    padding: 4px; border-radius: var(--radius-sm); cursor: pointer;
    display: flex; transition: all var(--transition); flex-shrink: 0;
  }
  .drive-picker-item .dpi-enter:hover { color: var(--accent); background: var(--accent-subtle); }
  .drive-picker-empty {
    padding: 32px 20px; text-align: center; color: var(--text-muted); font-size: 13px;
  }
  .drive-picker-loading {
    padding: 32px 20px; text-align: center; color: var(--text-muted); font-size: 13px;
  }
  .drive-picker-footer {
    display: flex; justify-content: flex-end; gap: 8px;
    padding: 12px 20px; border-top: 1px solid var(--border);
  }
  .drive-picker-footer .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  @keyframes dpSpin { to { transform: rotate(360deg); } }
  .dp-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.2); border-top-color: var(--accent); border-radius: 50%; animation: dpSpin 0.6s linear infinite; }
</style>
</head>
<body>
<div id="firebase-auth-bar" style="display:none">
  <div id="firebase-auth-user" style="display:flex;align-items:center;gap:10px;padding:12px 20px;background:var(--bg-surface);border-bottom:1px solid var(--border)">
    <img id="firebase-user-avatar" src="" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover">
    <div style="flex:1">
      <div id="firebase-user-name" style="font-size:14px;font-weight:600;color:var(--text-primary)"></div>
      <div id="firebase-user-email" style="font-size:12px;color:var(--text-muted)"></div>
    </div>
    <button id="firebase-signout-btn" class="btn btn-ghost" style="font-size:12px;padding:6px 12px">Cerrar sesion</button>
  </div>
</div>

<!-- Drive Folder Picker Modal -->
<div class="drive-picker-overlay" id="drivePickerOverlay">
  <div class="drive-picker-box">
    <div class="drive-picker-header">
      <h3><span style="color:var(--accent)">${IC.folder}</span> Seleccionar carpeta de Drive</h3>
      <button class="modal-close" id="drivePickerClose">${IC.x}</button>
    </div>
    <div class="drive-picker-search">
      <input type="text" id="drivePickerSearch" placeholder="Buscar carpetas...">
    </div>
    <div class="drive-picker-breadcrumb" id="drivePickerBreadcrumb"></div>
    <div class="drive-picker-list" id="drivePickerList">
      <div class="drive-picker-loading"><span class="dp-spinner"></span> Cargando carpetas...</div>
    </div>
    <div class="drive-picker-footer">
      <button class="btn btn-ghost" id="drivePickerCancel">Cancelar</button>
      <button class="btn btn-primary" id="drivePickerOk" disabled>${IC.check} Seleccionar</button>
    </div>
  </div>
</div>

<script>
(function() {
  // Check Firebase auth config
  fetch('/api/auth/firebase-config').then(r => r.json()).then(function(cfg) {
    if (!cfg.firebase_enabled) return;
    
    // Initialize Firebase
    firebase.initializeApp({
      apiKey: cfg.api_key,
      authDomain: cfg.auth_domain,
      projectId: cfg.project_id
    });
    
    var auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    var authBar = document.getElementById('firebase-auth-bar');
    var authUser = document.getElementById('firebase-auth-user');
    var signoutBtn = document.getElementById('firebase-signout-btn');
    
    function showSignedIn(user) {
      authBar.style.display = 'block';
      document.getElementById('firebase-user-avatar').src = user.photoURL || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%233F3F46" width="40" height="40"/><text x="50%" y="54%" text-anchor="middle" fill="white" font-size="18" font-family="sans-serif">' + (user.displayName || user.email || '?')[0].toUpperCase() + '</text></svg>');
      document.getElementById('firebase-user-name').textContent = user.displayName || 'Usuario';
      document.getElementById('firebase-user-email').textContent = user.email || '';
      // Store token for API calls
      user.getIdToken().then(function(token) {
        window.__firebaseToken = token;
        // Dispatch event for other scripts to react
        window.dispatchEvent(new CustomEvent('firebase-auth', { detail: { user: user, token: token } }));
      });
    }
    
    function showSignedOut() {
      authBar.style.display = 'none';
      window.__firebaseToken = null;
    }
    
    auth.onAuthStateChanged(function(user) {
      if (user) { showSignedIn(user); } 
      else { showSignedOut(); }
    });
    
    signoutBtn.addEventListener('click', function() {
      document.cookie = '__session=; path=/; max-age=0';
      auth.signOut().then(function() { location.href = '/'; });
    });
    
    // Expose auth for use by other page scripts
    window.__firebaseAuth = auth;
  });
})();
</script>

<div class="setup-container">
  ${isConfigured ? `
  <button class="back-link" onclick="location.href='/'">
    ${IC.chevronLeft} Volver al dashboard
  </button>` : ''}

  <div class="setup-logo">
    ${IC.cloud}
    <h1>Cloud Media Host</h1>
    <p>${isConfigured ? 'Configuracion del workspace' : 'Almacenamiento gratuito sobre Google Drive + Cloudflare'}</p>
  </div>

  <div class="card setup-card creds-section ${isConfigured ? 'is-collapsed' : ''}">
    <h2>
      <span style="color:var(--accent)">${IC.hardDrive}</span>
      Cuenta de servicio
      <span class="badge badge-muted">Opcional (solo Workspace)</span>
    </h2>

    ${isConfigured ? `
    <button class="creds-toggle" onclick="this.closest('.creds-section').classList.toggle('is-collapsed')">
      ${IC.settings} Mostrar para actualizar credenciales
    </button>` : ''}

    <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;line-height:1.5">
      ⚠️ Las Service Accounts <strong>no pueden crear archivos</strong> en carpetas regulares de My Drive. 
      Solo funcionan con <strong>Shared Drives de Google Workspace</strong>. Para cuentas personales de Gmail, 
      usa la sección <strong>OAuth2</strong> de abajo.
    </p>

    <div class="field-group">
      <label class="field-label">Service Account JSON</label>
      <textarea id="driveJson" rows="4" placeholder="${isConfigured ? 'Dejar vacio para mantener las credenciales actuales...' : 'Opcional — solo para Google Workspace'}"></textarea>
      <div class="field-hint">${isConfigured ? '✓ Credenciales guardadas — pegar de nuevo para actualizar' : 'Contenido completo del archivo JSON descargado de Google Cloud Console'}</div>
    </div>

    <div class="steps-box">
      <strong>Para Google Workspace con Shared Drives:</strong><br>
      1. Ir a <a href="https://console.cloud.google.com" target="_blank">console.cloud.google.com</a><br>
      2. Crear proyecto → Habilitar <strong>Google Drive API</strong><br>
      3. Crear <strong>Cuenta de servicio</strong> → Descargar clave JSON<br>
      4. Crear un <strong>Shared Drive</strong> → Dar acceso a la Service Account
    </div>
  </div>

  <div class="card setup-card" style="border-color:var(--accent);background:linear-gradient(135deg, var(--bg-surface) 0%, rgba(249,115,22,0.05) 100%)">
    <h2>
      <span style="color:var(--accent)">${IC.check}</span>
      OAuth2 — Cuenta de Google
      <span class="badge ${existingConfig?.oauth2_refresh_token ? 'badge-success' : 'badge-accent'}">${existingConfig?.oauth2_refresh_token ? 'Conectado' : 'Recomendado'}</span>
    </h2>
    
    ${existingConfig?.oauth2_refresh_token ? `
    <div style="padding:12px 16px;background:var(--success-subtle);border:1px solid rgba(34,197,94,0.2);border-radius:var(--radius-md);margin-bottom:16px;font-size:13px;color:var(--success)">
      ✅ Conectado como <strong>${existingConfig.oauth2_user_email || 'cuenta de Google'}</strong>
      <br><span style="color:var(--text-muted);font-size:12px">Los archivos se subirán a tu Google Drive usando tus credenciales.</span>
    </div>
    <div style="margin-top:8px">
      <button class="btn btn-ghost" id="disconnectOAuth2" type="button" style="width:100%;justify-content:center">
        ${IC.x} Desconectar cuenta de Google
      </button>
    </div>
    ` : `
    <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">
      Para cuentas personales de Gmail, usa OAuth2 para autenticar con tu cuenta de Google. 
      Esto permite subir archivos directamente a tu Drive sin las limitaciones de la Service Account.
    </p>
    
    <div class="field-group">
      <label class="field-label">OAuth2 Client ID</label>
      <input type="text" id="oauth2ClientId" placeholder="xxxxxxxx.apps.googleusercontent.com" value="${existingConfig?.oauth2_client_id || ''}">
    </div>
    
    <div class="field-group">
      <label class="field-label">OAuth2 Client Secret</label>
      <input type="text" id="oauth2ClientSecret" placeholder="GOCSPX-xxxxxxxx" value="${existingConfig?.oauth2_client_secret ? '••••••••••' : ''}">
      ${existingConfig?.oauth2_client_secret ? '<div class="field-hint">Guardado — dejar vacio para mantener el actual</div>' : ''}
    </div>
    
    <div id="oauth2ConnectArea">
      <button class="btn btn-primary btn-block" id="connectOAuth2Btn" type="button" style="margin-top:12px">
        🔗 Conectar cuenta de Google
      </button>
      <div id="oauth2Status" style="margin-top:8px;display:none"></div>
    </div>

    <div class="steps-box" style="margin-top:12px">
      <strong>Como configurar OAuth2:</strong><br>
      1. Ir a <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud → APIs & Credentials</a><br>
      2. Click <strong>"Crear credenciales"</strong> → <strong>"ID de cliente OAuth 2.0"</strong><br>
      3. Tipo: <strong>Aplicación web</strong><br>
      4. Agregar la URL de tu Worker como <strong>URI de redireccion autorizada</strong>:<br>
      &nbsp;&nbsp;<code style="background:var(--bg-root);padding:2px 6px;border-radius:3px;font-size:11px" id="redirectUriHint">https://TU-WORKER.workers.dev/api/auth/callback</code><br>
      5. Copiar <strong>Client ID</strong> y <strong>Client Secret</strong> y pegar arriba<br>
      6. Click <strong>"Conectar cuenta de Google"</strong> → Autorizar → Listo!
    </div>
    `}
  </div>

  <div class="card setup-card">
    <h2>
      <span style="color:var(--info)">${IC.folder}</span>
      Carpetas de Google Drive
      <span class="badge badge-accent">Requerido</span>
    </h2>
    <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">
      Vincula las carpetas de tu Google Drive donde se almacenaran los archivos. Pega el enlace completo de la carpeta o solo el ID. Cada carpeta funciona como un espacio independiente con su propio API para integrar con aplicaciones externas.
    </p>

    <div id="folderList">
      ${folderEntriesHtml}
    </div>

    <div id="addFolderArea" style="margin-top:8px">
      <button class="add-folder-btn" id="addFolderBtn" type="button">
        + Agregar otra carpeta
      </button>
    </div>
  </div>

  <div class="card setup-card">
    <h2>
      <span style="color:var(--info)">${IC.globe}</span>
      Cloudinary
      <span class="badge badge-muted">Opcional</span>
    </h2>
    <div class="toggle-row" onclick="document.getElementById('enableCld').click()">
      <input type="checkbox" id="enableCld" ${existingConfig?.cloudinary_cloud_name ? 'checked' : ''}>
      <label for="enableCld">Habilitar para thumbnails y streaming de video</label>
    </div>
    <div class="optional-fields ${existingConfig?.cloudinary_cloud_name ? 'visible' : ''}" id="cldFields">
      <div class="field-group">
        <label class="field-label">Cloud Name</label>
        <input type="text" id="cloudName" placeholder="tu_cloud_name" value="${existingConfig?.cloudinary_cloud_name || ''}">
      </div>
      <div class="field-group">
        <label class="field-label">Upload Preset (unsigned)</label>
        <input type="text" id="uploadPreset" placeholder="unsigned_preset" value="${existingConfig?.cloudinary_upload_preset || ''}">
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
      <input type="password" id="adminPwd" placeholder="${isConfigured ? 'Dejar vacio para mantener la actual' : 'Dejar vacio = acceso abierto a todos'}">
      <div class="field-hint">Solo necesario si quieres restringir eliminacion y cambios de configuracion</div>
    </div>
  </div>

  <div class="card setup-card" style="border-color:#FFCA28;background:linear-gradient(135deg, var(--bg-surface) 0%, rgba(255,202,40,0.03) 100%)">
    <h2>
      <span style="color:#FFCA28">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </span>
      Firebase Authentication
      <span class="badge ${authState?.firebaseConfigured ? 'badge-success' : 'badge-muted'}">${authState?.firebaseConfigured ? 'Activo' : 'Opcional'}</span>
    </h2>
    <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">
      Agrega Firebase Auth para que los usuarios inicien sesion con Google. 
      Esto reemplaza la contrasena de administrador con autenticacion segura.
      Sin Firebase, el acceso es abierto (o protegido por contrasena de admin).
    </p>
    <div class="field-hint" style="margin-bottom:12px;color:#FFCA28;font-size:12px">
      Configura FIREBASE_PROJECT_ID y FIREBASE_API_KEY en <strong>wrangler.toml</strong> o como secrets en Cloudflare Dashboard.
    </div>
    <div class="steps-box">
      <strong>Para configurar Firebase Auth:</strong><br>
      1. Ir a <a href="https://console.firebase.google.com" target="_blank">console.firebase.google.com</a><br>
      2. Crear proyecto (o usar existente)<br>
      3. Ir a <strong>Authentication → Sign-in method</strong><br>
      4. Habilitar <strong>Google</strong> como proveedor<br>
      5. Copiar <strong>Project ID</strong> y <strong>API Key</strong> de Project Settings<br>
      6. Agregar como variables de entorno en tu Worker:<br>
      &nbsp;&nbsp;<code style="background:var(--bg-root);padding:2px 6px;border-radius:3px;font-size:11px">FIREBASE_PROJECT_ID = "tu-proyecto-id"</code><br>
      &nbsp;&nbsp;<code style="background:var(--bg-root);padding:2px 6px;border-radius:3px;font-size:11px">FIREBASE_API_KEY = "AIzaSy..."</code>
    </div>
  </div>

  <div class="card setup-card" style="border-color:var(--border);background:linear-gradient(135deg, var(--bg-surface) 0%, rgba(249,115,22,0.03) 100%)">
    <h2>
      <span style="color:var(--accent)">${IC.book}</span>
      API para desarrolladores
    </h2>
    <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin-bottom:16px">
      Cada carpeta que vincules genera automaticamente un workspace con API REST. Puedes subir archivos, listarlos, descargarlos y eliminarlos desde cualquier lenguaje. Documentacion completa con ejemplos en Node.js, Python, Java y cURL, disponible en 3 idiomas.
    </p>
    <a href="/api/docs" target="_blank" class="btn btn-primary" style="width:100%;justify-content:center">
      ${IC.book} Ver documentacion de la API
    </a>
  </div>

  <button class="btn btn-primary btn-block" id="saveBtn" type="button" style="margin-top:20px;padding:12px 16px;font-size:15px">
    &#10003; ${isConfigured ? 'Guardar cambios' : 'Guardar y empezar'}
  </button>

  <div class="save-status" id="saveStatus"></div>

  <button class="btn btn-block" id="testDriveBtn" type="button" style="margin-top:12px;padding:10px 16px;font-size:14px;background:var(--bg-surface);border:1px solid var(--border);color:var(--text-secondary);cursor:pointer;border-radius:var(--radius-md);text-align:center;justify-content:center;width:100%;display:flex;align-items:center;gap:8px">
    &#128269; Probar conexion con Google Drive
  </button>

  <div id="driveTestResults" style="margin-top:8px;display:none"></div>

  <div class="footer-text">
    Archivos almacenados en tu Google Drive (15 GB gratis) · Servido por Cloudflare Workers
  </div>
</div>

<script>
(function() {
  document.getElementById('enableCld').addEventListener('change', function(e) {
    document.getElementById('cldFields').classList.toggle('visible', e.target.checked);
  });

  // Attach add-folder button event
  var addBtn = document.getElementById('addFolderBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function(e) {
      e.preventDefault();
      addFolderEntry();
    });
  }

  // Attach save button event
  var saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function(e) {
      e.preventDefault();
      saveConfig();
    });
  }

  // Test Drive connection button
  var testBtn = document.getElementById('testDriveBtn');
  if (testBtn) {
    testBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      var resultsDiv = document.getElementById('driveTestResults');
      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = '<div style="padding:12px;text-align:center;color:var(--text-muted);font-size:13px">Probando conexion...</div>';
      testBtn.disabled = true;
      testBtn.textContent = 'Probando...';
      try {
        var r = await fetch('/api/test-drive', { method: 'POST' });
        var d = await r.json();
        if (d.steps) {
          var html = '<div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px;font-size:13px;line-height:1.7">';
          d.steps.forEach(function(s) {
            var icon = s.status === 'ok' ? '&#9989;' : s.status === 'warn' ? '&#9888;&#65039;' : s.status === 'fix' ? '&#128161;' : '&#10060;';
            var color = s.status === 'ok' ? 'var(--success)' : s.status === 'warn' ? '#eab308' : s.status === 'fix' ? 'var(--info)' : 'var(--danger)';
            html += '<div style="margin-bottom:8px;padding:8px;background:var(--bg-root);border-radius:var(--radius-sm)">';
            html += '<div style="font-weight:600;color:' + color + '">' + icon + ' Paso ' + s.step + ': ' + s.name + '</div>';
            html += '<div style="color:var(--text-secondary);margin-top:2px;word-break:break-all">' + s.detail + '</div>';
            html += '</div>';
          });
          html += '</div>';
          resultsDiv.innerHTML = html;
        } else {
          resultsDiv.innerHTML = '<div style="padding:12px;color:var(--danger);font-size:13px">' + (d.error || 'Error desconocido') + '</div>';
        }
      } catch(err) {
        resultsDiv.innerHTML = '<div style="padding:12px;color:var(--danger);font-size:13px">Error de conexion: ' + err.message + '</div>';
      }
      testBtn.disabled = false;
      testBtn.innerHTML = '&#128269; Probar conexion con Google Drive';
    });
  }

  // Event delegation for remove buttons (server-rendered entries)
  document.addEventListener('click', function(e) {
    var removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      removeBtn.closest('.folder-entry').remove();
    }
  });

  window.removeFolderEntry = function(btn) {
    btn.closest('.folder-entry').remove();
  };

  window.addFolderEntry = function(name, folderId) {
    var list = document.getElementById('folderList');
    if (!list) return;
    var idx = list.children.length;

    var div = document.createElement('div');
    div.className = 'folder-entry';
    div.dataset.index = idx;

    var top = document.createElement('div');
    top.className = 'folder-entry-top';

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'folder-name';
    nameInput.placeholder = 'Nombre (ej: Mi app de musica)';
    nameInput.value = name || '';

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.title = 'Quitar';
    removeBtn.textContent = '\\u2715';
    removeBtn.addEventListener('click', function() {
      div.remove();
    });

    top.appendChild(nameInput);
    top.appendChild(removeBtn);

    var bottom = document.createElement('div');
    bottom.className = 'folder-entry-bottom';

    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'folder-url';
    urlInput.placeholder = 'https://drive.google.com/drive/folders/... o solo el ID';
    urlInput.value = folderId || '';

    bottom.appendChild(urlInput);

    var browseBtn = document.createElement('button');
    browseBtn.type = 'button';
    browseBtn.className = 'browse-drive-btn';
    browseBtn.title = 'Buscar en Google Drive';
    browseBtn.innerHTML = '${IC.folder} Buscar en Drive';
    browseBtn.onclick = function() { openDrivePicker(browseBtn); };
    bottom.appendChild(browseBtn);

    div.appendChild(top);
    div.appendChild(bottom);
    list.appendChild(div);

    // Move the add button below the new entry
    var addArea = document.getElementById('addFolderArea');
    if (addArea) {
      list.parentNode.appendChild(addArea);
    }

    nameInput.focus();
  };

  window.extractFolderId = function(input) {
    var s = (input || '').trim();
    if (!s) return '';
    // Try to extract ID from Google Drive folder URL
    var m = s.match(/folders\/([a-zA-Z0-9_-]{10,})/);
    if (m) return m[1];
    // Also try open?id= format
    var m2 = s.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (m2) return m2[1];
    // If it looks like a raw ID, return it
    if (/^[a-zA-Z0-9_-]{10,}$/.test(s)) return s;
    // Invalid format — return empty to trigger validation error
    return '';
  };

  window.copyApiUrl = function(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        var toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = '\\u2713 Copiado';
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 1500);
      });
    }
  };

  window.saveConfig = async function() {
    var btn = document.getElementById('saveBtn');
    var status = document.getElementById('saveStatus');
    btn.disabled = true;
    status.className = 'save-status';
    status.innerHTML = '';

    var driveJson = document.getElementById('driveJson').value.trim();
    var adminPwd = document.getElementById('adminPwd').value.trim();
    var enableCloud = document.getElementById('enableCld').checked;
    var isConfigured = ${isConfigured};

    // OAuth2 fields
    var oauth2ClientId = document.getElementById('oauth2ClientId') ? document.getElementById('oauth2ClientId').value.trim() : '';
    var oauth2ClientSecret = document.getElementById('oauth2ClientSecret') ? document.getElementById('oauth2ClientSecret').value.trim() : '';

    // Validate: need at least OAuth2 OR Service Account
    if (!driveJson && !oauth2ClientId && !isConfigured) { showErr('Configura OAuth2 o Service Account para continuar'); return; }

    var creds = null;
    if (driveJson) {
      try {
        creds = JSON.parse(driveJson);
        if (!creds.client_email || !creds.private_key) throw new Error('Campos faltantes');
      } catch (e) { showErr('JSON invalido: ' + e.message); return; }
    }

    var folderEntries = document.querySelectorAll('.folder-entry');
    var folders = [];
    var folderError = '';
    folderEntries.forEach(function(entry) {
      var name = entry.querySelector('.folder-name').value.trim();
      var rawId = entry.querySelector('.folder-url').value.trim();
      var folderId = extractFolderId(rawId);
      var existingId = entry.dataset.folderId || '';
      if (!name && !rawId) return;
      if (!name) { folderError = 'Cada carpeta necesita un nombre'; return; }
      if (!folderId) { folderError = 'ID de carpeta invalido para "' + name + '". Pega el enlace completo de Google Drive.'; return; }
      var folderObj = { name: name, drive_folder_id: folderId };
      if (existingId) folderObj.id = existingId;
      folders.push(folderObj);
    });
    if (folderError) { showErr(folderError); return; }
    if (folders.length === 0) { showErr('Agrega al menos una carpeta de Google Drive'); return; }

    var config = {};
    if (creds) config.drive_credentials = creds;
    config.folders = folders;
    if (adminPwd) config.admin_password = adminPwd;
    // Include OAuth2 credentials
    if (oauth2ClientId) config.oauth2_client_id = oauth2ClientId;
    if (oauth2ClientSecret && oauth2ClientSecret !== '••••••••••') config.oauth2_client_secret = oauth2ClientSecret;
    if (enableCloud) {
      config.cloudinary_cloud_name = document.getElementById('cloudName').value.trim();
      config.cloudinary_upload_preset = document.getElementById('uploadPreset').value.trim();
      if (!config.cloudinary_cloud_name || !config.cloudinary_upload_preset) { showErr('Cloud Name y Upload Preset son obligatorios'); return; }
    }

    try {
      var res = await fetch('/api/config', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(config) });
      var data = await res.json();
      if (data.success) { showOk('Configuracion guardada. Redirigiendo...'); setTimeout(function() { location.href = '/'; }, 1200); }
      else showErr(data.error || 'Error desconocido');
    } catch (e) { showErr('Error de conexion: ' + e.message); }
    btn.disabled = false;

    function showErr(msg) { status.className='save-status visible err'; status.innerHTML='&#9888; '+msg; btn.disabled=false; }
    function showOk(msg) { status.className='save-status visible ok'; status.innerHTML='&#10003; '+msg; }
  };

  // OAuth2 Connect button
  var connectBtn = document.getElementById('connectOAuth2Btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      var oauth2Status = document.getElementById('oauth2Status');
      var clientId = document.getElementById('oauth2ClientId').value.trim();
      var clientSecret = document.getElementById('oauth2ClientSecret').value.trim();
      
      if (!clientId || !clientSecret) {
        oauth2Status.style.display = 'block';
        oauth2Status.innerHTML = '<div style="padding:12px;color:var(--danger);font-size:13px;background:var(--danger-subtle);border-radius:var(--radius-md)">Completa Client ID y Client Secret primero.</div>';
        return;
      }
      
      // Save OAuth2 credentials first
      try {
        var saveRes = await fetch('/api/config', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({
          oauth2_client_id: clientId,
          oauth2_client_secret: clientSecret,
          drive_credentials: document.getElementById('driveJson').value.trim() || undefined,
          folders: []
        })});
        var saveData = await saveRes.json();
        if (!saveData.success) {
          oauth2Status.style.display = 'block';
          oauth2Status.innerHTML = '<div style="padding:12px;color:var(--danger);font-size:13px;background:var(--danger-subtle);border-radius:var(--radius-md)">Error al guardar: ' + (saveData.error || 'Unknown') + '</div>';
          return;
        }
      } catch(err) {
        oauth2Status.style.display = 'block';
        oauth2Status.innerHTML = '<div style="padding:12px;color:var(--danger);font-size:13px;background:var(--danger-subtle);border-radius:var(--radius-md)">Error: ' + err.message + '</div>';
        return;
      }
      
      // Get the OAuth2 consent URL
      try {
        connectBtn.disabled = true;
        connectBtn.textContent = 'Obteniendo URL de autorizacion...';
        
        var authRes = await fetch('/api/auth');
        var authData = await authRes.json();
        
        if (authData.auth_url) {
          oauth2Status.style.display = 'block';
          oauth2Status.innerHTML = '<div style="padding:12px;font-size:13px;background:var(--info-subtle);border-radius:var(--radius-md);color:var(--text-primary)">' +
            '&#128274; Redirigiendo a Google para autorizar...<br>' +
            '<span style="font-size:11px;color:var(--text-muted)">Si no se redirige automaticamente, </span>' +
            '<a href="' + authData.auth_url + '" target="_blank" style="font-size:11px">abre este enlace</a></div>';
          // Redirect to Google consent
          window.location.href = authData.auth_url;
        } else {
          oauth2Status.style.display = 'block';
          oauth2Status.innerHTML = '<div style="padding:12px;color:var(--danger);font-size:13px;background:var(--danger-subtle);border-radius:var(--radius-md)">Error: ' + (authData.error || 'No se pudo obtener URL de autorizacion') + '</div>';
        }
      } catch(err) {
        oauth2Status.style.display = 'block';
        oauth2Status.innerHTML = '<div style="padding:12px;color:var(--danger);font-size:13px;background:var(--danger-subtle);border-radius:var(--radius-md)">Error: ' + err.message + '</div>';
      }
      connectBtn.disabled = false;
    });
  }

  // OAuth2 Disconnect button
  var disconnectBtn = document.getElementById('disconnectOAuth2');
  if (disconnectBtn) {
    disconnectBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      if (!confirm('Desconectar la cuenta de Google? Ya no podras subir archivos con OAuth2.')) return;
      try {
        var res = await fetch('/api/auth/disconnect', { method: 'POST' });
        var data = await res.json();
        if (data.success) { location.reload(); }
        else alert('Error: ' + (data.error || 'Unknown'));
      } catch(err) { alert('Error: ' + err.message); }
    });
  }

  // Update redirect URI hint with current origin
  var redirectHint = document.getElementById('redirectUriHint');
  if (redirectHint) {
    redirectHint.textContent = window.location.origin + '/api/auth/callback';
  }

  // ============================================
  // DRIVE FOLDER PICKER
  // ============================================
  var dpOverlay = document.getElementById('drivePickerOverlay');
  var dpList = document.getElementById('drivePickerList');
  var dpBreadcrumb = document.getElementById('drivePickerBreadcrumb');
  var dpOkBtn = document.getElementById('drivePickerOk');
  var dpCancelBtn = document.getElementById('drivePickerCancel');
  var dpCloseBtn = document.getElementById('drivePickerClose');
  var dpSearchInput = document.getElementById('drivePickerSearch');

  var dpBreadcrumbTrail = [{ id: 'root', name: 'Mi Drive' }];
  var dpSelectedFolder = null;
  var dpTargetInput = null; // the input element that will receive the folder ID
  var dpTargetEntry = null; // the folder-entry div (to also fill the name)

  window.openDrivePicker = function(btn) {
    dpTargetEntry = btn.closest('.folder-entry');
    dpTargetInput = dpTargetEntry ? dpTargetEntry.querySelector('.folder-url') : null;
    if (!dpTargetInput) return;
    dpSelectedFolder = null;
    dpOkBtn.disabled = true;
    dpBreadcrumbTrail = [{ id: 'root', name: 'Mi Drive' }];
    dpSearchInput.value = '';
    dpOverlay.classList.add('open');
    dpLoadFolders('root');
  };

  dpCloseBtn.onclick = function() { dpOverlay.classList.remove('open'); };
  dpCancelBtn.onclick = function() { dpOverlay.classList.remove('open'); };

  // Click outside modal box to close
  dpOverlay.addEventListener('click', function(e) {
    if (e.target === dpOverlay) dpOverlay.classList.remove('open');
  });

  dpOkBtn.onclick = function() {
    if (!dpSelectedFolder || !dpTargetInput) return;
    dpTargetInput.value = dpSelectedFolder.id;
    // Auto-fill name if empty
    var nameInput = dpTargetEntry.querySelector('.folder-name');
    if (nameInput && !nameInput.value.trim()) {
      nameInput.value = dpSelectedFolder.name;
    }
    dpOverlay.classList.remove('open');
    // Show a toast confirmation
    var toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = '✓ Carpeta seleccionada: ' + dpSelectedFolder.name;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2000);
  };

  // Search with debounce
  var dpSearchTimeout = null;
  dpSearchInput.addEventListener('input', function() {
    clearTimeout(dpSearchTimeout);
    dpSearchTimeout = setTimeout(function() {
      var q = dpSearchInput.value.trim();
      if (q.length >= 2) {
        dpLoadFolders('root', q);
      } else if (q.length === 0) {
        var lastCrumb = dpBreadcrumbTrail[dpBreadcrumbTrail.length - 1];
        dpLoadFolders(lastCrumb.id);
      }
    }, 400);
  });

  async function dpLoadFolders(parentId, searchQuery) {
    dpList.innerHTML = '<div class="drive-picker-loading"><span class="dp-spinner"></span> Cargando carpetas...</div>';
    dpSelectedFolder = null;
    dpOkBtn.disabled = true;

    var url = '/api/drive/folders?parentId=' + encodeURIComponent(parentId);
    if (searchQuery) url += '&q=' + encodeURIComponent(searchQuery);

    try {
      var fetchOpts = { credentials: 'include' };
      // Send Firebase token if available
      if (window.__firebaseToken) {
        fetchOpts.headers = { 'Authorization': 'Bearer ' + window.__firebaseToken };
      }
      var res = await fetch(url, fetchOpts);
      var data = await res.json();

      if (!data.success) {
        dpList.innerHTML = '<div class="drive-picker-empty" style="color:var(--danger)">' + (data.error || 'Error al cargar carpetas') + '</div>';
        if (data.detail) {
          dpList.innerHTML += '<div style="padding:8px 20px;font-size:11px;color:var(--text-muted)">' + data.detail + '</div>';
        }
        return;
      }

      dpRenderBreadcrumb(searchQuery);
      dpRenderFolders(data.folders);
    } catch(err) {
      dpList.innerHTML = '<div class="drive-picker-empty" style="color:var(--danger)">Error de conexion: ' + err.message + '</div>';
    }
  }

  function dpRenderFolders(folders) {
    dpList.innerHTML = '';

    if (folders.length === 0) {
      dpList.innerHTML = '<div class="drive-picker-empty">No se encontraron carpetas</div>';
      return;
    }

    folders.forEach(function(folder) {
      // Skip non-folder items (safety filter in case backend returns files)
      if (folder.mimeType && folder.mimeType !== 'application/vnd.google-apps.folder') return;

      var item = document.createElement('div');
      item.className = 'drive-picker-item';

      // Folder icon
      var iconDiv = document.createElement('div');
      iconDiv.className = 'dpi-icon';
      iconDiv.innerHTML = '${IC.folder}';

      // Folder name — click to enter subfolder
      var nameDiv = document.createElement('div');
      nameDiv.className = 'dpi-name';
      nameDiv.textContent = folder.name;
      nameDiv.title = folder.name;
      nameDiv.addEventListener('click', function() {
        dpBreadcrumbTrail.push({ id: folder.id, name: folder.name });
        dpSearchInput.value = '';
        dpLoadFolders(folder.id);
      });

      // "Seleccionar" button — explicit action, works on mobile
      var actionDiv = document.createElement('div');
      actionDiv.className = 'dpi-action';
      var selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.textContent = 'Seleccionar';
      selectBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dpSelectFolder(folder, item);
      });
      actionDiv.appendChild(selectBtn);

      // Chevron — enter subfolder
      var enterDiv = document.createElement('div');
      enterDiv.className = 'dpi-enter';
      enterDiv.title = 'Entrar en esta carpeta';
      enterDiv.innerHTML = '${IC.chevronRight}';
      enterDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        dpBreadcrumbTrail.push({ id: folder.id, name: folder.name });
        dpSearchInput.value = '';
        dpLoadFolders(folder.id);
      });

      item.appendChild(iconDiv);
      item.appendChild(nameDiv);
      item.appendChild(actionDiv);
      item.appendChild(enterDiv);
      dpList.appendChild(item);
    });
  }

  function dpSelectFolder(folder, itemEl) {
    dpList.querySelectorAll('.drive-picker-item').forEach(function(el) {
      el.classList.remove('selected');
    });
    itemEl.classList.add('selected');
    dpSelectedFolder = folder;
    dpOkBtn.disabled = false;
  }

  function dpRenderBreadcrumb(searchQuery) {
    dpBreadcrumb.innerHTML = '';
    if (searchQuery) {
      var label = document.createElement('span');
      label.style.color = 'var(--text-secondary)';
      label.textContent = 'Resultados: "' + searchQuery + '"';
      dpBreadcrumb.appendChild(label);
      return;
    }
    dpBreadcrumbTrail.forEach(function(crumb, idx) {
      if (idx > 0) {
        var sep = document.createElement('span');
        sep.className = 'bc-sep';
        sep.textContent = ' / ';
        dpBreadcrumb.appendChild(sep);
      }
      var span = document.createElement('span');
      span.className = 'bc-item';
      span.textContent = crumb.name;
      var capturedIdx = idx;
      span.addEventListener('click', function() {
        dpBreadcrumbTrail = dpBreadcrumbTrail.slice(0, capturedIdx + 1);
        dpSearchInput.value = '';
        dpLoadFolders(dpBreadcrumbTrail[capturedIdx].id);
      });
      dpBreadcrumb.appendChild(span);
    });
  }
})();
</script>
</body>
</html>`;
}


// ============================================
// LOGIN PAGE
// ============================================
export function loginPage(firebaseConfig) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Iniciar sesion - Cloud Media Host</title>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<style>
${BASE_CSS}
  body {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 20px;
  }
  .login-container {
    max-width: 420px; width: 100%;
  }
  .login-logo {
    text-align: center; margin-bottom: 32px;
  }
  .login-logo svg { color: var(--accent); margin-bottom: 12px; }
  .login-logo h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
  .login-logo p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
  .login-card {
    padding: 28px;
  }
  .login-card h2 {
    font-size: 15px; font-weight: 600; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .form-group { margin-bottom: 16px; }
  .form-group label {
    display: block; font-size: 13px; font-weight: 500;
    color: var(--text-secondary); margin-bottom: 6px;
  }
  .form-group label span.icon-label { display: inline-flex; align-items: center; gap: 4px; }
  .login-error {
    background: var(--danger-subtle); color: var(--danger);
    border: 1px solid rgba(239,68,68,0.2); border-radius: var(--radius-md);
    padding: 10px 14px; font-size: 13px; margin-bottom: 16px;
    display: none;
  }
  .login-error.visible { display: block; }
  .login-success {
    background: var(--success-subtle); color: var(--success);
    border: 1px solid rgba(34,197,94,0.2); border-radius: var(--radius-md);
    padding: 10px 14px; font-size: 13px; margin-bottom: 16px;
    display: none;
  }
  .login-success.visible { display: block; }
  .login-info {
    background: var(--info-subtle); color: var(--info);
    border: 1px solid rgba(59,130,246,0.2); border-radius: var(--radius-md);
    padding: 10px 14px; font-size: 13px; margin-bottom: 16px;
    display: none;
  }
  .login-info.visible { display: block; }
  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0; color: var(--text-muted); font-size: 13px;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .google-btn {
    width: 100%; display: flex; align-items: center; justify-content: center;
    gap: 10px; padding: 12px 16px; border: 1px solid var(--border);
    border-radius: var(--radius-md); background: var(--bg-surface);
    color: var(--text-primary); font-family: var(--font); font-size: 14px;
    font-weight: 500; cursor: pointer; transition: all var(--transition);
  }
  .google-btn:hover {
    background: var(--bg-surface-2); border-color: var(--border-hover);
  }
  .google-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .toggle-link {
    text-align: center; margin-top: 16px; font-size: 13px; color: var(--text-muted);
  }
  .toggle-link a { color: var(--accent); cursor: pointer; font-weight: 500; }
  .toggle-link a:hover { color: var(--accent-hover); }
  .reset-link {
    text-align: center; margin-top: 12px; font-size: 13px; color: var(--text-muted);
  }
  .reset-link a { color: var(--accent); cursor: pointer; }
  .reset-link a:hover { color: var(--accent-hover); }
  .footer-text {
    text-align: center; margin-top: 24px; font-size: 12px; color: var(--text-muted);
  }
  .spinner {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>

<div class="login-container">
  <div class="login-logo">
    ${IC.cloud}
    <h1>Cloud Media Host</h1>
    <p>Almacenamiento gratuito sobre Google Drive + Cloudflare</p>
  </div>

  <div class="card login-card">
    <div class="login-error" id="loginError"></div>
    <div class="login-success" id="loginSuccess"></div>
    <div class="login-info" id="loginInfo"></div>

    <!-- Email/Password Form -->
    <div id="emailForm">
      <h2>
        <span style="color:var(--accent)">${IC.lock}</span>
        <span id="formTitle">Iniciar sesion</span>
      </h2>

      <div class="form-group">
        <label><span class="icon-label">${IC.search} Correo electronico</span></label>
        <input type="text" id="emailInput" placeholder="tu@correo.com" autocomplete="email">
      </div>

      <div class="form-group">
        <label><span class="icon-label">${IC.lock} Contrasena</span></label>
        <input type="password" id="passwordInput" placeholder="Tu contrasena" autocomplete="${'current-password'}">
      </div>

      <button class="btn btn-primary btn-block" id="emailSubmitBtn" type="button">
        <span id="emailSubmitText">Iniciar sesion</span>
      </button>

      <div class="toggle-link" id="toggleSection">
        <span id="toggleText">No tienes cuenta?</span> <a id="toggleLink">Crear cuenta</a>
      </div>

      <div class="reset-link" id="resetSection">
        <a id="resetLink">Olvidaste tu contrasena?</a>
      </div>
    </div>

    <!-- Password Reset Form -->
    <div id="resetForm" style="display:none">
      <h2>
        <span style="color:var(--accent)">${IC.lock}</span>
        Restablecer contrasena
      </h2>

      <div class="form-group">
        <label><span class="icon-label">${IC.search} Correo electronico</span></label>
        <input type="text" id="resetEmailInput" placeholder="tu@correo.com" autocomplete="email">
      </div>

      <button class="btn btn-primary btn-block" id="resetSubmitBtn" type="button">
        <span id="resetSubmitText">Enviar enlace de restablecimiento</span>
      </button>

      <div class="toggle-link">
        <a id="backToLoginLink">Volver a iniciar sesion</a>
      </div>
    </div>

    <!-- Divider -->
    <div class="divider">o continua con</div>

    <!-- Google Sign-In -->
    <button class="google-btn" id="googleSignInBtn" type="button">
      <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      Iniciar sesion con Google
    </button>
  </div>

  <div class="footer-text">
    powered by Firebase Auth
  </div>
</div>

<script>
(function() {
  // Initialize Firebase with config from server
  var firebaseConfig = ${JSON.stringify(firebaseConfig)};
  if (!firebaseConfig.apiKey) {
    document.getElementById('loginError').textContent = 'Firebase no esta configurado. Agrega FIREBASE_PROJECT_ID y FIREBASE_API_KEY en wrangler.toml.';
    document.getElementById('loginError').classList.add('visible');
    return;
  }

  firebase.initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket || '',
    messagingSenderId: firebaseConfig.messagingSenderId || '',
    appId: firebaseConfig.appId || ''
  });

  var auth = firebase.auth();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  // Flag to prevent double redirects (signInWithPopup + onAuthStateChanged race)
  var _redirecting = false;

  // Helper: set session cookie and redirect
  function setSessionAndRedirect(user) {
    if (_redirecting) return;
    _redirecting = true;

    // Get token with 8-second timeout to prevent infinite loading
    var tokenPromise = user.getIdToken(true);
    var timeoutPromise = new Promise(function(_, reject) {
      setTimeout(function() { reject(new Error('Timeout obteniendo token de Firebase')); }, 8000);
    });

    Promise.race([tokenPromise, timeoutPromise]).then(function(token) {
      document.cookie = '__session=' + token + '; path=/; max-age=3600; SameSite=Lax';
      window.location.replace('/');
    }).catch(function(err) {
      _redirecting = false;
      console.error('Auth redirect error:', err);
      setLoading(googleSignInBtn, googleSignInBtn, false);
      setLoading(emailSubmitBtn, emailSubmitText, false);
      showError('Error al completar la autenticacion (' + err.message + '). Intenta de nuevo.');
    });
  }

  // Check if already logged in (only on initial state change)
  auth.onAuthStateChanged(function(user) {
    if (user && !_redirecting) {
      setSessionAndRedirect(user);
    }
  });

  // DOM elements
  var emailInput = document.getElementById('emailInput');
  var passwordInput = document.getElementById('passwordInput');
  var emailSubmitBtn = document.getElementById('emailSubmitBtn');
  var emailSubmitText = document.getElementById('emailSubmitText');
  var formTitle = document.getElementById('formTitle');
  var toggleText = document.getElementById('toggleText');
  var toggleLink = document.getElementById('toggleLink');
  var resetLink = document.getElementById('resetLink');
  var resetSection = document.getElementById('resetSection');
  var resetForm = document.getElementById('resetForm');
  var emailForm = document.getElementById('emailForm');
  var resetEmailInput = document.getElementById('resetEmailInput');
  var resetSubmitBtn = document.getElementById('resetSubmitBtn');
  var resetSubmitText = document.getElementById('resetSubmitText');
  var backToLoginLink = document.getElementById('backToLoginLink');
  var googleSignInBtn = document.getElementById('googleSignInBtn');
  var loginError = document.getElementById('loginError');
  var loginSuccess = document.getElementById('loginSuccess');
  var loginInfo = document.getElementById('loginInfo');

  var isSignUp = false;

  function showError(msg) {
    loginError.textContent = msg;
    loginError.classList.add('visible');
    loginSuccess.classList.remove('visible');
    loginInfo.classList.remove('visible');
  }
  function showSuccess(msg) {
    loginSuccess.textContent = msg;
    loginSuccess.classList.add('visible');
    loginError.classList.remove('visible');
    loginInfo.classList.remove('visible');
  }
  function showInfo(msg) {
    loginInfo.textContent = msg;
    loginInfo.classList.add('visible');
    loginError.classList.remove('visible');
    loginSuccess.classList.remove('visible');
  }
  function clearMessages() {
    loginError.classList.remove('visible');
    loginSuccess.classList.remove('visible');
    loginInfo.classList.remove('visible');
  }
  function setLoading(btn, textEl, loading) {
    if (loading) {
      btn.disabled = true;
      textEl.innerHTML = '<span class="spinner"></span> Cargando...';
    } else {
      btn.disabled = false;
    }
  }

  // Toggle between Sign In and Sign Up
  toggleLink.addEventListener('click', function() {
    isSignUp = !isSignUp;
    clearMessages();
    if (isSignUp) {
      formTitle.textContent = 'Crear cuenta';
      emailSubmitText.textContent = 'Crear cuenta';
      toggleText.textContent = 'Ya tienes cuenta?';
      toggleLink.textContent = 'Iniciar sesion';
      resetSection.style.display = 'none';
    } else {
      formTitle.textContent = 'Iniciar sesion';
      emailSubmitText.textContent = 'Iniciar sesion';
      toggleText.textContent = 'No tienes cuenta?';
      toggleLink.textContent = 'Crear cuenta';
      resetSection.style.display = '';
    }
  });

  // Email/Password submit
  emailSubmitBtn.addEventListener('click', function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value;

    if (!email) { showError('Ingresa tu correo electronico.'); return; }
    if (!password) { showError('Ingresa tu contrasena.'); return; }
    if (password.length < 6) { showError('La contrasena debe tener al menos 6 caracteres.'); return; }

    clearMessages();
    setLoading(emailSubmitBtn, emailSubmitText, true);

    var promise;
    if (isSignUp) {
      promise = auth.createUserWithEmailAndPassword(email, password);
    } else {
      promise = auth.signInWithEmailAndPassword(email, password);
    }

    promise.then(function(result) {
      // Set cookie and redirect (onAuthStateChanged will also fire but this ensures cookie is set)
      if (result.user) setSessionAndRedirect(result.user);
    }).catch(function(e) {
      setLoading(emailSubmitBtn, emailSubmitText, false);
      var code = e.code || '';
      if (code === 'auth/user-not-found') showError('No existe una cuenta con este correo.');
      else if (code === 'auth/wrong-password') showError('Contrasena incorrecta.');
      else if (code === 'auth/email-already-in-use') showError('Este correo ya esta registrado. Intenta iniciar sesion.');
      else if (code === 'auth/weak-password') showError('La contrasena es muy debil (minimo 6 caracteres).');
      else if (code === 'auth/invalid-email') showError('Correo electronico invalido.');
      else if (code === 'auth/too-many-requests') showError('Demasiados intentos. Intenta de nuevo mas tarde.');
      else if (code === 'auth/invalid-credential') showError('Correo o contrasena incorrectos.');
      else showError('Error: ' + e.message);
    });
  });

  // Password reset
  resetLink.addEventListener('click', function() {
    emailForm.style.display = 'none';
    resetForm.style.display = 'block';
    if (emailInput.value) resetEmailInput.value = emailInput.value;
    clearMessages();
  });

  backToLoginLink.addEventListener('click', function() {
    resetForm.style.display = 'none';
    emailForm.style.display = 'block';
    clearMessages();
  });

  resetSubmitBtn.addEventListener('click', function() {
    var email = resetEmailInput.value.trim();
    if (!email) { showError('Ingresa tu correo electronico.'); return; }
    clearMessages();
    setLoading(resetSubmitBtn, resetSubmitText, true);

    auth.sendPasswordResetEmail(email).then(function() {
      setLoading(resetSubmitBtn, resetSubmitText, false);
      showSuccess('Se envio un enlace de restablecimiento a ' + email + '. Revisa tu bandeja de entrada.');
    }).catch(function(e) {
      setLoading(resetSubmitBtn, resetSubmitText, false);
      var code = e.code || '';
      if (code === 'auth/user-not-found') showError('No existe una cuenta con este correo.');
      else if (code === 'auth/invalid-email') showError('Correo electronico invalido.');
      else if (code === 'auth/too-many-requests') showError('Demasiados intentos. Intenta de nuevo mas tarde.');
      else showError('Error: ' + e.message);
    });
  });

  // Google Sign-In
  googleSignInBtn.addEventListener('click', function() {
    clearMessages();
    setLoading(googleSignInBtn, googleSignInBtn, true);

    var provider = new firebase.auth.GoogleAuthProvider();
    // NO Drive scope here — Firebase Auth is for identity only.
    // Drive permissions are handled separately via /api/auth (Google OAuth2).

    auth.signInWithPopup(provider).then(function(result) {
      // Store Google access token for Drive uploads
      if (result.credential && result.credential.accessToken) {
        window.__googleAccessToken = result.credential.accessToken;
      }
      if (result.additionalUserInfo && result.additionalUserInfo.profile) {
        window.__googleUserEmail = result.additionalUserInfo.profile.email;
        window.__googleUserName = result.additionalUserInfo.profile.name;
      }
      // Set cookie and redirect
      if (result.user) setSessionAndRedirect(result.user);
    }).catch(function(e) {
      setLoading(googleSignInBtn, googleSignInBtn, false);
      if (e.code === 'auth/popup-closed-by-user') return;
      if (e.code === 'auth/cancelled-popup-request') return;
      if (e.code === 'auth/popup-blocked') showError('El popup fue bloqueado por el navegador. Permite popups para este sitio.');
      else showError('Error al iniciar sesion con Google: ' + e.message);
    });
  });

  // Allow Enter key to submit
  passwordInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') emailSubmitBtn.click();
  });
  emailInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') passwordInput.focus();
  });
  resetEmailInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') resetSubmitBtn.click();
  });
})();
</script>
</body>
</html>`;
}


// ============================================
// DASHBOARD
// ============================================
export function dashboardPage(config, files = [], folders = [], authState) {
  authState = authState || { firebaseConfigured: false, user: null };
  const hasCloudinary = !!config.cloudinary_cloud_name;

  // Build folder list items JSON for JS
  const foldersJson = JSON.stringify(folders.map(f => ({ id: f.id, name: f.name, file_count: f.file_count || 0 })));
  // Build files JSON with folder_id for client-side filtering
  const filesJson = JSON.stringify(files.map(f => ({ ...f })));

  const fileListHtml = files.length === 0
    ? `<div class="empty-state" id="emptyState">
        <div class="empty-icon">${IC.upload}</div>
        <p style="color:var(--text-secondary);font-size:15px;font-weight:500">Sin archivos</p>
        <p style="color:var(--text-muted);font-size:13px;margin-top:4px">Arrastra archivos al area de arriba o haz click para seleccionar</p>
      </div>`
    : files.map(f => `
      <div class="file-row" data-id="${f.id}" data-folder="${f.folder_id||''}">
        <div class="file-icon-wrap type-${(f.type_display||'').toLowerCase()}">
          ${fileIconByType(f.type)}
        </div>
        <div class="file-info">
          <div class="file-name">${escapeHtml(f.name)}</div>
          <div class="file-meta">${f.size_display||'?'} &middot; ${(f.type_display||'?').toLowerCase()} &middot; ${f.created_at ? new Date(f.created_at).toLocaleDateString('es') : (f.date_display||'?')}</div>
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
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
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

  .docs-promo {
    display: flex; align-items: center; gap: 20px;
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 24px;
  }
  .docs-promo-text { flex: 1; }
  @media (max-width: 640px) { .docs-promo { flex-direction: column; text-align: center; } .docs-promo .btn { width: 100%; } }

  /* Folder tabs */
  .folder-section { margin-bottom: 24px; }
  .folder-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px;
  }
  .folder-header h2 { font-size: 14px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
  .folder-tabs {
    display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;
    scrollbar-width: none;
  }
  .folder-tabs::-webkit-scrollbar { display: none; }
  .folder-tab {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 9999px;
    font-size: 13px; font-weight: 500;
    background: var(--bg-surface); color: var(--text-secondary);
    border: 1px solid var(--border);
    cursor: pointer; transition: all var(--transition);
    white-space: nowrap; flex-shrink: 0;
    font-family: var(--font);
  }
  .folder-tab:hover { background: var(--bg-surface-2); color: var(--text-primary); border-color: var(--border-hover); }
  .folder-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .folder-tab .folder-count {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 5px;
    border-radius: 9999px; font-size: 11px; font-weight: 600;
    background: rgba(255,255,255,0.15);
  }
  .folder-tab:not(.active) .folder-count { background: var(--bg-surface-2); color: var(--text-muted); }
  .folder-tab .folder-delete {
    display: none; margin-left: 2px; color: rgba(255,255,255,0.7);
    background: none; border: none; cursor: pointer; padding: 0;
    line-height: 1; font-size: 14px;
  }
  .folder-tab:hover .folder-delete { display: inline; }
  .folder-tab.active .folder-delete { color: rgba(255,255,255,0.8); }
  .folder-tab .folder-delete:hover { color: #fff; }
  .create-folder-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: var(--radius-sm);
    background: var(--bg-surface); border: 1px solid var(--border);
    color: var(--text-muted); cursor: pointer;
    transition: all var(--transition);
  }
  .create-folder-btn:hover { background: var(--accent-subtle); color: var(--accent); border-color: var(--accent); }
  .folder-create-inline {
    display: none; align-items: center; gap: 8px; margin-top: 8px;
  }
  .folder-create-inline.visible { display: flex; }
  .folder-create-inline input {
    flex: 1; padding: 8px 12px; font-size: 13px;
  }
  .folder-create-inline .btn { padding: 8px 12px; font-size: 13px; }
  .folder-active-label {
    display: none; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: var(--radius-md);
    background: var(--accent-subtle); color: var(--accent);
    font-size: 13px; font-weight: 500; margin-bottom: 16px;
    border: 1px solid rgba(249,115,22,0.2);
  }
  .folder-active-label.visible { display: inline-flex; }
  .folder-active-label button {
    background: none; border: none; color: var(--accent);
    cursor: pointer; padding: 0 0 0 4px; display: flex;
  }
</style>
</head>
<body>

<div id="firebase-auth-bar" style="display:none">
  <div id="firebase-auth-user" style="display:flex;align-items:center;gap:10px;padding:12px 20px;background:var(--bg-surface);border-bottom:1px solid var(--border)">
    <img id="firebase-user-avatar" src="" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover">
    <div style="flex:1">
      <div id="firebase-user-name" style="font-size:14px;font-weight:600;color:var(--text-primary)"></div>
      <div id="firebase-user-email" style="font-size:12px;color:var(--text-muted)"></div>
    </div>
    <button id="firebase-signout-btn" class="btn btn-ghost" style="font-size:12px;padding:6px 12px">Cerrar sesion</button>
  </div>
</div>

<script>
(function() {
  // Check Firebase auth config
  fetch('/api/auth/firebase-config').then(r => r.json()).then(function(cfg) {
    if (!cfg.firebase_enabled) return;
    
    // Initialize Firebase
    firebase.initializeApp({
      apiKey: cfg.api_key,
      authDomain: cfg.auth_domain,
      projectId: cfg.project_id
    });
    
    var auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    var authBar = document.getElementById('firebase-auth-bar');
    var authUser = document.getElementById('firebase-auth-user');
    var signoutBtn = document.getElementById('firebase-signout-btn');
    
    function showSignedIn(user) {
      authBar.style.display = 'block';
      document.getElementById('firebase-user-avatar').src = user.photoURL || 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%233F3F46" width="40" height="40"/><text x="50%" y="54%" text-anchor="middle" fill="white" font-size="18" font-family="sans-serif">' + (user.displayName || user.email || '?')[0].toUpperCase() + '</text></svg>');
      document.getElementById('firebase-user-name').textContent = user.displayName || 'Usuario';
      document.getElementById('firebase-user-email').textContent = user.email || '';
      // Store token for API calls
      user.getIdToken().then(function(token) {
        window.__firebaseToken = token;
        // Dispatch event for other scripts to react
        window.dispatchEvent(new CustomEvent('firebase-auth', { detail: { user: user, token: token } }));
      });
    }
    
    function showSignedOut() {
      authBar.style.display = 'none';
      window.__firebaseToken = null;
    }
    
    auth.onAuthStateChanged(function(user) {
      if (user) { showSignedIn(user); } 
      else { showSignedOut(); }
    });
    
    signoutBtn.addEventListener('click', function() {
      document.cookie = '__session=; path=/; max-age=0';
      auth.signOut().then(function() { location.href = '/'; });
    });
    
    // Expose auth for use by other page scripts
    window.__firebaseAuth = auth;
  });
})();
</script>

<div class="app-header">
  <div class="app-logo">
    ${IC.cloud}
    <span>Cloud Media Host</span>
  </div>
  <div class="app-nav">
    <div class="service-chip"><span class="dot"></span> Drive</div>
    ${hasCloudinary ? '<div class="service-chip"><span class="dot"></span> CDN</div>' : ''}
    <div class="nav-sep"></div>
    <a href="/setup" class="btn-icon-only" title="Configuracion" style="text-decoration:none">${IC.settings}</a>
    <button class="btn-icon-only" onclick="openModal('adminModal')" title="Admin">${IC.lock}</button>
    <a href="/api/docs" target="_blank" class="btn-icon-only" title="API Docs">${IC.book}</a>
  </div>
</div>

<main class="app-main">
  <div class="upload-zone" id="dropZone">
    <div class="uz-icon">${IC.upload}</div>
    <p>Suelta archivos o carpetas aqui o haz click para seleccionar</p>
    <p class="uz-hint">MP3 &middot; MP4 &middot; ZIP &middot; PNG &middot; JPG &middot; Carpetas</p>
    <input type="file" id="fileInput" multiple style="display:none">
    <input type="file" id="folderInput" webkitdirectory multiple style="display:none">
    <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
      <button type="button" class="btn btn-ghost" onclick="openFilePicker()" style="font-size:12px;padding:6px 12px">Seleccionar archivos</button>
      <button type="button" class="btn btn-primary" onclick="openFolderPicker()" style="font-size:12px;padding:6px 12px">Seleccionar carpeta</button>
    </div>
  </div>

  <div class="progress-wrap" id="progressWrap">
    <div class="progress-label" id="progressLabel">Subiendo...</div>
    <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
  </div>

  <!-- Folders Section -->
  <div class="folder-section">
    <div class="folder-header">
      <h2>Carpetas</h2>
      <button class="create-folder-btn" onclick="toggleCreateFolder()" title="Nueva carpeta">${IC.folderPlus}</button>
    </div>
    <div class="folder-create-inline" id="createFolderInline">
      <input type="text" id="newFolderName" placeholder="Nombre de la carpeta..." maxlength="100" onkeydown="if(event.key==='Enter')createNewFolder()">
      <button class="btn btn-primary" onclick="createNewFolder()" style="flex-shrink:0">${IC.check} Crear</button>
      <button class="btn btn-ghost" onclick="toggleCreateFolder()" style="flex-shrink:0">${IC.x}</button>
    </div>
    <div class="folder-tabs" id="folderTabs">
      <button class="folder-tab active" data-folder="" onclick="selectFolder(this, '')">
        ${IC.cloud} Todos <span class="folder-count" id="countAll">${files.length}</span>
      </button>
      <button class="folder-tab" data-folder="__root__" onclick="selectFolder(this, '__root__')">
        ${IC.hardDrive} Root <span class="folder-count" id="countRoot">0</span>
      </button>
    </div>
    <div class="folder-active-label" id="folderActiveLabel">
      <span id="folderActiveIcon">${IC.folder}</span>
      <span id="folderActiveName">Carpeta</span>
      <button onclick="selectFolder(document.querySelector('.folder-tab[data-folder=\\"\\"]'), '')" title="Volver a todos">${IC.x}</button>
    </div>
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

  <div class="docs-promo" style="margin-top:32px">
    <div class="docs-promo-text">
      <div style="font-size:16px;font-weight:600;margin-bottom:4px">API para desarrolladores</div>
      <div style="font-size:13px;color:var(--text-muted);line-height:1.6">Conecta esta plataforma con tu app en Node.js, Python, Java o cualquier lenguaje. Sube, lista, descarga y elimina archivos via REST API. Documentacion completa con ejemplos de codigo.</div>
    </div>
    <a href="/api/docs" class="btn btn-primary" style="flex-shrink:0">
      ${IC.book} Ver documentacion
    </a>
  </div>
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
      ${config.admin_password_hash ? `
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
        Admin: ${config.admin_password_hash?'<span style="color:var(--success)">Protegido</span>':'<span style="color:var(--text-muted)">Sin proteccion</span>'}
      </div>
    </div>
  </div>
</div>

<div class="toast-container" id="toastContainer"></div>

<script>
// ============ STATE ============
const ALL_FILES = ${filesJson};
const ALL_FOLDERS = ${foldersJson};
let currentFolder = '';

// ============ INIT ============
(function init() {
  // Render folder tabs
  renderFolderTabs();
  // Update root count
  const rootCount = ALL_FILES.filter(f => !f.folder_id).length;
  const el = document.getElementById('countRoot');
  if (el) el.textContent = rootCount;
  // Restore admin password
  const saved = localStorage.getItem('cmh_admin');
  if (saved) { const p = document.getElementById('adminPass'); if(p) p.value = saved; }
})();

function renderFolderTabs() {
  const container = document.getElementById('folderTabs');
  ALL_FOLDERS.forEach(f => {
    const tab = document.createElement('button');
    tab.className = 'folder-tab';
    tab.dataset.folder = f.id;
    tab.innerHTML = '${IC.folder} ' + escapeHtml(f.name) + ' <span class="folder-count">' + f.file_count + '</span><span class="folder-delete" onclick="event.stopPropagation();deleteFolderApi(\\'' + f.id + '\\',\\'' + escapeHtml(f.name).replace(/'/g, \"\\\\'\") + '\\')" title="Eliminar carpeta">&times;</span>';
    tab.addEventListener('click', function() { selectFolder(this, f.id); });
    container.appendChild(tab);
  });
}

// ============ FOLDERS ============
function toggleCreateFolder() {
  const el = document.getElementById('createFolderInline');
  el.classList.toggle('visible');
  if (el.classList.contains('visible')) {
    document.getElementById('newFolderName').focus();
  }
}

async function createNewFolder() {
  const input = document.getElementById('newFolderName');
  const name = input.value.trim();
  if (!name) { toast('El nombre es obligatorio', 'error'); return; }

  try {
    const r = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const d = await r.json();
    if (d.success) {
      toast('Carpeta "' + name + '" creada', 'success');
      input.value = '';
      document.getElementById('createFolderInline').classList.remove('visible');
      setTimeout(() => location.reload(), 600);
    } else {
      toast(d.error || 'Error al crear carpeta', 'error');
    }
  } catch(e) {
    toast('Error de conexion', 'error');
  }
}

async function deleteFolderApi(id, name) {
  if (!confirm('Eliminar la carpeta "' + name + '" y todos sus archivos?')) return;
  const p = document.getElementById('adminPass');
  const h = {};
  if (p && p.value) { h['X-Admin-Key'] = p.value; }
  try {
    const r = await fetch('/api/folders/' + id, { method: 'DELETE', headers: h });
    const d = await r.json();
    if (d.success) {
      toast(d.message, 'success');
      setTimeout(() => location.reload(), 600);
    } else {
      toast(d.error || 'Error', 'error');
    }
  } catch(e) { toast('Error de conexion', 'error'); }
}

function selectFolder(tab, folderId) {
  currentFolder = folderId;
  document.querySelectorAll('.folder-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  const label = document.getElementById('folderActiveLabel');
  const activeName = document.getElementById('folderActiveName');

  if (folderId === '' || folderId === '__root__') {
    label.classList.remove('visible');
  } else {
    const folder = ALL_FOLDERS.find(f => f.id === folderId);
    if (folder) {
      activeName.textContent = folder.name;
      label.classList.add('visible');
    }
  }

  filterFilesByFolder();
}

function filterFilesByFolder() {
  const rows = document.querySelectorAll('.file-row');
  let visibleCount = 0;

  rows.forEach(r => {
    const fileFolder = r.dataset.folder || '';
    let show = false;

    if (currentFolder === '') {
      show = true; // "Todos" — show all
    } else if (currentFolder === '__root__') {
      show = !fileFolder; // "Root" — show files without folder
    } else {
      show = fileFolder === currentFolder;
    }

    r.style.display = show ? 'flex' : 'none';
    if (show) visibleCount++;
  });

  // Show/hide empty state
  const empty = document.getElementById('emptyState');
  if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
}

// ============ UPLOAD ============
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const folderInput = document.getElementById('folderInput');

// File picker: open file selector (shows all files, no restrictions)
function openFilePicker() {
  fileInput.value = '';
  fileInput.click();
}

// Folder picker: always use webkitdirectory input (most compatible across browsers)
// This opens a native file dialog where you select a FOLDER, then click OK/Upload
async function openFolderPicker() {
  // Try File System Access API first (Chrome 86+) — shows proper folder picker with OK button
  if (window.showDirectoryPicker) {
    try {
      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      const files = [];
      await collectFilesFromHandle(dirHandle, files, '');
      if (files.length > 0) {
        uploadFiles(files);
      } else {
        toast('La carpeta seleccionada esta vacia', 'error');
      }
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
      // If showDirectoryPicker fails for any reason, fall through to webkitdirectory
      console.warn('showDirectoryPicker failed, using fallback:', e.message);
    }
  }
  // Fallback: webkitdirectory input — browser opens file dialog, user selects folder and clicks Upload/OK
  folderInput.value = '';
  folderInput.click();
}

// Recursively collect all files from a FileSystemDirectoryHandle
async function collectFilesFromHandle(dirHandle, fileList, path) {
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'file') {
      try {
        const file = await handle.getFile();
        // Attach relative path info
        Object.defineProperty(file, 'webkitRelativePath', {
          value: path ? path + '/' + name : name,
          writable: false
        });
        fileList.push(file);
      } catch (e) {
        console.warn('Could not read file:', name, e);
      }
    } else if (handle.kind === 'directory') {
      await collectFilesFromHandle(handle, fileList, path ? path + '/' + name : name);
    }
  }
}

// Click on dropzone opens file input (not folder)
dropZone.addEventListener('click', (e) => {
  // Don't trigger if clicking on buttons inside the dropzone
  if (e.target.tagName === 'BUTTON') return;
  fileInput.click();
});

// Drag & drop: support files AND folders
dropZone.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', e => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('dragover'); });
dropZone.addEventListener('drop', async e => {
  e.preventDefault(); e.stopPropagation();
  dropZone.classList.remove('dragover');
  
  // Try to use DataTransferItem.webkitGetAsEntry for folder support
  const items = e.dataTransfer.items;
  if (items && items.length > 0) {
    const files = [];
    const entries = [];
    
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
      if (entry) {
        entries.push(entry);
      } else if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }
    
    if (entries.length > 0) {
      // Process entries (may include folders)
      for (const entry of entries) {
        await readEntry(entry, files, '');
      }
    }
    
    if (files.length > 0) {
      uploadFiles(files);
    }
  } else if (e.dataTransfer.files.length) {
    uploadFiles(e.dataTransfer.files);
  }
});

// Recursively read FileSystemEntry (file or folder) from drag & drop
function readEntry(entry, fileList, path) {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file(file => {
        Object.defineProperty(file, 'webkitRelativePath', {
          value: path ? path + '/' + file.name : file.name,
          writable: false
        });
        fileList.push(file);
        resolve();
      }, () => resolve());
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const readBatch = () => {
        reader.readEntries(async (entries) => {
          if (entries.length === 0) {
            resolve();
            return;
          }
          const promises = entries.map(e => readEntry(e, fileList, path ? path + '/' + entry.name : entry.name));
          await Promise.all(promises);
          // readEntries may not return all entries in one call; read more
          readBatch();
        }, () => resolve());
      };
      readBatch();
    } else {
      resolve();
    }
  });
}

fileInput.addEventListener('change', () => { if(fileInput.files.length) uploadFiles(fileInput.files); });
folderInput.addEventListener('change', () => { if(folderInput.files.length) uploadFiles(folderInput.files); });

function uploadFiles(files) {
  const pw = document.getElementById('progressWrap');
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  pw.classList.add('active');

  let fileIndex = 0;
  let loaded = 0;
  let total = 0;

  function uploadNext() {
    if (fileIndex >= files.length) {
      label.textContent = 'Completado';
      fill.style.width = '100%';
      setTimeout(() => location.reload(), 4000);
      return;
    }

    const file = files[fileIndex];
    const fd = new FormData();
    fd.append('file', file);

    // If a specific folder is selected (not "Todos" or "Root"), send folder_id
    let uploadUrl = '/api/upload';
    if (currentFolder && currentFolder !== '__root__') {
      fd.append('folder_id', currentFolder);
    }

    label.textContent = 'Subiendo ' + file.name + ' (' + (fileIndex + 1) + '/' + files.length + ')';
    loaded = 0;
    total = file.size;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    xhr.withCredentials = true;

    // Send Google OAuth access token if available (from Firebase Auth + Google Sign-In)
    if (window.__googleAccessToken) {
      xhr.setRequestHeader('X-Google-Access-Token', window.__googleAccessToken);
    }
    // Also send Firebase ID token for admin verification
    if (window.__firebaseToken) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + window.__firebaseToken);
    }

    xhr.upload.addEventListener('progress', function(e) {
      if (e.lengthComputable) {
        loaded = e.loaded;
        total = e.total;
        const pct = Math.round((e.loaded / e.total) * 100);
        fill.style.width = pct + '%';
        label.textContent = 'Subiendo ' + file.name + ' — ' + pct + '%';
      }
    });

    xhr.addEventListener('load', function() {
      if (xhr.status >= 400) {
        // Server returned an error
        let errMsg = 'Error al subir ' + file.name + ' (HTTP ' + xhr.status + ')';
        let detailMsg = null;
        try {
          const d = JSON.parse(xhr.responseText);
          if (d.error) errMsg = d.error;
          if (d.detail) detailMsg = d.detail;
        } catch(e) {
          if (xhr.responseText) errMsg = xhr.responseText.substring(0, 200);
        }
        console.error('Upload FAILED:', errMsg, detailMsg || '');
        toast(errMsg, 'error');
        // Show detailed error as a second toast (e.g. file type lock explanation)
        if (detailMsg) {
          setTimeout(() => {
            // Create a longer-lasting detail toast
            var detailToast = document.createElement('div');
            detailToast.className = 'toast error';
            detailToast.style.maxWidth = '420px';
            detailToast.style.whiteSpace = 'normal';
            detailToast.style.lineHeight = '1.5';
            detailToast.textContent = detailMsg;
            document.body.appendChild(detailToast);
            setTimeout(function() { detailToast.remove(); }, 8000);
          }, 500);
        }
        fill.style.background = 'var(--danger)';
        label.textContent = 'Error: ' + errMsg;
        setTimeout(() => { fill.style.background = 'var(--accent)'; }, 3000);
      } else {
        try {
          const d = JSON.parse(xhr.responseText);
          if (d.success && d.file) {
            console.log('Upload OK:', d.file.name, '->', d.file.id);
          } else {
            var upErr = d.error || 'Error al subir (respuesta sin success)';
            console.error('Upload FAILED (no success):', upErr);
            toast(upErr, 'error');
            fill.style.background = 'var(--danger)';
            label.textContent = 'Error: ' + upErr;
            setTimeout(() => { fill.style.background = 'var(--accent)'; }, 3000);
          }
        } catch(e) {
          console.error('Respuesta inesperada del servidor:', xhr.responseText);
          toast('Error de respuesta del servidor', 'error');
          fill.style.background = 'var(--danger)';
          label.textContent = 'Error de respuesta del servidor';
          setTimeout(() => { fill.style.background = 'var(--accent)'; }, 3000);
        }
      }
      fileIndex++;
      uploadNext();
    });

    xhr.addEventListener('error', function() {
      toast('Error de red subiendo ' + file.name, 'error');
      fill.style.background = 'var(--danger)';
      setTimeout(() => { fill.style.background = 'var(--accent)'; }, 1500);
      fileIndex++;
      uploadNext();
    });

    xhr.send(fd);
  }

  uploadNext();
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
// API DOCS (MULTI-LANGUAGE)
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
  .docs { max-width: 800px; margin: 0 auto; padding: 32px 24px 64px; }
  .docs-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
  .docs-header h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
  .docs-header .subtitle { color: var(--text-muted); font-size: 14px; }
  .docs-header .subtitle code { color: var(--accent); }

  .lang-switcher { display: flex; gap: 2px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 3px; }
  .lang-btn {
    padding: 6px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500;
    border: none; background: transparent; color: var(--text-muted); cursor: pointer;
    transition: all var(--transition); font-family: var(--font);
  }
  .lang-btn.active { background: var(--accent); color: #fff; }
  .lang-btn:hover:not(.active) { color: var(--text-primary); }

  .docs h2 { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin: 36px 0 16px; }

  .endpoint { margin-bottom: 20px; }
  .endpoint-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
  .endpoint-head { display: flex; align-items: center; gap: 10px; padding: 14px 16px; cursor: pointer; }
  .endpoint-head:hover { background: var(--bg-surface-2); }
  .method-badge { padding: 3px 8px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0; }
  .m-get { background: var(--success-subtle); color: var(--success); }
  .m-post { background: var(--info-subtle); color: var(--info); }
  .m-delete { background: var(--danger-subtle); color: var(--danger); }
  .endpoint-path { font-family: 'SF Mono','Fira Code',monospace; font-size: 13px; color: var(--text-primary); }
  .endpoint-desc { font-size: 13px; color: var(--text-muted); flex: 1; text-align: right; }
  .endpoint-body { padding: 0 16px 16px; }
  .endpoint-body p { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 10px; }
  pre { background: var(--bg-root); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; overflow-x: auto; font-size: 12px; line-height: 1.7; margin: 8px 0; }
  code { font-family: 'SF Mono','Fira Code',monospace; font-size: 12px; }
  pre code { color: var(--text-secondary); }
  .kw { color: var(--info); }
  .str { color: var(--success); }
  .cmt { color: var(--text-muted); }
  .docs a { color: var(--accent); }

  .example-tabs { display: flex; gap: 2px; margin-bottom: 12px; }
  .example-tab {
    padding: 5px 12px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600;
    border: 1px solid var(--border); background: transparent; color: var(--text-muted);
    cursor: pointer; transition: all var(--transition); font-family: var(--font);
  }
  .example-tab.active { background: var(--bg-surface-2); color: var(--text-primary); border-color: var(--border-hover); }
  .example-panel { display: none; }
  .example-panel.active { display: block; }

  .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); margin-bottom: 24px; cursor: pointer; transition: color var(--transition); }
  .back-link:hover { color: var(--text-primary); }

  .note-box { background: var(--accent-subtle); border: 1px solid rgba(249,115,22,0.2); border-radius: var(--radius-md); padding: 14px 16px; margin: 16px 0; font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
  .note-box strong { color: var(--accent); }

  @media (max-width: 640px) {
    .docs-header { flex-direction: column; }
    .endpoint-desc { display: none; }
    .endpoint-head { flex-wrap: wrap; }
  }
</style>
</head>
<body>
<div class="docs">
  <a href="/" class="back-link">${IC.chevronLeft} Back to dashboard</a>

  <div class="docs-header">
    <div>
      <h1 id="t-title">API Reference</h1>
      <p class="subtitle" id="t-subtitle">Base URL: <code>${baseUrl}</code></p>
    </div>
    <div class="lang-switcher">
      <button class="lang-btn active" onclick="setLang('es')">Español</button>
      <button class="lang-btn" onclick="setLang('en')">English</button>
      <button class="lang-btn" onclick="setLang('pt')">Português</button>
    </div>
  </div>

  <div class="note-box" id="t-note">
    <strong>Nota:</strong> Todos los endpoints responden en JSON. Para solicitudes desde navegador, la raíz <code>/</code> devuelve HTML. Agrega <code>Accept: application/json</code> para forzar JSON.
  </div>

  <h2 id="t-h-config">Configuración</h2>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-get">GET</span>
        <span class="endpoint-path">/api/status</span>
        <span class="endpoint-desc" id="t-status-desc">Estado del sistema</span>
      </div>
      <div class="endpoint-body">
        <pre><code>GET /api/status
<span class="cmt">// Response</span>
{
  <span class="str">"configured"</span>: <span class="kw">true</span>,
  <span class="str">"services"</span>: { <span class="str">"drive"</span>: <span class="kw">true</span>, <span class="str">"cloudinary"</span>: <span class="kw">false</span> },
  <span class="str">"file_count"</span>: <span class="kw">5</span>,
  <span class="str">"has_admin_password"</span>: <span class="kw">true</span>
}</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-post">POST</span>
        <span class="endpoint-path">/api/config</span>
        <span class="endpoint-desc" id="t-config-desc">Guardar credenciales</span>
      </div>
      <div class="endpoint-body">
        <pre><code>POST /api/config
Content-Type: application/json
<span class="cmt">// Header si ya hay config: X-Admin-Key: tu_password</span>

{
  <span class="str">"drive_credentials"</span>: {
    <span class="str">"type"</span>: <span class="str">"service_account"</span>,
    <span class="str">"client_email"</span>: <span class="str">"xxx@xxx.iam.gserviceaccount.com"</span>,
    <span class="str">"private_key"</span>: <span class="str">"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"</span>
  },
  <span class="str">"drive_folder_id"</span>: <span class="str">"1aBcDeF..."</span>,
  <span class="str">"admin_password"</span>: <span class="str">"mi_password"</span>,
  <span class="str">"cloudinary_cloud_name"</span>: <span class="str">"tu_cloud"</span>,
  <span class="str">"cloudinary_upload_preset"</span>: <span class="str">"unsigned_preset"</span>
}</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-delete">DEL</span>
        <span class="endpoint-path">/api/config</span>
        <span class="endpoint-desc" id="t-reset-desc">Resetear configuración (admin)</span>
      </div>
      <div class="endpoint-body">
        <pre><code>DELETE /api/config
X-Admin-Key: tu_password

<span class="cmt">// Response</span>
{ <span class="str">"success"</span>: <span class="kw">true</span>, <span class="str">"message"</span>: <span class="str">"..."</span> }</code></pre>
      </div>
    </div>
  </div>

  <h2 id="t-h-files">Archivos</h2>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-post">POST</span>
        <span class="endpoint-path">/api/upload</span>
        <span class="endpoint-desc" id="t-upload-desc">Subir archivo</span>
      </div>
      <div class="endpoint-body">
        <pre><code>POST /api/upload
Content-Type: multipart/form-data

<span class="cmt">// Campo: "file" — Archivo a subir</span>
<span class="cmt">// Opcional: "folder_id" — ID de la carpeta destino</span>
<span class="cmt">// Opcional via header: X-Folder-ID</span>
<span class="cmt">// Opcional via query: ?folder_id=xxx</span>
<span class="cmt">// Tipos permitidos: MP3, MP4, WAV, ZIP, RAR, JPG, PNG, GIF, WebP</span>
<span class="cmt">// Max: 100MB</span>

<span class="cmt">// Response</span>
{
  <span class="str">"success"</span>: <span class="kw">true</span>,
  <span class="str">"file"</span>: {
    <span class="str">"id"</span>: <span class="str">"abc123def456"</span>,
    <span class="str">"name"</span>: <span class="str">"song.mp3"</span>,
    <span class="str">"type"</span>: <span class="str">"audio/mpeg"</span>,
    <span class="str">"size"</span>: <span class="kw">4521984</span>,
    <span class="str">"size_display"</span>: <span class="str">"4.3 MB"</span>,
    <span class="str">"folder_id"</span>: <span class="str">"xyz789"</span>,
    <span class="str">"download_url"</span>: <span class="str">"https://drive.usercontent.google.com/..."</span>,
    <span class="str">"embed_url"</span>: <span class="str">"https://drive.google.com/file/d/.../preview"</span>,
    <span class="str">"created_at"</span>: <span class="str">"2026-04-05T12:00:00.000Z"</span>
  }
}</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-get">GET</span>
        <span class="endpoint-path">/api/files</span>
        <span class="endpoint-desc" id="t-list-desc">Listar archivos</span>
      </div>
      <div class="endpoint-body">
        <pre><code>GET /api/files

<span class="cmt">// Response</span>
{
  <span class="str">"files"</span>: [ { <span class="str">"id"</span>: <span class="str">"..."</span>, <span class="str">"name"</span>: <span class="str">"..."</span>, <span class="str">"download_url"</span>: <span class="str">"..."</span> } ],
  <span class="str">"total"</span>: <span class="kw">12</span>
}</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-get">GET</span>
        <span class="endpoint-path">/api/files/:id</span>
        <span class="endpoint-desc" id="t-info-desc">Info de archivo</span>
      </div>
      <div class="endpoint-body">
        <pre><code>GET /api/files/abc123def456

<span class="cmt">// Response</span>
{ <span class="str">"file"</span>: { <span class="str">"id"</span>: <span class="str">"abc123def456"</span>, <span class="str">"name"</span>: <span class="str">"video.mp4"</span>, ... } }</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-get">GET</span>
        <span class="endpoint-path">/api/files/:id/download</span>
        <span class="endpoint-desc" id="t-dl-desc">Descargar archivo</span>
      </div>
      <div class="endpoint-body">
        <pre><code>GET /api/files/abc123def456/download

<span class="cmt">// Response: 302 Redirect a Google Drive o Cloudinary</span></code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-delete">DEL</span>
        <span class="endpoint-path">/api/files/:id</span>
        <span class="endpoint-desc" id="t-del-desc">Eliminar archivo (admin)</span>
      </div>
      <div class="endpoint-body">
        <pre><code>DELETE /api/files/abc123def456
X-Admin-Key: tu_password

{ <span class="str">"success"</span>: <span class="kw">true</span>, <span class="str">"message"</span>: <span class="str">"Archivo eliminado"</span> }</code></pre>
      </div>
    </div>
  </div>

  <h2 id="t-h-examples">Ejemplos de código</h2>

  <h2 id="t-h-folders" style="margin-top:36px">Carpetas / Workspaces</h2>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-post">POST</span>
        <span class="endpoint-path">/api/folders</span>
        <span class="endpoint-desc" id="t-create-folder-desc">Crear carpeta</span>
      </div>
      <div class="endpoint-body">
        <pre><code>POST /api/folders
Content-Type: application/json

{
  <span class="str">"name"</span>: <span class="str">"Mi App de Música"</span>
}

<span class="cmt">// Response</span>
{
  <span class="str">"success"</span>: <span class="kw">true</span>,
  <span class="str">"folder"</span>: {
    <span class="str">"id"</span>: <span class="str">"abc123def456"</span>,
    <span class="str">"name"</span>: <span class="str">"Mi App de Música"</span>,
    <span class="str">"drive_id"</span>: <span class="str">"1XyZ..."</span>,
    <span class="str">"created_at"</span>: <span class="str">"2026-04-05T12:00:00.000Z"</span>,
    <span class="str">"file_count"</span>: <span class="kw">0</span>
  }
}</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-get">GET</span>
        <span class="endpoint-path">/api/folders</span>
        <span class="endpoint-desc" id="t-list-folders-desc">Listar carpetas</span>
      </div>
      <div class="endpoint-body">
        <pre><code>GET /api/folders

<span class="cmt">// Response</span>
{
  <span class="str">"folders"</span>: [
    { <span class="str">"id"</span>: <span class="str">"abc123"</span>, <span class="str">"name"</span>: <span class="str">"Música"</span>, <span class="str">"file_count"</span>: <span class="kw">5</span> },
    { <span class="str">"id"</span>: <span class="str">"def456"</span>, <span class="str">"name"</span>: <span class="str">"Videos"</span>, <span class="str">"file_count"</span>: <span class="kw">3</span> }
  ],
  <span class="str">"total"</span>: <span class="kw">2</span>
}</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-get">GET</span>
        <span class="endpoint-path">/api/folders/:id/files</span>
        <span class="endpoint-desc" id="t-folder-files-desc">Archivos en carpeta</span>
      </div>
      <div class="endpoint-body">
        <pre><code>GET /api/folders/abc123def456/files

<span class="cmt">// Response</span>
{
  <span class="str">"folder"</span>: { <span class="str">"id"</span>: <span class="str">"abc123def456"</span>, <span class="str">"name"</span>: <span class="str">"Música"</span> },
  <span class="str">"files"</span>: [ { <span class="str">"id"</span>: <span class="str">"..."</span>, <span class="str">"name"</span>: <span class="str">"song.mp3"</span>, <span class="str">"download_url"</span>: <span class="str">"..."</span> } ],
  <span class="str">"total"</span>: <span class="kw">5</span>
}</code></pre>
      </div>
    </div>
  </div>

  <div class="endpoint">
    <div class="endpoint-card">
      <div class="endpoint-head">
        <span class="method-badge m-delete">DEL</span>
        <span class="endpoint-path">/api/folders/:id</span>
        <span class="endpoint-desc" id="t-del-folder-desc">Eliminar carpeta y archivos (admin)</span>
      </div>
      <div class="endpoint-body">
        <pre><code>DELETE /api/folders/abc123def456
X-Admin-Key: tu_password

{ <span class="str">"success"</span>: <span class="kw">true</span>, <span class="str">"message"</span>: <span class="str">"Carpeta eliminada con 5 archivos"</span> }</code></pre>
      </div>
    </div>
  </div>

  <h2 id="t-h-examples2" style="display:none">Ejemplos de código</h2>

  <div class="example-tabs">
    <button class="example-tab active" onclick="showTab('nodejs',this)">Node.js</button>
    <button class="example-tab" onclick="showTab('python',this)">Python</button>
    <button class="example-tab" onclick="showTab('java',this)">Java</button>
    <button class="example-tab" onclick="showTab('curl',this)">cURL</button>
  </div>

  <div class="example-panel active" id="panel-nodejs">
    <pre><code><span class="cmt">// Upload file</span>
<span class="kw">const</span> fs = <span class="kw">require</span>(<span class="str">'fs'</span>);
<span class="kw">const</span> form = <span class="kw">new</span> FormData();
form.append(<span class="str">'file'</span>, fs.createReadStream(<span class="str">'song.mp3'</span>));

<span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">'${baseUrl}/api/upload'</span>, {
  method: <span class="str">'POST'</span>, body: form
});
<span class="kw">const</span> data = <span class="kw">await</span> res.json();
console.log(data.file.download_url); <span class="cmt">// Public link</span>

<span class="cmt">// List files</span>
<span class="kw">const</span> list = <span class="kw">await</span> (await fetch(<span class="str">'${baseUrl}/api/files'</span>)).json();

<span class="cmt">// Delete file (admin)</span>
<span class="kw">await</span> fetch(<span class="str">\`\${baseUrl}/api/files/\${id}\`</span>, {
  method: <span class="str">'DELETE'</span>,
  headers: { <span class="str">'X-Admin-Key'</span>: <span class="str">'your_password'</span> }
});</code></pre>
  </div>

  <div class="example-panel" id="panel-python">
    <pre><code><span class="kw">import</span> requests

BASE = <span class="str">"${baseUrl}"</span>

<span class="cmt"># Upload file</span>
<span class="kw">with</span> open(<span class="str">"video.mp4"</span>, <span class="str">"rb"</span>) <span class="kw">as</span> f:
    r = requests.post(f<span class="str">"{BASE}/api/upload"</span>, files={<span class="str">"file"</span>: f})
data = r.json()
print(data[<span class="str">"file"</span>][<span class="str">"download_url"</span>])

<span class="cmt"># List files</span>
files = requests.get(f<span class="str">"{BASE}/api/files"</span>).json()

<span class="cmt"># Download file (streaming)</span>
r = requests.get(f<span class="str">"{BASE}/api/files/{id}/download"</span>, stream=<span class="kw">True</span>)
<span class="kw">with</span> open(<span class="str">"out.mp4"</span>, <span class="str">"wb"</span>) <span class="kw">as</span> f:
    <span class="kw">for</span> chunk <span class="kw">in</span> r.iter_content(8192):
        f.write(chunk)

<span class="cmt"># Delete file (admin)</span>
requests.delete(
    f<span class="str">"{BASE}/api/files/{id}"</span>,
    headers={<span class="str">"X-Admin-Key"</span>: <span class="str">"your_password"</span>}
)</code></pre>
  </div>

  <div class="example-panel" id="panel-java">
    <pre><code><span class="cmt">// Upload file using HttpURLConnection</span>
<span class="kw">import</span> java.io.*;
<span class="kw">import</span> java.net.http.*;

String base = <span class="str">"${baseUrl}"</span>;
HttpClient client = HttpClient.newHttpClient();

<span class="cmt">// Build multipart request</span>
String boundary = <span class="str">"---BOUNDARY"</span>;
Path file = Path.of(<span class="str">"song.mp3"</span>);
String body = <span class="str">"--"</span> + boundary + <span class="str">"\\r\\n"</span> +
  <span class="str">"Content-Disposition: form-data; name=\\"file\\"; filename=\\""</span> +
  file.getFileName() + <span class="str">"\\"\\r\\n"</span> +
  <span class="str">"Content-Type: audio/mpeg\\r\\n\\r\\n"</span> +
  Files.readString(file) + <span class="str">"\\r\\n--"</span> + boundary + <span class="str">"--\\r\\n"</span>;

HttpRequest req = HttpRequest.newBuilder()
  .uri(URI.create(base + <span class="str">"/api/upload"</span>))
  .header(<span class="str">"Content-Type"</span>, <span class="str">"multipart/form-data; boundary="</span> + boundary)
  .POST(HttpRequest.BodyPublishers.ofString(body))
  .build();

HttpResponse&lt;String&gt; res = client.send(req,
  HttpResponse.BodyHandlers.ofString());

<span class="cmt">// Parse JSON response to get download_url</span>
System.out.println(res.body());</code></pre>
  </div>

  <div class="example-panel" id="panel-curl">
    <pre><code><span class="cmt"># Upload file</span>
curl -X POST <span class="str">"${baseUrl}/api/upload"</span> \\
  -F <span class="str">"file=@song.mp3"</span>

<span class="cmt"># List files</span>
curl <span class="str">"${baseUrl}/api/files"</span>

<span class="cmt"># Get file info</span>
curl <span class="str">"${baseUrl}/api/files/FILE_ID"</span>

<span class="cmt"># Download file</span>
curl -L <span class="str">"${baseUrl}/api/files/FILE_ID/download"</span> -o out.mp3

<span class="cmt"># Delete file (admin)</span>
curl -X DELETE <span class="str">"${baseUrl}/api/files/FILE_ID"</span> \\
  -H <span class="str">"X-Admin-Key: your_password"</span>

<span class="cmt"># Check system status</span>
curl <span class="str">"${baseUrl}/api/status"</span></code></pre>
  </div>

  <div class="note-box" id="t-streaming-note">
    <strong id="t-streaming-title">Streaming:</strong> <span id="t-streaming-text">Para integrar con reproductores de video/audio, usa la URL de download directamente en tu tag &lt;video&gt; o &lt;audio&gt;. Si Cloudinary está configurado, se redirige al stream CDN optimizado.</span>
  </div>
</div>

<script>
// Language system
const T = {
  es: {
    title: 'API Reference', subtitle: 'Base URL:',
    hConfig: 'Configuración', hFiles: 'Archivos', hFolders: 'Carpetas / Workspaces', hExamples: 'Ejemplos de código',
    statusDesc: 'Estado del sistema',
    configDesc: 'Guardar credenciales',
    resetDesc: 'Resetear configuración (admin)',
    uploadDesc: 'Subir archivo',
    listDesc: 'Listar archivos',
    infoDesc: 'Info de archivo',
    dlDesc: 'Descargar archivo',
    delDesc: 'Eliminar archivo (admin)',
    createFolderDesc: 'Crear carpeta',
    listFoldersDesc: 'Listar carpetas',
    folderFilesDesc: 'Archivos en carpeta',
    delFolderDesc: 'Eliminar carpeta y archivos (admin)',
    note: '<strong>Nota:</strong> Todos los endpoints responden en JSON. Para solicitudes desde navegador, la raíz <code>/</code> devuelve HTML. Agrega <code>Accept: application/json</code> para forzar JSON.',
    streamingTitle: 'Streaming:',
    streamingText: 'Para integrar con reproductores de video/audio, usa la URL de download directamente en tu tag &lt;video&gt; o &lt;audio&gt;. Si Cloudinary está configurado, se redirige al stream CDN optimizado.',
    back: 'Volver al dashboard'
  },
  en: {
    title: 'API Reference', subtitle: 'Base URL:',
    hConfig: 'Configuration', hFiles: 'Files', hExamples: 'Code Examples',
    statusDesc: 'System status',
    configDesc: 'Save credentials',
    resetDesc: 'Reset configuration (admin)',
    uploadDesc: 'Upload file',
    listDesc: 'List files',
    infoDesc: 'File info',
    dlDesc: 'Download file',
    delDesc: 'Delete file (admin)',
    createFolderDesc: 'Create folder',
    listFoldersDesc: 'List folders',
    folderFilesDesc: 'Files in folder',
    delFolderDesc: 'Delete folder and files (admin)',
    note: '<strong>Note:</strong> All endpoints respond in JSON. Browser requests to <code>/</code> return HTML. Add <code>Accept: application/json</code> to force JSON response.',
    streamingTitle: 'Streaming:',
    streamingText: 'To integrate with video/audio players, use the download URL directly in your &lt;video&gt; or &lt;audio&gt; tag. If Cloudinary is configured, it redirects to the optimized CDN stream.',
    back: 'Back to dashboard'
  },
  pt: {
    title: 'Referência da API', subtitle: 'URL Base:',
    hConfig: 'Configuração', hFiles: 'Arquivos', hExamples: 'Exemplos de código',
    statusDesc: 'Status do sistema',
    configDesc: 'Salvar credenciais',
    resetDesc: 'Resetar configuração (admin)',
    uploadDesc: 'Enviar arquivo',
    listDesc: 'Listar arquivos',
    infoDesc: 'Info do arquivo',
    dlDesc: 'Baixar arquivo',
    delDesc: 'Excluir arquivo (admin)',
    createFolderDesc: 'Criar pasta',
    listFoldersDesc: 'Listar pastas',
    folderFilesDesc: 'Arquivos na pasta',
    delFolderDesc: 'Excluir pasta e arquivos (admin)',
    note: '<strong>Nota:</strong> Todos os endpoints respondem em JSON. Requisições do navegador para <code>/</code> retornam HTML. Adicione <code>Accept: application/json</code> para forçar JSON.',
    streamingTitle: 'Streaming:',
    streamingText: 'Para integrar com reprodutores de vídeo/áudio, use a URL de download diretamente na tag &lt;video&gt; ou &lt;audio&gt;. Se o Cloudinary estiver configurado, redireciona para o stream CDN otimizado.',
    back: 'Voltar ao dashboard'
  }
};

function setLang(lang) {
  const t = T[lang];
  document.querySelectorAll('.lang-btn').forEach((b,i) => {
    b.classList.toggle('active', ['es','en','pt'][i] === lang);
  });
  document.getElementById('t-title').textContent = t.title;
  document.getElementById('t-subtitle').innerHTML = t.subtitle + ' <code>${baseUrl}</code>';
  document.getElementById('t-h-config').textContent = t.hConfig;
  document.getElementById('t-h-files').textContent = t.hFiles;
  document.getElementById('t-h-folders').textContent = t.hFolders;
  document.getElementById('t-h-examples').textContent = t.hExamples;
  document.getElementById('t-status-desc').textContent = t.statusDesc;
  document.getElementById('t-config-desc').textContent = t.configDesc;
  document.getElementById('t-reset-desc').textContent = t.resetDesc;
  document.getElementById('t-upload-desc').textContent = t.uploadDesc;
  document.getElementById('t-list-desc').textContent = t.listDesc;
  document.getElementById('t-info-desc').textContent = t.infoDesc;
  document.getElementById('t-dl-desc').textContent = t.dlDesc;
  document.getElementById('t-del-desc').textContent = t.delDesc;
  document.getElementById('t-create-folder-desc').textContent = t.createFolderDesc;
  document.getElementById('t-list-folders-desc').textContent = t.listFoldersDesc;
  document.getElementById('t-folder-files-desc').textContent = t.folderFilesDesc;
  document.getElementById('t-del-folder-desc').textContent = t.delFolderDesc;
  document.getElementById('t-note').innerHTML = t.note;
  document.getElementById('t-streaming-title').textContent = t.streamingTitle;
  document.getElementById('t-streaming-text').textContent = t.streamingText;
  document.querySelector('.back-link').innerHTML = '${IC.chevronLeft} ' + t.back;
  localStorage.setItem('cmh_lang', lang);
}

function showTab(id, btn) {
  document.querySelectorAll('.example-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.example-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
}

// Restore saved language
const saved = localStorage.getItem('cmh_lang');
if (saved && T[saved]) setLang(saved);
</script>
</body>
</html>`;
}

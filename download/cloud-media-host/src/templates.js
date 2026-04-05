/**
 * HTML Templates - Setup page + Dashboard + Admin
 * Modern dark theme, responsive, all inline
 */

// ============================================
// SETUP PAGE (first visit, no config)
// ============================================
export function setupPage() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cloud Media Host - Configuración</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#0a0a1a;color:#e0e0e0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .container{max-width:600px;width:100%}
  h1{text-align:center;font-size:2rem;margin-bottom:8px;background:linear-gradient(135deg,#6c63ff,#00d2ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .subtitle{text-align:center;color:#888;margin-bottom:32px;font-size:.9rem}
  .card{background:#12122a;border:1px solid #1e1e3a;border-radius:16px;padding:28px;margin-bottom:20px}
  .card h2{font-size:1.1rem;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .card h2 .badge{font-size:.65rem;background:#6c63ff;color:#fff;padding:2px 8px;border-radius:20px}
  .badge-optional{background:#333!important;color:#aaa!important}
  label{display:block;font-size:.85rem;color:#aaa;margin-bottom:6px;margin-top:12px}
  label:first-of-type{margin-top:0}
  input[type="text"],input[type="password"],textarea{width:100%;background:#1a1a2e;border:1px solid #2a2a4a;border-radius:10px;padding:12px;color:#e0e0e0;font-size:.9rem;font-family:monospace;resize:vertical}
  textarea{min-height:100px;font-size:.75rem}
  input:focus,textarea:focus{outline:none;border-color:#6c63ff}
  .hint{font-size:.75rem;color:#555;margin-top:4px}
  .checkbox-row{display:flex;align-items:center;gap:8px;margin-top:16px}
  .checkbox-row input[type="checkbox"]{width:18px;height:18px;accent-color:#6c63ff}
  .btn{display:block;width:100%;padding:14px;border:none;border-radius:12px;font-size:1rem;font-weight:600;cursor:pointer;transition:all .2s}
  .btn-primary{background:linear-gradient(135deg,#6c63ff,#00d2ff);color:#fff;margin-top:20px}
  .btn-primary:hover{opacity:.9;transform:translateY(-1px)}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .status{margin-top:12px;padding:10px 14px;border-radius:10px;font-size:.85rem;display:none}
  .status.show{display:block}
  .status.ok{background:#0a2a0a;border:1px solid #00c853;color:#00c853}
  .status.error{background:#2a0a0a;border:1px solid #ff5252;color:#ff5252}
  .steps{font-size:.8rem;color:#666;margin-top:8px;line-height:1.6}
  .footer{text-align:center;margin-top:24px;font-size:.75rem;color:#444}
</style>
</head>
<body>
<div class="container">
  <h1>☁️ Cloud Media Host</h1>
  <p class="subtitle">Hosting de archivos gratuito · Google Drive + Cloudinary + Cloudflare</p>

  <div class="card">
    <h2>📁 Google Drive <span class="badge">OBLIGATORIO</span></h2>
    <label>Service Account JSON</label>
    <textarea id="driveJson" placeholder='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"..."}'></textarea>
    <div class="hint">Pega aquí todo el contenido del archivo JSON que descargaste de Google Cloud Console</div>

    <label>Folder ID (ID de la carpeta)</label>
    <input type="text" id="driveFolder" placeholder="1aBcDeFgHiJkLmNoPqRsTuVwXyZ">

    <div class="steps">
      📋 Pasos para obtener esto:<br>
      1. Ir a <a href="https://console.cloud.google.com" target="_blank" style="color:#6c63ff">console.cloud.google.com</a><br>
      2. Crear proyecto → Habilitar "Google Drive API"<br>
      3. Crear "Cuenta de servicio" → Descargar clave JSON<br>
      4. Crear carpeta en Drive → Copiar ID de la URL<br>
      5. Compartir la carpeta con el email de la cuenta de servicio
    </div>
  </div>

  <div class="card">
    <h2>☁️ Cloudinary <span class="badge badge-optional">OPCIONAL</span></h2>
    <div class="checkbox-row">
      <input type="checkbox" id="enableCloudinary">
      <label style="margin:0;cursor:pointer" for="enableCloudinary">Configurar Cloudinary (para thumbnails y streaming de video)</label>
    </div>
    <div id="cloudinaryFields" style="display:none">
      <label>Cloud Name</label>
      <input type="text" id="cloudName" placeholder="tu_cloud_name">
      <label>Upload Preset (unsigned)</label>
      <input type="text" id="uploadPreset" placeholder="unsigned_preset_name">
      <div class="hint">Crear en Cloudinary Dashboard → Settings → Upload → Upload Presets → Agregar "Unsigned"</div>
    </div>
  </div>

  <div class="card">
    <h2>🔒 Seguridad</h2>
    <label>Contraseña de administrador (opcional)</label>
    <input type="password" id="adminPassword" placeholder="Dejar vacío = acceso abierto">
    <div class="hint">Si la configuras, solo podrá eliminar archivos y cambiar ajustes quien tenga esta contraseña</div>
  </div>

  <button class="btn btn-primary" id="saveBtn" onclick="saveConfig()">💾 GUARDAR Y EMPEZAR</button>
  <div class="status" id="statusMsg"></div>

  <div class="footer">
    Cloud Media Host · Gratis · Sin servidor · Sin límites ocultos<br>
    Los archivos se almacenan en TU Google Drive (15GB gratis)
  </div>
</div>

<script>
document.getElementById('enableCloudinary').addEventListener('change', function() {
  document.getElementById('cloudinaryFields').style.display = this.checked ? 'block' : 'none';
});

async function saveConfig() {
  const btn = document.getElementById('saveBtn');
  const status = document.getElementById('statusMsg');
  btn.disabled = true;
  btn.textContent = '⏳ Guardando...';
  status.className = 'status';

  const driveJson = document.getElementById('driveJson').value.trim();
  const driveFolder = document.getElementById('driveFolder').value.trim();
  const enableCloud = document.getElementById('enableCloudinary').checked;
  const adminPassword = document.getElementById('adminPassword').value.trim();

  // Validate required fields
  if (!driveJson) {
    showStatus('❌ El Service Account JSON es obligatorio', false);
    btn.disabled = false;
    btn.textContent = '💾 GUARDAR Y EMPEZAR';
    return;
  }

  if (!driveFolder) {
    showStatus('❌ El Folder ID es obligatorio', false);
    btn.disabled = false;
    btn.textContent = '💾 GUARDAR Y EMPEZAR';
    return;
  }

  // Parse JSON
  let credentials;
  try {
    credentials = JSON.parse(driveJson);
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error('Faltan campos requeridos');
    }
  } catch (e) {
    showStatus('❌ JSON inválido: ' + e.message, false);
    btn.disabled = false;
    btn.textContent = '💾 GUARDAR Y EMPEZAR';
    return;
  }

  const config = {
    drive_credentials: credentials,
    drive_folder_id: driveFolder,
    admin_password: adminPassword || null
  };

  if (enableCloud) {
    config.cloudinary_cloud_name = document.getElementById('cloudName').value.trim();
    config.cloudinary_upload_preset = document.getElementById('uploadPreset').value.trim();
    if (!config.cloudinary_cloud_name || !config.cloudinary_upload_preset) {
      showStatus('❌ Si activas Cloudinary, Cloud Name y Upload Preset son obligatorios', false);
      btn.disabled = false;
      btn.textContent = '💾 GUARDAR Y EMPEZAR';
      return;
    }
  }

  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (data.success) {
      showStatus('✅ ¡Configuración guardada! Redirigiendo...', true);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showStatus('❌ Error: ' + (data.error || 'Desconocido'), false);
    }
  } catch (e) {
    showStatus('❌ Error de conexión: ' + e.message, false);
  }
  btn.disabled = false;
  btn.textContent = '💾 GUARDAR Y EMPEZAR';
}

function showStatus(msg, ok) {
  const s = document.getElementById('statusMsg');
  s.textContent = msg;
  s.className = 'status show ' + (ok ? 'ok' : 'error');
}
</script>
</body>
</html>`;
}


// ============================================
// DASHBOARD (main file management page)
// ============================================
export function dashboardPage(config, files = []) {
  const hasCloudinary = !!config.cloudinary_cloud_name;

  const fileListHtml = files.length === 0
    ? `<div class="empty-state">
        <div class="empty-icon">📂</div>
        <p>No hay archivos todavía</p>
        <p class="hint">Arrastra un archivo arriba para empezar</p>
      </div>`
    : files.map(f => `
      <div class="file-item" data-id="${f.id}">
        <div class="file-icon">${f.icon || '📄'}</div>
        <div class="file-info">
          <div class="file-name" title="${f.name}">${f.name}</div>
          <div class="file-meta">${f.size_display || '?'} · ${f.type_display || '?'} · ${f.date_display || '?'}</div>
        </div>
        <div class="file-actions">
          <button class="btn-sm" onclick="copyUrl('${f.download_url || ''}')" title="Copiar enlace">📋</button>
          ${hasCloudinary && f.cloudinary_url ? `<button class="btn-sm" onclick="window.open('${f.cloudinary_url}')" title="Ver en Cloudinary">☁️</button>` : ''}
          ${f.type_display === 'Video' ? `<button class="btn-sm" onclick="playVideo('${f.id}')" title="Reproducir">▶️</button>` : ''}
          ${f.type_display === 'Audio' ? `<button class="btn-sm" onclick="playAudio('${f.id}')" title="Reproducir">🎵</button>` : ''}
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
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#0a0a1a;color:#e0e0e0;min-height:100vh}
  .header{background:#12122a;border-bottom:1px solid #1e1e3a;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
  .header h1{font-size:1.2rem;background:linear-gradient(135deg,#6c63ff,#00d2ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .header-actions{display:flex;gap:8px}
  .btn-icon{background:#1a1a2e;border:1px solid #2a2a4a;color:#e0e0e0;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:.85rem}
  .btn-icon:hover{background:#2a2a4a}
  .container{max-width:900px;margin:0 auto;padding:20px}

  /* Upload zone */
  .upload-zone{border:2px dashed #2a2a4a;border-radius:16px;padding:40px 20px;text-align:center;margin-bottom:24px;cursor:pointer;transition:all .2s;background:#0d0d20}
  .upload-zone:hover,.upload-zone.dragover{border-color:#6c63ff;background:#12122e}
  .upload-zone .icon{font-size:2.5rem;margin-bottom:8px}
  .upload-zone p{color:#888;font-size:.9rem}
  .upload-zone input{display:none}

  /* Stats bar */
  .stats{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}
  .stat{background:#12122a;border:1px solid #1e1e3a;border-radius:12px;padding:12px 18px;flex:1;min-width:120px;text-align:center}
  .stat .num{font-size:1.5rem;font-weight:700;color:#6c63ff}
  .stat .label{font-size:.75rem;color:#888;margin-top:2px}

  /* File list */
  .files-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .files-header h2{font-size:1rem}
  .search-box{background:#1a1a2e;border:1px solid #2a2a4a;border-radius:8px;padding:8px 12px;color:#e0e0e0;font-size:.85rem;width:200px}
  .search-box:focus{outline:none;border-color:#6c63ff}

  .file-item{background:#12122a;border:1px solid #1e1e3a;border-radius:12px;padding:14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;transition:background .15s}
  .file-item:hover{background:#1a1a3a}
  .file-icon{font-size:1.5rem;width:36px;text-align:center}
  .file-info{flex:1;min-width:0}
  .file-name{font-size:.9rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .file-meta{font-size:.75rem;color:#666;margin-top:2px}
  .file-actions{display:flex;gap:4px}
  .btn-sm{background:#1a1a2e;border:1px solid #2a2a4a;color:#e0e0e0;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:.8rem}
  .btn-sm:hover{background:#2a2a4a}

  /* Empty state */
  .empty-state{text-align:center;padding:60px 20px;color:#555}
  .empty-icon{font-size:3rem;margin-bottom:12px}
  .empty-state .hint{font-size:.8rem;margin-top:4px}

  /* Upload progress */
  .upload-progress{display:none;margin-bottom:20px}
  .upload-progress.active{display:block}
  .progress-bar{background:#1a1a2e;border-radius:10px;height:8px;overflow:hidden;margin-top:8px}
  .progress-fill{background:linear-gradient(90deg,#6c63ff,#00d2ff);height:100%;border-radius:10px;transition:width .3s;width:0}
  .progress-text{font-size:.85rem;color:#aaa;margin-top:4px}

  /* Player modal */
  .modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.85);z-index:200;align-items:center;justify-content:center;padding:20px}
  .modal.show{display:flex}
  .modal-content{background:#12122a;border-radius:16px;padding:20px;max-width:700px;width:100%;max-height:90vh;overflow:auto}
  .modal-close{float:right;background:none;border:none;color:#888;font-size:1.5rem;cursor:pointer}
  .modal-close:hover{color:#fff}
  .modal-content video,.modal-content audio{width:100%;border-radius:8px;margin-top:12px}

  /* Admin modal */
  .admin-section{margin-top:16px}
  .admin-section h3{font-size:.95rem;margin-bottom:10px}
  .danger-btn{background:#2a0a0a;border:1px solid #ff5252;color:#ff5252;padding:10px 16px;border-radius:8px;cursor:pointer;width:100%;margin-top:8px}
  .danger-btn:hover{background:#3a0a0a}
  .admin-input{background:#1a1a2e;border:1px solid #2a2a4a;border-radius:8px;padding:10px;color:#e0e0e0;font-size:.9rem;width:100%;margin-bottom:8px}
  .admin-input:focus{outline:none;border-color:#6c63ff}

  /* Services indicator */
  .services{display:flex;gap:6px;align-items:center}
  .service-dot{width:8px;height:8px;border-radius:50%}
  .service-dot.active{background:#00c853}
  .service-dot.inactive{background:#333}
  .service-label{font-size:.7rem;color:#666;margin-left:2px}

  /* Toast notification */
  .toast{position:fixed;bottom:20px;right:20px;background:#1a1a3a;border:1px solid #6c63ff;color:#e0e0e0;padding:12px 20px;border-radius:10px;font-size:.85rem;transform:translateY(100px);opacity:0;transition:all .3s;z-index:300}
  .toast.show{transform:translateY(0);opacity:1}
</style>
</head>
<body>

<div class="header">
  <h1>☁️ Cloud Media Host</h1>
  <div class="header-actions">
    <div class="services">
      <div class="service-dot active" title="Google Drive"></div>
      <span class="service-label">Drive</span>
      ${hasCloudinary ? '<div class="service-dot active" title="Cloudinary"></div><span class="service-label">CDN</span>' : ''}
    </div>
    <button class="btn-icon" onclick="showAdmin()" title="Admin">⚙️</button>
    <a href="/api/docs" target="_blank" class="btn-icon" title="API Docs">📖</a>
  </div>
</div>

<div class="container">
  <!-- Upload Zone -->
  <div class="upload-zone" id="dropZone">
    <div class="icon">📤</div>
    <p>Arrastra archivos aquí o haz click para seleccionar</p>
    <p style="font-size:.75rem;color:#555;margin-top:4px">MP3 · MP4 · ZIP · Imágenes</p>
    <input type="file" id="fileInput" multiple accept=".mp3,.mp4,.zip,.rar,.7z,.jpg,.jpeg,.png,.gif,.webp,.wav,.ogg,.aac,.webm">
  </div>

  <!-- Upload Progress -->
  <div class="upload-progress" id="uploadProgress">
    <div class="progress-text" id="progressText">Subiendo...</div>
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat"><div class="num">${files.length}</div><div class="label">Archivos</div></div>
    <div class="stat"><div class="num">${formatTotalSize(files)}</div><div class="label">Total</div></div>
    <div class="stat"><div class="num">${countByType(files, 'audio')}</div><div class="label">Audio</div></div>
    <div class="stat"><div class="num">${countByType(files, 'video')}</div><div class="label">Video</div></div>
  </div>

  <!-- File List -->
  <div class="files-header">
    <h2>📁 Mis Archivos</h2>
    <input type="text" class="search-box" placeholder="🔍 Buscar..." oninput="filterFiles(this.value)">
  </div>
  <div id="fileList">
    ${fileListHtml}
  </div>
</div>

<!-- Video/Audio Player Modal -->
<div class="modal" id="playerModal">
  <div class="modal-content">
    <button class="modal-close" onclick="closePlayer()">&times;</button>
    <div id="playerContainer"></div>
  </div>
</div>

<!-- Admin Modal -->
<div class="modal" id="adminModal">
  <div class="modal-content">
    <button class="modal-close" onclick="closeAdmin()">&times;</button>
    <h2 style="margin-bottom:16px">⚙️ Panel de Administración</h2>

    ${config.admin_password ? `
    <div>
      <label style="font-size:.85rem;color:#aaa">Contraseña de admin</label>
      <input type="password" class="admin-input" id="adminPassInput" placeholder="Ingresa tu contraseña">
    </div>` : ''}

    <div class="admin-section">
      <h3>🗑️ Eliminar todos los archivos</h3>
      <p style="font-size:.8rem;color:#888;margin-bottom:8px">Elimina todos los archivos de Google Drive y del sistema</p>
      <button class="danger-btn" onclick="deleteAllFiles()">ELIMINAR TODO</button>
    </div>

    <div class="admin-section">
      <h3>🔄 Resetear configuración</h3>
      <p style="font-size:.8rem;color:#888;margin-bottom:8px">Borra toda la configuración y empieza de nuevo</p>
      <button class="danger-btn" onclick="resetConfig()">RESETEAR APP</button>
    </div>

    <div class="admin-section">
      <h3>📊 Información del sistema</h3>
      <div style="font-size:.85rem;color:#aaa;line-height:1.8">
        Drive Folder ID: <code style="color:#6c63ff">${config.drive_folder_id || '?'}</code><br>
        Cloudinary: ${hasCloudinary ? '✅ Configurado' : '❌ No configurado'}<br>
        Admin Password: ${config.admin_password ? '✅ Configurada' : '❌ No configurada'}
      </div>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
// ---- UPLOAD ----
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => { if (fileInput.files.length) uploadFiles(fileInput.files); });

async function uploadFiles(files) {
  const progress = document.getElementById('uploadProgress');
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  progress.classList.add('active');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    text.textContent = \`Subiendo \${file.name} (\${i + 1}/\${files.length})...\`;
    fill.style.width = ((i / files.length) * 100) + '%';

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success) {
        showToast('❌ Error: ' + (data.error || file.name));
      }
    } catch (e) {
      showToast('❌ Error subiendo ' + file.name);
    }
  }

  text.textContent = '✅ ¡Listo!';
  fill.style.width = '100%';
  setTimeout(() => { progress.classList.remove('active'); fill.style.width = '0'; }, 2000);
  location.reload();
}

// ---- FILE ACTIONS ----
function copyUrl(url) {
  if (!url) { showToast('❌ Sin URL'); return; }
  navigator.clipboard.writeText(url).then(() => showToast('✅ Enlace copiado'));
}

async function deleteFile(id) {
  if (!confirm('¿Eliminar este archivo?')) return;
  const headers = {};
  const adminPass = localStorage.getItem('cmh_admin');
  if (adminPass) headers['X-Admin-Key'] = adminPass;
  const res = await fetch('/api/files/' + id, { method: 'DELETE', headers });
  const data = await res.json();
  showToast(data.success ? '✅ Eliminado' : '❌ ' + (data.error || 'Error'));
  if (data.success) setTimeout(() => location.reload(), 500);
}

// ---- PLAYERS ----
async function playVideo(id) {
  const modal = document.getElementById('playerModal');
  const container = document.getElementById('playerContainer');
  container.innerHTML = '<p style="color:#888">Cargando...</p>';
  modal.classList.add('show');
  try {
    const res = await fetch('/api/files/' + id);
    const data = await res.json();
    if (data.file) {
      container.innerHTML = '<h3>' + data.file.name + '</h3><video controls autoplay src="/api/files/' + id + '/download"></video>';
    } else {
      container.innerHTML = '<p style="color:#ff5252">Error: archivo no encontrado</p>';
    }
  } catch(e) { container.innerHTML = '<p style="color:#ff5252">Error</p>'; }
}

async function playAudio(id) {
  const modal = document.getElementById('playerModal');
  const container = document.getElementById('playerContainer');
  container.innerHTML = '<p style="color:#888">Cargando...</p>';
  modal.classList.add('show');
  try {
    const res = await fetch('/api/files/' + id);
    const data = await res.json();
    if (data.file) {
      container.innerHTML = '<h3>' + data.file.name + '</h3><audio controls autoplay src="/api/files/' + id + '/download" style="width:100%;margin-top:12px"></audio>';
    }
  } catch(e) { container.innerHTML = '<p style="color:#ff5252">Error</p>'; }
}

function closePlayer() { document.getElementById('playerModal').classList.remove('show'); }

// ---- ADMIN ----
function showAdmin() { document.getElementById('adminModal').classList.add('show'); }
function closeAdmin() { document.getElementById('adminModal').classList.remove('show'); }

async function deleteAllFiles() {
  const headers = {};
  const passInput = document.getElementById('adminPassInput');
  if (passInput && passInput.value) { headers['X-Admin-Key'] = passInput.value; localStorage.setItem('cmh_admin', passInput.value); }
  if (!confirm('⚠️ ¿ELIMINAR TODOS LOS ARCHIVOS? Esta acción no se puede deshacer.')) return;
  const res = await fetch('/api/files', { method: 'DELETE', headers });
  const data = await res.json();
  showToast(data.success ? '✅ Todos los archivos eliminados' : '❌ ' + (data.error || 'Error'));
  if (data.success) setTimeout(() => location.reload(), 1000);
}

async function resetConfig() {
  const headers = {};
  const passInput = document.getElementById('adminPassInput');
  if (passInput && passInput.value) { headers['X-Admin-Key'] = passInput.value; localStorage.setItem('cmh_admin', passInput.value); }
  if (!confirm('⚠️ ¿RESETEAR TODA LA CONFIGURACIÓN? Se borrará todo.')) return;
  const res = await fetch('/api/config', { method: 'DELETE', headers });
  const data = await res.json();
  showToast(data.success ? '✅ App reseteada' : '❌ ' + (data.error || 'Error'));
  if (data.success) setTimeout(() => location.reload(), 1000);
}

// ---- SEARCH ----
function filterFiles(query) {
  const items = document.querySelectorAll('.file-item');
  query = query.toLowerCase();
  items.forEach(item => {
    const name = item.querySelector('.file-name').textContent.toLowerCase();
    item.style.display = name.includes(query) ? 'flex' : 'none';
  });
}

// ---- TOAST ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- HELPERS ----
function formatTotalSize(files) {
  const bytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1073741824).toFixed(1) + ' GB';
}

function countByType(files, type) {
  return files.filter(f => (f.type_display || '').toLowerCase().includes(type)).length;
}

// Close modals on backdrop click
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); });
});
</script>
</body>
</html>`;
}


// ============================================
// API DOCS PAGE
// ============================================
export function apiDocsPage(baseUrl) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>API Docs - Cloud Media Host</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',monospace;background:#0a0a1a;color:#e0e0e0;padding:20px;max-width:800px;margin:0 auto;line-height:1.7}
  h1{color:#6c63ff;margin-bottom:4px}
  h2{color:#00d2ff;margin:24px 0 8px;font-size:1rem}
  h3{font-size:.9rem;margin:16px 0 4px}
  code{background:#1a1a2e;padding:2px 6px;border-radius:4px;font-size:.85rem;color:#6c63ff}
  pre{background:#12122a;border:1px solid #1e1e3a;border-radius:10px;padding:16px;overflow-x:auto;font-size:.8rem;margin:8px 0}
  pre code{background:none;padding:0}
  .method{display:inline-block;padding:2px 8px;border-radius:4px;font-size:.75rem;font-weight:700;color:#fff}
  .get{background:#00c853} .post{background:#2196f3} .delete{background:#ff5252}
  table{width:100%;border-collapse:collapse;margin:8px 0}
  th,td{text-align:left;padding:8px;border-bottom:1px solid #1e1e3a;font-size:.85rem}
  th{color:#888}
  a{color:#6c63ff}
</style>
</head>
<body>
<h1>📖 API Documentation</h1>
<p style="color:#888;margin-bottom:20px">Cloud Media Host REST API · Base URL: <code>${baseUrl}</code></p>

<h2>Configuración</h2>

<h3><span class="method get">GET</span> /api/status</h3>
<p>Estado actual del sistema</p>
<pre><code>Response: { "configured": true, "services": { "drive": true, "cloudinary": false }, "file_count": 5 }</code></pre>

<h3><span class="method post">POST</span> /api/config</h3>
<p>Guardar credenciales (solo primera vez o admin)</p>
<pre><code>Headers: { "Content-Type": "application/json", "X-Admin-Key": "password" (optional) }
Body: {
  "drive_credentials": { "type": "service_account", ... },
  "drive_folder_id": "1xKj...",
  "cloudinary_cloud_name": "abc",        // opcional
  "cloudinary_upload_preset": "xyz",      // opcional
  "admin_password": "secret123"           // opcional
}</code></pre>

<h2>Archivos</h2>

<h3><span class="method post">POST</span> /api/upload</h3>
<p>Subir archivo (multipart/form-data)</p>
<pre><code>Headers: { "X-Admin-Key": "password" (si admin-only uploads) }
Body: FormData with "file" field
Response: { "success": true, "file": { "id": "abc123", "name": "song.mp3", "size": 4521984, "download_url": "https://..." } }</code></pre>

<h3><span class="method get">GET</span> /api/files</h3>
<p>Listar todos los archivos</p>
<pre><code>Response: { "files": [ { "id": "...", "name": "...", "type": "audio/mpeg", "size": 4521984, "download_url": "..." } ] }</code></pre>

<h3><span class="method get">GET</span> /api/files/:id</h3>
<p>Info de un archivo específico</p>

<h3><span class="method get">GET</span> /api/files/:id/download</h3>
<p>Descargar archivo (redirect a Google Drive)</p>

<h3><span class="method delete">DELETE</span> /api/files/:id</h3>
<p>Eliminar un archivo (solo admin)</p>
<pre><code>Headers: { "X-Admin-Key": "password" }
Response: { "success": true }</code></pre>

<h3><span class="method delete">DELETE</span> /api/files</h3>
<p>Eliminar TODOS los archivos (solo admin)</p>

<h2>Ejemplos por lenguaje</h2>

<h3>Node.js</h3>
<pre><code>// Subir archivo
const form = new FormData();
form.append('file', fs.createReadStream('song.mp3'));
const res = await fetch('${baseUrl}/api/upload', { method: 'POST', body: form });
const data = await res.json();

// Descargar (streaming)
const res = await fetch('${baseUrl}/api/files/ID/download');
const file = await res.blob();</code></pre>

<h3>Python</h3>
<pre><code>import requests
# Subir archivo
with open("song.mp3", "rb") as f:
    r = requests.post("${baseUrl}/api/upload", files={"file": f})
print(r.json())

# Descargar (streaming)
r = requests.get("${baseUrl}/api/files/ID/download", stream=True)
with open("song.mp3", "wb") as f:
    for chunk in r.iter_content(8192): f.write(chunk)</code></pre>

<h3>cURL</h3>
<pre><code># Subir archivo
curl -X POST "${baseUrl}/api/upload" -F "file=@song.mp3"

# Listar archivos
curl "${baseUrl}/api/files"

# Descargar
curl -L "${baseUrl}/api/files/ID/download" -o song.mp3

# Eliminar (admin)
curl -X DELETE "${baseUrl}/api/files/ID" -H "X-Admin-Key: password"</code></pre>

</body>
</html>`;
}

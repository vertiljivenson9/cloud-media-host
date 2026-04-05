# ☁️ Cloud Media Host — Guía de Configuración

Hosting de archivos 100% GRATIS · Google Drive + Cloudinary + Cloudflare Workers

---

## 📋 Resumen rápido

| Componente | Qué hace | Costo |
|---|---|---|
| Cloudflare Worker | Servidor/API | $0 (100K requests/día) |
| Cloudflare KV | Base de datos | $0 (100K lecturas/día) |
| Google Drive | Almacenamiento | $0 (15 GB gratis) |
| Cloudinary (opcional) | CDN de video/imagen | $0 (25 GB + 25 GB bandwidth) |

---

## 🚀 Paso 1: Configurar Google Cloud (OBLIGATORIO)

### 1.1 Crear proyecto
1. Ir a https://console.cloud.google.com
2. Click en "Seleccionar proyecto" → "Nuevo proyecto"
3. Nombre: `Cloud Media Host` (o el que quieras)
4. Click "Crear"

### 1.2 Habilitar Google Drive API
1. En el menú izquierdo: "API y servicios" → "Biblioteca"
2. Buscar: `Google Drive API`
3. Click "Habilitar"

### 1.3 Crear cuenta de servicio
1. Ir a "API y servicios" → "Credenciales"
2. Click "Crear credenciales" → "Cuenta de servicio"
3. Nombre: `cloud-media-host`
4. Click "Crear y continuar" → "Listo"
5. Click en la cuenta que acabas de crear
6. Pestaña "Claves" → "Agregar clave" → "Crear nueva clave" → "JSON"
7. **DESCARGA ESTE ARCHIVO** — lo necesitarás después
8. Abre el archivo descargado y copia el `client_email` (algo como `nombre@proyecto.iam.gserviceaccount.com`)

### 1.4 Crear carpeta en Google Drive
1. Ir a https://drive.google.com
2. Crear una nueva carpeta: `Cloud Media Host`
3. Click derecho en la carpeta → "Compartir"
4. Pega el `client_email` de tu cuenta de servicio
5. Permiso: "Editor"
6. Click "Enviar"
7. Copia el **ID de la carpeta** de la URL:
   ```
   https://drive.google.com/drive/folders/ESTO_ES_EL_ID_AQUI
   ```

---

## ☁️ Paso 2: Configurar Cloudinary (OPCIONAL)

> Solo si quieres thumbnails y streaming de video. Si solo subes MP3 y ZIP, sáltate esto.

### 2.1 Crear cuenta
1. Ir a https://cloudinary.com/users/register_free
2. Crear cuenta con email/Google/GitHub
3. Al crear, te asignan un **Cloud Name** (anótalo)

### 2.2 Crear Upload Preset
1. Ir a Dashboard → Settings (engranaje arriba) → Upload
2. Bajar hasta "Upload presets"
3. Click "Add upload preset"
4. Nombre: `unsigned_media` (o el que quieras)
5. Signing mode: **Unsigned**
6. En "Allowed formats", selecciona los formatos que necesites
7. Click "Save"
8. **Anota el nombre del preset**

---

## 🔧 Paso 3: Desplegar en Cloudflare Workers

### 3.1 Instalar Wrangler CLI
```bash
npm install -g wrangler
```

### 3.2 Iniciar sesión
```bash
wrangler login
```
(Abre el navegador para autorizar)

### 3.3 Crear namespace KV
```bash
wrangler kv:namespace create "MEDIA_KV"
```
Esto devuelve un JSON con el `id` — **cópialo**.

### 3.4 Configurar wrangler.toml
Abre `wrangler.toml` y reemplaza:
```toml
id = "TU_KV_NAMESPACE_ID_AQUI"  # ← El ID del paso anterior
```

### 3.5 Crear .dev.vars (credenciales locales)
```bash
cp .dev.vars.example .dev.vars
```
(No necesitas llenarlo — la config se guarda desde la web)

### 3.6 Probar localmente
```bash
npm install
npm run dev
```
Abre http://localhost:8787

### 3.7 Desplegar a producción
```bash
npm run deploy
```
Te dará una URL tipo: `https://cloud-media-host.tu-nombre.workers.dev`

---

## 🌐 Paso 4: Configurar desde la web

1. Abre tu URL de Worker en el navegador
2. Te sale la pantalla de configuración
3. Pega el contenido del JSON de Google (paso 1.3)
4. Pega el Folder ID (paso 1.4)
5. Si quieres Cloudinary, actívalo y llena los campos
6. Opcional: pon una contraseña de admin
7. Click "GUARDAR Y EMPEZAR"
8. ¡Listo! Ya puedes subir archivos

---

## 📡 Usar la API desde tu código

### Node.js
```javascript
// Subir
const form = new FormData();
form.append('file', fs.createReadStream('cancion.mp3'));
const res = await fetch('https://tu-worker.workers.dev/api/upload', { method: 'POST', body: form });
const data = await res.json();

// Descargar
const res = await fetch(`https://tu-worker.workers.dev/api/files/${data.file.id}/download`);
const file = await res.blob();
```

### Python
```python
import requests

# Subir
with open("cancion.mp3", "rb") as f:
    res = requests.post("https://tu-worker.workers.dev/api/upload", files={"file": f})
archivo = res.json()

# Descargar
res = requests.get(f"https://tu-worker.workers.dev/api/files/{archivo['file']['id']}/download", stream=True)
with open("cancion.mp3", "wb") as f:
    for chunk in res.iter_content(8192): f.write(chunk)
```

### cURL
```bash
# Subir
curl -X POST "https://tu-worker.workers.dev/api/upload" -F "file=@cancion.mp3"

# Listar
curl "https://tu-worker.workers.dev/api/files"

# Descargar
curl -L "https://tu-worker.workers.dev/api/files/ID/download" -o cancion.mp3
```

---

## 🔒 Endpoints completos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Panel web |
| `GET` | `/api/docs` | Documentación API |
| `GET` | `/api/status` | Estado del sistema |
| `POST` | `/api/config` | Guardar credenciales |
| `DELETE` | `/api/config` | Resetear app (admin) |
| `POST` | `/api/upload` | Subir archivo |
| `GET` | `/api/files` | Listar archivos |
| `GET` | `/api/files/:id` | Info de archivo |
| `GET` | `/api/files/:id/download` | Descargar archivo |
| `DELETE` | `/api/files/:id` | Eliminar archivo (admin) |
| `DELETE` | `/api/files` | Eliminar todos (admin) |

---

## ⚠️ Limitaciones

| Recurso | Límite |
|---|---|
| Google Drive API | ~750MB-1.5GB subida/día |
| Google Drive almacenamiento | 15 GB por cuenta |
| Worker archivo máximo | 100 MB por petición |
| Cloudflare KV escrituras | 1,000/día |
| Cloudflare KV lecturas | 100,000/día |
| Cloudinary almacenamiento | 25 GB |
| Cloudinary bandwidth | 25 GB/mes |

---

## 📁 Estructura del proyecto

```
cloud-media-host/
├── src/
│   ├── worker.js          # Router principal + API
│   ├── jwt.js             # Autenticación Google (JWT)
│   ├── google-drive.js    # Cliente Google Drive API
│   ├── cloudinary-client.js # Cliente Cloudinary API
│   └── templates.js       # HTML/CSS/JS del panel web
├── wrangler.toml          # Config Cloudflare Worker
├── package.json           # Dependencias
├── .dev.vars.example      # Ejemplo de variables (no commitear)
├── .gitignore
└── SETUP.md               # Esta guía
```

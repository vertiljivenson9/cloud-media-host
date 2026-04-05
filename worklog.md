---
Task ID: 1
Agent: Super Z (Main)
Task: Fix upload-to-Drive bug + redesign setup page with per-folder API display

Work Log:
- Analyzed the codebase: src/worker.js, src/templates.js, src/google-drive.js, src/jwt.js, src/cloudinary-client.js
- Found CRITICAL BUG: handleUpload uses folderRecord.drive_id but setup saves drive_folder_id, so files never reached the correct Google Drive folder
- Fixed handleUpload to check both drive_folder_id and drive_id fields
- Fixed handleDeleteFolder to only try deleting from Drive for API-created folders (not user-linked ones)
- Added GET /setup route and handleSetup handler to make setup page accessible from dashboard
- Redesigned setupPage() in templates.js:
  - Back link to dashboard when already configured
  - Credentials section collapses when already configured
  - Per-folder API integration section (collapsible) showing upload/list/delete endpoints with copy buttons
  - Partial config update support (keep existing creds/password when not changed)
  - Preserves folder workspace IDs across saves
- Added Settings button (gear icon) and Admin button (lock icon) to dashboard header
- Updated handleSaveConfig to preserve existing credentials, password hash, cloudinary settings, and creation date when doing partial updates
- All 5 JS files pass syntax check (node --check)
- Committed and pushed to GitHub (f5a8563)

Stage Summary:
- Critical upload-to-Drive bug fixed
- /setup route now accessible from dashboard
- Setup page shows per-folder API endpoints
- Partial config updates supported
- Deployed via GitHub auto-deploy to Cloudflare Workers

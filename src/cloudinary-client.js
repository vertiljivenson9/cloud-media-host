/**
 * Cloudinary API Client (OPTIONAL)
 * Used for: thumbnails, image optimization, video streaming
 * NOT used for: MP3, ZIP (not supported by Cloudinary)
 */

/**
 * Check if Cloudinary supports a given file type
 */
export function isCloudinarySupported(contentType) {
  const supported = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm'
  ];
  return supported.includes(contentType);
}

/**
 * Upload a file to Cloudinary using unsigned upload preset
 * Uses the upload API directly (no auth needed with unsigned preset)
 * 
 * @param {string} cloudName - Cloudinary cloud name
 * @param {string} uploadPreset - Unsigned upload preset name
 * @param {string} fileName - File name (used as public_id prefix)
 * @param {string} contentType - MIME type
 * @param {ArrayBuffer|ReadableStream} fileData - File data
 * @returns {Object} Cloudinary upload response
 */
export async function uploadFile(cloudName, uploadPreset, fileName, contentType, fileData) {
  const formData = new FormData();

  // Add file data
  const blob = new Blob([fileData], { type: contentType });
  const timestamp = Date.now();
  const publicId = `media_${timestamp}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  formData.append('file', blob, fileName);
  formData.append('upload_preset', uploadPreset);
  formData.append('public_id', publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary upload failed: ${error}`);
  }

  const result = await response.json();

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    resourceType: result.resource_type, // 'image' or 'video'
    duration: result.duration // for videos, in seconds
  };
}

/**
 * Get thumbnail URL for a video (from Cloudinary)
 */
export function getVideoThumbnail(cloudName, publicId) {
  return `https://res.cloudinary.com/${cloudName}/video/upload/w_400,h_225,c_fill,q_auto/${publicId}.jpg`;
}

/**
 * Get optimized/streaming URL for video
 */
export function getVideoStreamUrl(cloudName, publicId) {
  return `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,w_1280/${publicId}.mp4`;
}

/**
 * Get optimized image URL with custom transformations
 */
export function getOptimizedImageUrl(cloudName, publicId, options = {}) {
  const {
    width = 1280,
    quality = 'auto',
    format = 'auto',
    crop = 'limit'
  } = options;

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},q_${quality},c_${crop},f_${format}/${publicId}`;
}

/**
 * Delete a resource from Cloudinary
 * NOTE: This requires API key + secret, not available with unsigned preset
 * We store the info in KV but deletion from Cloudinary requires the dashboard
 */
export function getDeleteUrl(cloudName, publicId, resourceType = 'image') {
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/destroy`;
}

/**
 * Verify Cloudinary configuration by testing the upload preset
 */
export async function verifyConfig(cloudName, uploadPreset) {
  try {
    // Test with a tiny 1x1 transparent PNG
    const tinyPng = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x82,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
      0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    const blob = new Blob([tinyPng], { type: 'image/png' });
    formData.append('file', blob, 'test_pixel.png');
    formData.append('upload_preset', uploadPreset);
    formData.append('public_id', `test_verify_${Date.now()}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      return { valid: false, error: 'Upload preset inválido o Cloud Name incorrecto' };
    }

    const result = await response.json();
    return { valid: true, testUrl: result.secure_url };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

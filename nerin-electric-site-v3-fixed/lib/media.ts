import path from 'node:path'
import fs from 'node:fs'
import { getStorageDir } from '@/lib/content'

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg'])

export function getMediaDir() {
  const mediaDir = path.join(getStorageDir(), 'media')
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
  }
  return mediaDir
}

export function sanitizeMediaFilename(filename: string) {
  const normalized = filename.trim().replace(/\s+/g, '-')
  const sanitized = normalized.replace(/[^a-zA-Z0-9._-]/g, '_')
  const fallback = `upload-${Date.now()}`
  const safeName = sanitized.length > 0 ? sanitized : fallback
  const ext = path.extname(safeName).toLowerCase()

  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    throw new Error('Formato de archivo no soportado')
  }

  return safeName
}

export function resolveMediaPath(parts: string[]) {
  const mediaDir = getMediaDir()
  const decodedParts = parts.map((part) => decodeURIComponent(part))
  const relativePath = path.join(...decodedParts)
  const absolutePath = path.resolve(mediaDir, relativePath)

  if (!absolutePath.startsWith(mediaDir + path.sep) && absolutePath !== mediaDir) {
    return null
  }

  return absolutePath
}

export function getMediaPublicUrl(filename: string) {
  return `/media/${encodeURIComponent(filename)}`
}

export function getMediaContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

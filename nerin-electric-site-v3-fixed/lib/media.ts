import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { getStorageDir } from '@/lib/content'

const ALLOWED_FILE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.svg',
  '.gif',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
])

export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf',
])

export const MAX_UPLOAD_FILE_SIZE_BYTES = 10 * 1024 * 1024

export type StoredMediaFile = {
  originalName: string
  mimeType: string
  size: number
  storedPath: string
  publicUrl: string
}

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

  if (!ALLOWED_FILE_EXTENSIONS.has(ext)) {
    throw new Error('Formato de archivo no soportado')
  }

  return safeName
}

export function sanitizeMediaFolder(folder: string | null | undefined) {
  const value = (folder ?? '').trim()
  if (!value) return ''
  const cleaned = value.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '')
  return cleaned
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
  return `/media/${filename.split('/').map((part) => encodeURIComponent(part)).join('/')}`
}

export async function storeMediaFile({
  file,
  folder,
  preferredName,
}: {
  file: File
  folder?: string
  preferredName?: string
}): Promise<StoredMediaFile> {
  if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
    throw new Error(`El archivo ${file.name} no tiene un formato permitido.`)
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    throw new Error(`El archivo ${file.name} supera el máximo de 10 MB.`)
  }

  const safeFolder = sanitizeMediaFolder(folder)
  const originalName = preferredName ?? file.name ?? 'archivo'
  const safeName = sanitizeMediaFilename(originalName)
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`
  const relativePath = safeFolder ? path.posix.join(safeFolder, uniqueName) : uniqueName
  const absolutePath = path.join(getMediaDir(), relativePath)

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  const arrayBuffer = await file.arrayBuffer()
  fs.writeFileSync(absolutePath, Buffer.from(arrayBuffer))

  return {
    originalName: originalName,
    mimeType: file.type,
    size: file.size,
    storedPath: relativePath,
    publicUrl: getMediaPublicUrl(relativePath),
  }
}

export function toPublicMediaUrl(storedPath: string) {
  if (!storedPath) return ''
  if (storedPath.startsWith('http://') || storedPath.startsWith('https://')) return storedPath
  if (storedPath.startsWith('/media/') || storedPath.startsWith('/uploads/')) return storedPath
  return getMediaPublicUrl(storedPath)
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
    case '.gif':
      return 'image/gif'
    case '.pdf':
      return 'application/pdf'
    case '.doc':
      return 'application/msword'
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case '.xls':
      return 'application/vnd.ms-excel'
    case '.xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    default:
      return 'application/octet-stream'
  }
}

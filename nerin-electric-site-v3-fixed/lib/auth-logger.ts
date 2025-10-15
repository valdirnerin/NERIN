import type { LoggerInstance } from '@auth/core/types'

import { sanitizeError, sanitizeMetadata } from './logging'

type ErrorWithOptionalCause = Error & { cause?: unknown }

type MetadataRecord = Record<string, unknown>

function extractErrorMetadata(error: ErrorWithOptionalCause) {
  if (typeof error.cause === 'undefined') {
    return undefined
  }

  const causeRecord: MetadataRecord = { cause: error.cause }
  return sanitizeMetadata(causeRecord)
}

function toMetadataRecord(metadata: unknown): MetadataRecord | undefined {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return undefined
  }

  return metadata as MetadataRecord
}

export const authLogger: LoggerInstance = {
  error(error) {
    const metadata = extractErrorMetadata(error as ErrorWithOptionalCause)

    console.error('[AUTH] Logger error', {
      error: sanitizeError(error),
      ...(metadata ? { metadata } : {}),
    })
  },
  warn(code) {
    console.warn('[AUTH] Logger warn', { code })
  },
  debug(message, metadata) {
    if (process.env.NODE_ENV === 'production') {
      return
    }

    const metadataRecord = toMetadataRecord(metadata)

    console.debug('[AUTH] Logger debug', {
      message,
      metadata: sanitizeMetadata(metadataRecord),
    })
  },
}

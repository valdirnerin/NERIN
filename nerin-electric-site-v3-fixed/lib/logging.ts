type SanitizedError = {
  name: string
  message: string
  stack?: string
}

export function sanitizeError(error: unknown): SanitizedError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack ?? undefined : undefined,
    }
  }

  return {
    name: 'UnknownError',
    message: typeof error === 'string' ? error : JSON.stringify(error),
  }
}

const sensitiveKeywords = ['secret', 'token', 'cookie', 'authorization']

type Metadata = Record<string, unknown> | undefined

export function sanitizeMetadata(metadata: Metadata) {
  if (!metadata) {
    return undefined
  }

  return Object.entries(metadata).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value instanceof Error) {
      acc[key] = sanitizeError(value)
      return acc
    }

    if (typeof value === 'string') {
      const lowerKey = key.toLowerCase()
      if (sensitiveKeywords.some((keyword) => lowerKey.includes(keyword))) {
        acc[key] = '[redacted]'
        return acc
      }
      acc[key] = value
      return acc
    }

    if (Array.isArray(value)) {
      acc[key] = value.map((item) => (item instanceof Error ? sanitizeError(item) : item))
      return acc
    }

    if (value && typeof value === 'object') {
      acc[key] = '[object]'
      return acc
    }

    acc[key] = value as unknown
    return acc
  }, {})
}

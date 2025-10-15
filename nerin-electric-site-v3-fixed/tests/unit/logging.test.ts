import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authLogger } from '@/lib/auth-logger'
import { sanitizeError, sanitizeMetadata } from '@/lib/logging'

describe('sanitizeError', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('sanitizes Error instances including stack in development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const error = new Error('Something went wrong')
    error.stack = 'stack-trace'

    expect(sanitizeError(error)).toEqual({
      name: 'Error',
      message: 'Something went wrong',
      stack: 'stack-trace',
    })
  })

  it('sanitizes unknown values as strings', () => {
    vi.stubEnv('NODE_ENV', 'production')

    expect(sanitizeError('unexpected')).toEqual({
      name: 'UnknownError',
      message: 'unexpected',
    })
  })
})

describe('sanitizeMetadata', () => {
  it('redacts sensitive keys and sanitizes nested errors', () => {
    const metadata = sanitizeMetadata({
      token: 'abc123',
      error: new Error('boom'),
      list: [new Error('list error'), 'safe'],
      nested: { value: 'should-be-object' },
    })

    expect(metadata).toEqual({
      token: '[redacted]',
      error: {
        name: 'Error',
        message: 'boom',
        stack: undefined,
      },
      list: [
        {
          name: 'Error',
          message: 'list error',
          stack: undefined,
        },
        'safe',
      ],
      nested: '[object]',
    })
  })
})

describe('authLogger', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('logs sanitized errors including metadata when available', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const cause = new Error('Database unavailable')
    const error = new Error('Authentication failed')
    ;(error as Error & { cause?: Error }).cause = cause

    const sanitizedError = sanitizeError(error)
    const sanitizedMetadata = sanitizeMetadata({ cause })

    authLogger.error(error)

    expect(errorSpy).toHaveBeenCalledWith('[AUTH] Logger error', {
      error: sanitizedError,
      metadata: sanitizedMetadata,
    })
  })

  it('logs warnings with their code', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    authLogger.warn('debug-enabled')

    expect(warnSpy).toHaveBeenCalledWith('[AUTH] Logger warn', { code: 'debug-enabled' })
  })

  it('logs debug information outside production with sanitized metadata', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

    const detailsError = new Error('details')

    authLogger.debug('checking something', {
      secret: 'value',
      info: detailsError,
    })

    expect(debugSpy).toHaveBeenCalledWith('[AUTH] Logger debug', {
      message: 'checking something',
      metadata: {
        secret: '[redacted]',
        info: sanitizeError(detailsError),
      },
    })
  })

  it('does not log debug information in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})

    authLogger.debug('should not log', { anything: 'here' })

    expect(debugSpy).not.toHaveBeenCalled()
  })
})

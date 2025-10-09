import crypto from 'node:crypto'

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export function verifyCsrfToken(token?: string | null, sessionToken?: string | null) {
  if (!token || !sessionToken) return false
  const [tokenValue, tokenHash] = token.split(':')
  if (!tokenValue || !tokenHash) return false
  const checkHash = crypto.createHmac('sha256', sessionToken).update(tokenValue).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(tokenHash), Buffer.from(checkHash))
}

export function generateCsrfToken(sessionToken: string) {
  const nonce = crypto.randomUUID()
  const hash = crypto.createHmac('sha256', sessionToken).update(nonce).digest('hex')
  return `${nonce}:${hash}`
}

export function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const entry = rateLimitMap.get(ip)
  const now = Date.now()
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return true
  }
  if (now - entry.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return true
  }
  if (entry.count >= limit) {
    return false
  }
  entry.count += 1
  return true
}

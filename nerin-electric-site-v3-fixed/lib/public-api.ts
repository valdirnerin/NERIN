import { headers } from 'next/headers'

export function getPublicBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  try {
    const headerList = headers()
    const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'localhost:3000'
    const protocol = headerList.get('x-forwarded-proto') ?? 'http'
    return `${protocol}://${host}`
  } catch (error) {
    return 'http://localhost:3000'
  }
}

export async function fetchPublicJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getPublicBaseUrl()
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Public API request failed: ${path}`)
  }

  return (await response.json()) as T
}

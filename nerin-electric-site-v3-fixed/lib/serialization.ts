export function serializeStringArray(values: string[]): string {
  return JSON.stringify(values)
}

export function parseStringArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : []
  } catch (error) {
    console.warn('[serialization] No se pudo parsear un array de strings', error)
    return []
  }
}

export function serializeJson(value: unknown): string {
  return JSON.stringify(value ?? {})
}

export function parseJson<T>(value: string | null | undefined): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.warn('[serialization] No se pudo parsear JSON', error)
    return null
  }
}

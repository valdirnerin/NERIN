import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

type CapiPayload = {
  event_name?: string
  event_time?: number
  event_id?: string
  value?: number
  currency?: string
  page_url?: string
  user_data?: {
    email?: string
    phone?: string
  }
}

function normalizeString(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

function hashValue(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function buildUserData(payload: CapiPayload['user_data'], request: Request) {
  const userData: Record<string, string> = {}

  if (payload?.email) {
    userData.em = hashValue(normalizeString(payload.email))
  }

  if (payload?.phone) {
    const normalizedPhone = normalizePhone(payload.phone)
    if (normalizedPhone) {
      userData.ph = hashValue(normalizedPhone)
    }
  }

  const userAgent = request.headers.get('user-agent')
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip')

  if (userAgent) {
    userData.client_user_agent = userAgent
  }

  if (ip) {
    userData.client_ip_address = ip
  }

  return userData
}

export async function POST(request: Request) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID

  if (!accessToken || !pixelId) {
    console.warn('[TRACKING] Missing Meta CAPI configuration')
    return NextResponse.json({ ok: false, reason: 'missing_config' })
  }

  let payload: CapiPayload
  try {
    payload = (await request.json()) as CapiPayload
  } catch (error) {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  if (!payload.event_name || !payload.event_id) {
    return NextResponse.json({ ok: false, reason: 'missing_required_fields' }, { status: 400 })
  }

  const eventTime = payload.event_time ?? Math.floor(Date.now() / 1000)
  const userData = buildUserData(payload.user_data, request)
  const eventSourceUrl = payload.page_url || request.headers.get('referer') || undefined

  const body = {
    data: [
      {
        event_name: payload.event_name,
        event_time: eventTime,
        event_id: payload.event_id,
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: {
          value: payload.value,
          currency: payload.currency,
        },
      },
    ],
    ...(process.env.META_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE }
      : {}),
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    const data = await response.json()
    if (!response.ok) {
      console.warn('[TRACKING] Meta CAPI error', data)
    }
    return NextResponse.json({ ok: response.ok, data })
  } catch (error) {
    console.warn('[TRACKING] Meta CAPI request failed', error)
    return NextResponse.json({ ok: false, reason: 'request_failed' }, { status: 200 })
  }
}

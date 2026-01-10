import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const metaPixelId = process.env.META_PIXEL_ID
  const metaToken = process.env.META_CAPI_TOKEN

  if (!metaPixelId || !metaToken) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const eventPayload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: payload.eventSourceUrl ?? payload.landingPage,
        user_data: payload.userData ?? {},
        custom_data: payload.customData ?? {},
      },
    ],
  }

  const response = await fetch(`https://graph.facebook.com/v17.0/${metaPixelId}/events?access_token=${metaToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayload),
  })

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: 'CAPI request failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

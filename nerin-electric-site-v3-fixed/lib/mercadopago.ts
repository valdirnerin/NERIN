type PreferenceRequest = {
  title: string
  amount: number
  externalRef: string
  backUrls: { success: string; failure: string; pending: string }
  notificationUrl: string
}

type PreferenceResponse = {
  preferenceId: string
  initPoint: string
}

export async function createPreference({
  title,
  amount,
  externalRef,
  backUrls,
  notificationUrl,
}: PreferenceRequest): Promise<PreferenceResponse> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN missing')
  }

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          title,
          quantity: 1,
          unit_price: amount,
        },
      ],
      external_reference: externalRef,
      notification_url: notificationUrl,
      back_urls: backUrls,
      auto_return: 'approved',
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Mercado Pago error: ${response.status} ${errorBody}`)
  }

  const data = await response.json()
  return {
    preferenceId: data.id,
    initPoint: data.init_point,
  }
}

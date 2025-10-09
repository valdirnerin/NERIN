import MercadoPago from 'mercadopago'

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

export const mpClient = new MercadoPago({
  accessToken: accessToken || '',
})

type PreferenceItem = {
  title: string
  quantity: number
  unit_price: number
}

export async function createPreference({
  items,
  statementDescriptor,
  externalReference,
  notificationUrl,
  backUrls,
}: {
  items: PreferenceItem[]
  statementDescriptor: string
  externalReference: string
  notificationUrl: string
  backUrls: { success: string; failure: string; pending: string }
}) {
  if (!accessToken) {
    return {
      id: `mock-${externalReference}`,
      init_point: '#',
    }
  }

  const preference = await mpClient.preferences.create({
    body: {
      items,
      statement_descriptor: statementDescriptor,
      external_reference: externalReference,
      notification_url: notificationUrl,
      back_urls: backUrls,
      auto_return: 'approved',
    },
  })

  return preference
}

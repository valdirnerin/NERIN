import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'

export async function GET() {
  const store = getContentStore()
  const services = await store.listServices()
  return NextResponse.json(services.filter((service) => service.active))
}

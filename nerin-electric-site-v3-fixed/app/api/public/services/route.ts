import { NextResponse } from 'next/server'
import { mockServices } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json(mockServices.filter((service) => service.active))
}

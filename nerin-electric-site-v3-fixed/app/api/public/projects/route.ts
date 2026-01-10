import { NextResponse } from 'next/server'
import { getContentStore } from '@/lib/content-store'

export async function GET() {
  const store = getContentStore()
  const projects = await store.listProjects()
  return NextResponse.json(projects)
}

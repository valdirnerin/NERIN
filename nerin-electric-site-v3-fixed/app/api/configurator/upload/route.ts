import { NextResponse } from 'next/server'
import { storeMediaFile } from '@/lib/media'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const files = form.getAll('files').filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (files.length === 0) {
      return NextResponse.json({ error: 'No se recibieron archivos.' }, { status: 400 })
    }

    const stored = await Promise.all(
      files.map((file) =>
        storeMediaFile({
          file,
          folder: 'configurator',
          preferredName: file.name,
        }),
      ),
    )

    return NextResponse.json({
      ok: true,
      files: stored.map((file) => ({
        originalName: file.originalName,
        publicUrl: file.publicUrl,
        size: file.size,
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudieron subir los archivos.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

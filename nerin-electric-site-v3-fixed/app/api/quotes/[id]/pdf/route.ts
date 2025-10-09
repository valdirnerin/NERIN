import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQuotePdf } from '@/lib/pdf'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const quote = await prisma.configuratorQuote.findUnique({
    where: { id: params.id },
    include: {
      configuratorQuoteItems: true,
      pack: true,
    },
  })

  if (!quote) {
    return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 })
  }

  const pdf = generateQuotePdf({ quote, pack: quote.pack })

  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    pdf.on('data', (chunk) => chunks.push(chunk))
    pdf.on('end', () => {
      const buffer = Buffer.concat(chunks)
      resolve(
        new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="nerin-presupuesto-${quote.id}.pdf"`,
          },
        }),
      )
    })
    pdf.on('error', (error) => reject(error))
  })
}

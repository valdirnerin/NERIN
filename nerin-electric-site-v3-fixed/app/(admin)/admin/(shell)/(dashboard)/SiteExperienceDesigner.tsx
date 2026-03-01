
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteExperience } from '@/types/site'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminMediaField } from '@/components/admin/AdminMediaField'
import { Button } from '@/components/ui/button'

interface SiteExperienceDesignerProps {
  initialData: SiteExperience
}

type MessageState = { type: 'success' | 'error'; message: string } | null

type PairKey = 'label' | 'title'

function parsePairs(value: string): Array<{ label: string; description: string }>
function parsePairs(value: string, key: 'label'): Array<{ label: string; description: string }>
function parsePairs(value: string, key: 'title'): Array<{ title: string; description: string }>
function parsePairs(value: string, key: PairKey = 'label') {
  const pairs = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawLabel, ...rest] = line.split('|')
      const description = rest.join('|').trim()
      const entry = rawLabel.trim()
      if (!entry || !description) {
        return null
      }
      return { entry, description }
    })
    .filter((item): item is { entry: string; description: string } => item !== null)

  if (key === 'label') {
    return pairs.map(({ entry, description }) => ({ label: entry, description }))
  }

  return pairs.map(({ entry, description }) => ({ title: entry, description }))
}

function parseList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function formatPairs(items: Array<{ label: string; description: string }>): string
function formatPairs(items: Array<{ label: string; description: string }>, key: 'label'): string
function formatPairs(items: Array<{ title: string; description: string }>, key: 'title'): string
function formatPairs(
  items: Array<{ label: string; description: string }> | Array<{ title: string; description: string }>,
  key: PairKey = 'label',
): string {
  if (key === 'label') {
    return (items as Array<{ label: string; description: string }>)
      .map((item) => `${item.label} | ${item.description}`)
      .join('\n')
  }

  return (items as Array<{ title: string; description: string }>)
    .map((item) => `${item.title} | ${item.description}`)
    .join('\n')
}

function formatList(items: string[]): string {
  return items.join('\n')
}

export function SiteExperienceDesigner({ initialData }: SiteExperienceDesignerProps) {
  const router = useRouter()
  const [form, setForm] = useState<SiteExperience>(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<MessageState>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [logoNeedsSave, setLogoNeedsSave] = useState(false)

  const heroStatsText = useMemo(() => formatPairs(form.hero.stats), [form.hero.stats])
  const heroHighlightsText = useMemo(() => formatPairs(form.hero.highlights, 'title'), [form.hero.highlights])
  const servicesText = useMemo(() => formatPairs(form.services.items, 'title'), [form.services.items])
  const faqText = useMemo(
    () => form.faq.items.map((item) => `${item.question} | ${item.answer}`).join('\n'),
    [form.faq.items],
  )
  const maintenanceCardsText = useMemo(() => formatPairs(form.maintenance.cards, 'title'), [form.maintenance.cards])
  const maintenancePageCardsText = useMemo(
    () => formatPairs(form.maintenancePage.cards, 'title'),
    [form.maintenancePage.cards],
  )
  const responsiveText = useMemo(() => formatList(form.responsive.bulletPoints), [form.responsive.bulletPoints])
  const secondaryPhonesText = useMemo(() => form.contact.secondaryPhones.join('\n'), [form.contact.secondaryPhones])
  const seoKeywordsText = useMemo(() => form.seo.keywords.join(', '), [form.seo.keywords])

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl)
      }
    }
  }, [logoPreviewUrl])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        throw new Error('No se pudo guardar la configuración')
      }
      const payload = (await response.json()) as { ok: boolean; site?: SiteExperience }
      if (payload.site) {
        setForm(payload.site)
      }
      setLogoNeedsSave(false)
      setMessage({ type: 'success', message: 'Configuración guardada correctamente.' })
      router.refresh()
    } catch (error) {
      console.error('Error saving site configuration', error)
      setMessage({ type: 'error', message: 'Ocurrió un error al guardar. Intentá nuevamente.' })
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setForm(initialData)
    setLogoUploadError(null)
    setLogoNeedsSave(false)
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl)
      setLogoPreviewUrl(null)
    }
    setMessage(null)
  }

  async function handleLogoUpload(file: File) {
    setLogoUploading(true)
    setLogoUploadError(null)

    const localPreview = URL.createObjectURL(file)
    setLogoPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }
      return localPreview
    })

    try {
      const formData = new FormData()
      const filename = `logo-${file.name}`
      formData.append('file', file)
      formData.append('name', filename)
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as { ok?: boolean; url?: string; error?: string }
      if (!response.ok) {
        throw new Error(payload.error || 'No se pudo subir el logo')
      }

      const url = payload.url
      if (typeof url !== 'string' || url.trim().length === 0) {
        throw new Error('Respuesta inválida al subir el logo')
      }

      setForm((prev) => ({
        ...prev,
        logo: { ...prev.logo, imageUrl: url },
      }))
      setLogoNeedsSave(true)
    } catch (error) {
      console.error('Error uploading logo', error)
      const message = error instanceof Error ? error.message : 'No se pudo subir el logo. Intentá nuevamente.'
      setLogoUploadError(message)
    } finally {
      setLogoUploading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground">Diseñador de experiencia del sitio</h2>
        <p className="text-sm text-slate-600">
          Editá textos, mensajes clave, datos de contacto y contenido destacado del home, blog, obras y mantenimiento.
          Cada cambio se guarda en el CMS (Postgres o file store) y actualiza el sitio completo.
        </p>
        {message && (
          <p
            className={`text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}
            role="status"
          >
            {message.message}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
          <CardTitle>Identidad y contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="site-logo-title">Texto principal del logo</Label>
              <Input
                id="site-logo-title"
                value={form.logo.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    logo: { ...prev.logo, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-logo-subtitle">Texto secundario del logo</Label>
              <Input
                id="site-logo-subtitle"
                value={form.logo.subtitle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    logo: { ...prev.logo, subtitle: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-logo-file">Logo (archivo)</Label>
              <Input
                id="site-logo-file"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    void handleLogoUpload(file)
                  }
                }}
              />
              <p className="text-xs text-slate-500">Formatos recomendados: PNG o SVG. Tamaño sugerido: 256×256.</p>
              {logoUploading && <p className="text-xs text-slate-500">Subiendo logo...</p>}
              {logoUploadError && <p className="text-xs text-red-600">{logoUploadError}</p>}
              {logoNeedsSave && <p className="text-xs text-amber-600">Logo cargado, falta guardar cambios.</p>}
              {(logoPreviewUrl || form.logo.imageUrl) && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Vista previa del logo:</span>
                  <img
                    src={logoPreviewUrl ?? form.logo.imageUrl ?? undefined}
                    alt="Logo cargado"
                    className="h-10 w-10 rounded-md border border-border bg-white object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (logoPreviewUrl) {
                        URL.revokeObjectURL(logoPreviewUrl)
                        setLogoPreviewUrl(null)
                      }
                      setLogoNeedsSave(true)
                      setLogoUploadError(null)
                      setForm((prev) => ({
                        ...prev,
                        logo: { ...prev.logo, imageUrl: '' },
                      }))
                    }}
                  >
                    Quitar logo
                  </Button>
                </div>
              )}

            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-name">Nombre comercial</Label>
              <Input
                id="site-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-tagline">Tagline</Label>
              <Textarea
                id="site-tagline"
                value={form.tagline}
                onChange={(event) => setForm((prev) => ({ ...prev, tagline: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-email">Correo principal</Label>
              <Input
                id="site-email"
                value={form.contact.email}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, email: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-phone">Teléfono principal</Label>
              <Input
                id="site-phone"
                value={form.contact.phone}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, phone: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-secondary-phones">Teléfonos alternativos (uno por línea)</Label>
              <Textarea
                id="site-secondary-phones"
                value={secondaryPhonesText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, secondaryPhones: parseList(event.target.value) },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-address">Dirección / Oficina técnica</Label>
              <Input
                id="site-address"
                value={form.contact.address}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, address: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-schedule">Horarios</Label>
              <Input
                id="site-schedule"
                value={form.contact.schedule}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, schedule: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-service-area">Área de cobertura</Label>
              <Input
                id="site-service-area"
                value={form.contact.serviceArea}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, serviceArea: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-whatsapp-number">WhatsApp (solo números)</Label>
              <Input
                id="site-whatsapp-number"
                value={form.contact.whatsappNumber}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, whatsappNumber: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-whatsapp-message">Mensaje inicial de WhatsApp</Label>
              <Textarea
                id="site-whatsapp-message"
                value={form.contact.whatsappMessage}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, whatsappMessage: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-instagram">Instagram</Label>
              <Input
                id="site-instagram"
                value={form.socials.instagram}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, instagram: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-linkedin">LinkedIn</Label>
              <Input
                id="site-linkedin"
                value={form.socials.linkedin}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socials: { ...prev.socials, linkedin: event.target.value },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero y propuesta de valor premium</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="hero-badge">Badge</Label>
              <Input
                id="hero-badge"
                value={form.hero.badge}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, badge: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-title">Título</Label>
              <Textarea
                id="hero-title"
                value={form.hero.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-subtitle">Subtítulo</Label>
              <Textarea
                id="hero-subtitle"
                value={form.hero.subtitle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: event.target.value },
                  }))
                }
              />
            </div>
            <AdminMediaField
              id="hero-background"
              label="Imagen de fondo"
              value={form.hero.backgroundImage}
              onChange={(next) =>
                setForm((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, backgroundImage: next },
                }))
              }
              uploadFolder="site/hero"
            />
            <div className="grid gap-2">
              <Label htmlFor="hero-caption">Leyenda de la imagen</Label>
              <Textarea
                id="hero-caption"
                value={form.hero.caption}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, caption: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-primary-label">CTA principal</Label>
              <Input
                id="hero-primary-label"
                value={form.hero.primaryCta.label}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      primaryCta: { ...prev.hero.primaryCta, label: event.target.value },
                    },
                  }))
                }
              />
              <Input
                placeholder="/contacto"
                value={form.hero.primaryCta.href}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      primaryCta: { ...prev.hero.primaryCta, href: event.target.value },
                    },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>CTA secundario</Label>
              <Input
                value={form.hero.secondaryCta.label}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      secondaryCta: { ...prev.hero.secondaryCta, label: event.target.value },
                    },
                  }))
                }
              />
              <Input
                placeholder="[whatsapp]"
                value={form.hero.secondaryCta.href}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      secondaryCta: { ...prev.hero.secondaryCta, href: event.target.value },
                    },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>CTA terciario</Label>
              <Input
                value={form.hero.tertiaryCta.label}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      tertiaryCta: { ...prev.hero.tertiaryCta, label: event.target.value },
                    },
                  }))
                }
              />
              <Input
                value={form.hero.tertiaryCta.href}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      tertiaryCta: { ...prev.hero.tertiaryCta, href: event.target.value },
                    },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-highlights">Highlights (Título | Descripción)</Label>
              <Textarea
                id="hero-highlights"
                value={heroHighlightsText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, highlights: parsePairs(event.target.value, 'title') },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero-stats">Stats (Título | Descripción)</Label>
              <Textarea
                id="hero-stats"
                value={heroStatsText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, stats: parsePairs(event.target.value) },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verticales, oferta destacada y sistema comercial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="services-title">Título de verticales principales</Label>
              <Input
                id="services-title"
                value={form.services.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    services: { ...prev.services, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="services-description">Mensaje corto de diferenciación</Label>
              <Textarea
                id="services-description"
                value={form.services.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    services: { ...prev.services, description: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="services-items">Mundos/verticales (Título | Descripción)</Label>
              <Textarea
                id="services-items"
                value={servicesText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    services: { ...prev.services, items: parsePairs(event.target.value, 'title') },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="packs-title">Título de anexo técnico</Label>
              <Input
                id="packs-title"
                value={form.packs.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    packs: { ...prev.packs, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="packs-description">Descripción de anexo técnico</Label>
              <Textarea
                id="packs-description"
                value={form.packs.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    packs: { ...prev.packs, description: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="packs-cta-label">CTA de anexo técnico</Label>
              <Input
                id="packs-cta-label"
                value={form.packs.ctaLabel}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    packs: { ...prev.packs, ctaLabel: event.target.value },
                  }))
                }
              />
              <Input
                placeholder="/presupuestador"
                value={form.packs.ctaHref}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    packs: { ...prev.packs, ctaHref: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="packs-note">Nota comercial del anexo</Label>
              <Textarea
                id="packs-note"
                value={form.packs.note}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    packs: { ...prev.packs, note: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-title">Título mantenimiento</Label>
              <Input
                id="maintenance-title"
                value={form.maintenance.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maintenance: { ...prev.maintenance, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-description">Descripción mantenimiento</Label>
              <Textarea
                id="maintenance-description"
                value={form.maintenance.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maintenance: { ...prev.maintenance, description: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-cards">Highlights mantenimiento (Título | Descripción)</Label>
              <Textarea
                id="maintenance-cards"
                value={maintenanceCardsText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maintenance: { ...prev.maintenance, cards: parsePairs(event.target.value, 'title') },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contenido editorial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="works-title">Título obras</Label>
              <Input
                id="works-title"
                value={form.works.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    works: { ...prev.works, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="works-description">Descripción obras</Label>
              <Textarea
                id="works-description"
                value={form.works.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    works: { ...prev.works, description: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="works-intro-title">Título página obras</Label>
              <Input
                id="works-intro-title"
                value={form.works.introTitle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    works: { ...prev.works, introTitle: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="works-intro-description">Descripción página obras</Label>
              <Textarea
                id="works-intro-description"
                value={form.works.introDescription}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    works: { ...prev.works, introDescription: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="blog-title">Título blog</Label>
              <Input
                id="blog-title"
                value={form.blog.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    blog: { ...prev.blog, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="blog-description">Descripción blog</Label>
              <Textarea
                id="blog-description"
                value={form.blog.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    blog: { ...prev.blog, description: event.target.value },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preguntas frecuentes y CTA final</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="faq-title">Título FAQ</Label>
              <Input
                id="faq-title"
                value={form.faq.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    faq: { ...prev.faq, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faq-description">Descripción FAQ</Label>
              <Textarea
                id="faq-description"
                value={form.faq.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    faq: { ...prev.faq, description: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faq-items">Preguntas (Pregunta | Respuesta)</Label>
              <Textarea
                id="faq-items"
                value={faqText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    faq: {
                      ...prev.faq,
                      items: event.target.value
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line) => {
                          const [question, ...rest] = line.split('|')
                          return { question: question.trim(), answer: rest.join('|').trim() }
                        })
                        .filter((item) => item.question && item.answer),
                    },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="closing-title">Título CTA final</Label>
              <Input
                id="closing-title"
                value={form.closingCta.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    closingCta: { ...prev.closingCta, title: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="closing-description">Descripción CTA final</Label>
              <Textarea
                id="closing-description"
                value={form.closingCta.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    closingCta: { ...prev.closingCta, description: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>CTA primario</Label>
              <Input
                value={form.closingCta.primary.label}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    closingCta: {
                      ...prev.closingCta,
                      primary: { ...prev.closingCta.primary, label: event.target.value },
                    },
                  }))
                }
              />
              <Input
                value={form.closingCta.primary.href}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    closingCta: {
                      ...prev.closingCta,
                      primary: { ...prev.closingCta.primary, href: event.target.value },
                    },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>CTA secundario</Label>
              <Input
                value={form.closingCta.secondary.label}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    closingCta: {
                      ...prev.closingCta,
                      secondary: { ...prev.closingCta.secondary, label: event.target.value },
                    },
                  }))
                }
              />
              <Input
                value={form.closingCta.secondary.href}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    closingCta: {
                      ...prev.closingCta,
                      secondary: { ...prev.closingCta.secondary, href: event.target.value },
                    },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Páginas de contacto y mantenimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-intro-title">Título contacto</Label>
              <Input
                id="contact-intro-title"
                value={form.contactPage.introTitle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contactPage: { ...prev.contactPage, introTitle: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-intro-description">Descripción contacto</Label>
              <Textarea
                id="contact-intro-description"
                value={form.contactPage.introDescription}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contactPage: { ...prev.contactPage, introDescription: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-bullets">Diferenciales contacto (uno por línea)</Label>
              <Textarea
                id="contact-bullets"
                value={formatList(form.contactPage.highlightBullets)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contactPage: { ...prev.contactPage, highlightBullets: parseList(event.target.value) },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-typeform">Enlace Typeform</Label>
              <Input
                id="contact-typeform"
                value={form.contactPage.typeformUrl}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contactPage: { ...prev.contactPage, typeformUrl: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-page-cards">Sección mantenimiento (Título | Descripción)</Label>
              <Textarea
                id="maintenance-page-cards"
                value={maintenancePageCardsText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maintenancePage: { ...prev.maintenancePage, cards: parsePairs(event.target.value, 'title') },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsive y SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="responsive-headline">Headline responsive</Label>
              <Input
                id="responsive-headline"
                value={form.responsive.headline}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    responsive: { ...prev.responsive, headline: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responsive-bullets">Notas responsive (una por línea)</Label>
              <Textarea
                id="responsive-bullets"
                value={responsiveText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    responsive: { ...prev.responsive, bulletPoints: parseList(event.target.value) },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seo-title">Título SEO</Label>
              <Input
                id="seo-title"
                value={form.seo.metaTitle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seo-description">Descripción SEO</Label>
              <Textarea
                id="seo-description"
                value={form.seo.metaDescription}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: event.target.value },
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seo-keywords">Keywords (separadas por coma)</Label>
              <Textarea
                id="seo-keywords"
                value={seoKeywordsText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      keywords: event.target.value
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset} disabled={saving}>
          Revertir cambios
        </Button>
      </div>
    </section>
  )
}

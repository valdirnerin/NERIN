import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { prisma } from '@/lib/db'
import { isMissingTableError } from '@/lib/prisma-errors'
import { DB_ENABLED } from '@/lib/dbMode'
import { parseJson, parseStringArray, serializeJson, serializeStringArray } from '@/lib/serialization'
import type { SiteExperience } from '@/types/site'
import { getStorageDir, SITE_DEFAULTS } from '@/lib/content'

export type ContentSettings = {
  id?: string
  companyName: string
  industry: string
  whatsappNumber: string
  whatsappMessage: string
  emailContacto: string
  zone: string
  schedule: string
  primaryCopy: string
  metrics: Array<{ label: string; value: string }>
  siteExperience: SiteExperience
}

export type ContentPage = {
  id?: string
  slug: string
  title: string
  description?: string | null
  sections: Array<Record<string, unknown>>
  seoTitle?: string | null
  seoDescription?: string | null
}

export type ContentService = {
  id?: string
  title: string
  description: string
  order: number
  active: boolean
}

export type PortfolioProject = {
  id?: string
  title: string
  description: string
  tags: string[]
  locationText?: string | null
  images: string[]
}

export type ContentPost = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  publishedAt?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

export type LeadPayload = {
  name: string
  phone: string
  email: string
  clientType: string
  location: string
  address?: string | null
  workType: string
  urgency: string
  details: string
  reason?: string | null
  leadType?: string | null
  plan?: string | null
  hasFiles?: boolean
  consent: boolean
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmTerm?: string | null
  utmContent?: string | null
  fbclid?: string | null
  gclid?: string | null
  landingPage?: string | null
  referrer?: string | null
}

export interface ContentStore {
  getSettings(): Promise<ContentSettings>
  saveSettings(settings: ContentSettings): Promise<void>
  listPages(): Promise<ContentPage[]>
  getPage(slug: string): Promise<ContentPage | null>
  upsertPage(page: ContentPage): Promise<ContentPage>
  deletePage(id: string): Promise<void>
  listServices(): Promise<ContentService[]>
  upsertService(service: ContentService): Promise<ContentService>
  deleteService(id: string): Promise<void>
  listProjects(): Promise<PortfolioProject[]>
  upsertProject(project: PortfolioProject): Promise<PortfolioProject>
  deleteProject(id: string): Promise<void>
  listPosts(): Promise<ContentPost[]>
  getPost(slug: string): Promise<ContentPost | null>
  upsertPost(post: ContentPost): Promise<ContentPost>
  deletePost(id: string): Promise<void>
  createLead(payload: LeadPayload): Promise<LeadPayload & { id: string }>
}

const memoryStore = (() => {
  let settings: ContentSettings = {
    companyName: SITE_DEFAULTS.name,
    industry: 'Instalaciones eléctricas',
    whatsappNumber: SITE_DEFAULTS.contact.whatsappNumber,
    whatsappMessage: SITE_DEFAULTS.contact.whatsappMessage,
    emailContacto: SITE_DEFAULTS.contact.email,
    zone: SITE_DEFAULTS.contact.serviceArea,
    schedule: SITE_DEFAULTS.contact.schedule,
    primaryCopy: SITE_DEFAULTS.tagline,
    metrics: SITE_DEFAULTS.trust.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
    siteExperience: SITE_DEFAULTS,
  }
  let pages: ContentPage[] = []
  let services: ContentService[] = []
  let projects: PortfolioProject[] = []
  let posts: ContentPost[] = []
  let leads: Array<LeadPayload & { id: string }> = []

  return {
    getSettings: async () => settings,
    saveSettings: async (nextSettings: ContentSettings) => {
      settings = nextSettings
    },
    listPages: async () => pages,
    getPage: async (slug: string) => pages.find((page) => page.slug === slug) ?? null,
    upsertPage: async (page: ContentPage) => {
      const id = page.id ?? crypto.randomUUID()
      const next = { ...page, id }
      pages = pages.filter((item) => item.id !== id)
      pages.push(next)
      return next
    },
    deletePage: async (id: string) => {
      pages = pages.filter((item) => item.id !== id)
    },
    listServices: async () => services,
    upsertService: async (service: ContentService) => {
      const id = service.id ?? crypto.randomUUID()
      const next = { ...service, id }
      services = services.filter((item) => item.id !== id)
      services.push(next)
      return next
    },
    deleteService: async (id: string) => {
      services = services.filter((item) => item.id !== id)
    },
    listProjects: async () => projects,
    upsertProject: async (project: PortfolioProject) => {
      const id = project.id ?? crypto.randomUUID()
      const next = { ...project, id }
      projects = projects.filter((item) => item.id !== id)
      projects.push(next)
      return next
    },
    deleteProject: async (id: string) => {
      projects = projects.filter((item) => item.id !== id)
    },
    listPosts: async () => posts,
    getPost: async (slug: string) => posts.find((post) => post.slug === slug) ?? null,
    upsertPost: async (post: ContentPost) => {
      const id = post.id ?? crypto.randomUUID()
      const next = { ...post, id }
      posts = posts.filter((item) => item.id !== id)
      posts.push(next)
      return next
    },
    deletePost: async (id: string) => {
      posts = posts.filter((item) => item.id !== id)
    },
    createLead: async (payload: LeadPayload) => {
      const lead = { id: crypto.randomUUID(), ...payload }
      leads = leads.concat(lead)
      return lead
    },
  } satisfies ContentStore
})()

const contentDir = process.env.CONTENT_DIR || path.join(getStorageDir(), 'content')

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(contentDir, filename)
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch (error) {
    return fallback
  }
}

async function writeJsonFile(filename: string, data: unknown) {
  const filePath = path.join(contentDir, filename)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

function buildFileStore(): ContentStore {
  return {
    getSettings: async () => {
      const stored = await readJsonFile<ContentSettings | null>('settings.json', null)
      if (stored) {
        return stored
      }
      return memoryStore.getSettings()
    },
    saveSettings: async (settings: ContentSettings) => {
      await writeJsonFile('settings.json', settings)
    },
    listPages: async () => readJsonFile<ContentPage[]>('pages.json', []),
    getPage: async (slug: string) => {
      const pages = await readJsonFile<ContentPage[]>('pages.json', [])
      return pages.find((page) => page.slug === slug) ?? null
    },
    upsertPage: async (page: ContentPage) => {
      const pages = await readJsonFile<ContentPage[]>('pages.json', [])
      const id = page.id ?? crypto.randomUUID()
      const next = { ...page, id }
      const updated = pages.filter((item) => item.id !== id).concat(next)
      await writeJsonFile('pages.json', updated)
      return next
    },
    deletePage: async (id: string) => {
      const pages = await readJsonFile<ContentPage[]>('pages.json', [])
      await writeJsonFile(
        'pages.json',
        pages.filter((item) => item.id !== id),
      )
    },
    listServices: async () => readJsonFile<ContentService[]>('services.json', []),
    upsertService: async (service: ContentService) => {
      const services = await readJsonFile<ContentService[]>('services.json', [])
      const id = service.id ?? crypto.randomUUID()
      const next = { ...service, id }
      const updated = services.filter((item) => item.id !== id).concat(next)
      await writeJsonFile('services.json', updated)
      return next
    },
    deleteService: async (id: string) => {
      const services = await readJsonFile<ContentService[]>('services.json', [])
      await writeJsonFile(
        'services.json',
        services.filter((item) => item.id !== id),
      )
    },
    listProjects: async () => readJsonFile<PortfolioProject[]>('projects.json', []),
    upsertProject: async (project: PortfolioProject) => {
      const projects = await readJsonFile<PortfolioProject[]>('projects.json', [])
      const id = project.id ?? crypto.randomUUID()
      const next = { ...project, id }
      const updated = projects.filter((item) => item.id !== id).concat(next)
      await writeJsonFile('projects.json', updated)
      return next
    },
    deleteProject: async (id: string) => {
      const projects = await readJsonFile<PortfolioProject[]>('projects.json', [])
      await writeJsonFile(
        'projects.json',
        projects.filter((item) => item.id !== id),
      )
    },
    listPosts: async () => readJsonFile<ContentPost[]>('posts.json', []),
    getPost: async (slug: string) => {
      const posts = await readJsonFile<ContentPost[]>('posts.json', [])
      return posts.find((post) => post.slug === slug) ?? null
    },
    upsertPost: async (post: ContentPost) => {
      const posts = await readJsonFile<ContentPost[]>('posts.json', [])
      const id = post.id ?? crypto.randomUUID()
      const next = { ...post, id }
      const updated = posts.filter((item) => item.id !== id).concat(next)
      await writeJsonFile('posts.json', updated)
      return next
    },
    deletePost: async (id: string) => {
      const posts = await readJsonFile<ContentPost[]>('posts.json', [])
      await writeJsonFile(
        'posts.json',
        posts.filter((item) => item.id !== id),
      )
    },
    createLead: async (payload: LeadPayload) => {
      const leads = await readJsonFile<Array<LeadPayload & { id: string }>>('leads.json', [])
      const lead = { id: crypto.randomUUID(), ...payload }
      await writeJsonFile('leads.json', leads.concat(lead))
      return lead
    },
  }
}

function handleMissingTable(error: unknown, table: string, fallback: string): boolean {
  if (!isMissingTableError(error)) {
    return false
  }
  console.warn(`[DB] Missing table ${table}, ${fallback}`)
  return true
}

function buildPrismaStore(): ContentStore {
  return {
    getSettings: async () => {
      try {
        const record = await prisma.siteSetting.findFirst()
        if (!record) {
          return memoryStore.getSettings()
        }

        const siteExperience = parseJson<SiteExperience>(record.siteExperience) ?? SITE_DEFAULTS
        const metrics = parseJson<Array<{ label: string; value: string }>>(record.metrics) ?? []

        return {
          id: record.id,
          companyName: record.companyName,
          industry: record.industry,
          whatsappNumber: record.whatsappNumber,
          whatsappMessage: record.whatsappMessage,
          emailContacto: record.emailContacto,
          zone: record.zone,
          schedule: record.schedule,
          primaryCopy: record.primaryCopy,
          metrics,
          siteExperience,
        }
      } catch (error) {
        if (handleMissingTable(error, 'SiteSetting', 'returning defaults')) {
          return memoryStore.getSettings()
        }
        throw error
      }
    },
    saveSettings: async (settings: ContentSettings) => {
      const data = {
        companyName: settings.companyName,
        industry: settings.industry,
        whatsappNumber: settings.whatsappNumber,
        whatsappMessage: settings.whatsappMessage,
        emailContacto: settings.emailContacto,
        zone: settings.zone,
        schedule: settings.schedule,
        primaryCopy: settings.primaryCopy,
        metrics: serializeJson(settings.metrics),
        siteExperience: serializeJson(settings.siteExperience),
      }
      try {
        if (settings.id) {
          await prisma.siteSetting.update({ where: { id: settings.id }, data })
          return
        }
        await prisma.siteSetting.create({ data })
      } catch (error) {
        if (handleMissingTable(error, 'SiteSetting', 'saving to memory store')) {
          await memoryStore.saveSettings(settings)
          return
        }
        throw error
      }
    },
    listPages: async () => {
      try {
        const pages = await prisma.contentPage.findMany({ orderBy: { updatedAt: 'desc' } })
        return pages.map((page) => ({
          id: page.id,
          slug: page.slug,
          title: page.title,
          description: page.description,
          sections: parseJson<Array<Record<string, unknown>>>(page.sections) ?? [],
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
        }))
      } catch (error) {
        if (handleMissingTable(error, 'ContentPage', 'returning empty list')) {
          return []
        }
        throw error
      }
    },
    getPage: async (slug: string) => {
      try {
        const page = await prisma.contentPage.findUnique({ where: { slug } })
        if (!page) {
          return null
        }
        return {
          id: page.id,
          slug: page.slug,
          title: page.title,
          description: page.description,
          sections: parseJson<Array<Record<string, unknown>>>(page.sections) ?? [],
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
        }
      } catch (error) {
        if (handleMissingTable(error, 'ContentPage', 'returning null page')) {
          return null
        }
        throw error
      }
    },
    upsertPage: async (page: ContentPage) => {
      const data = {
        slug: page.slug,
        title: page.title,
        description: page.description ?? null,
        sections: serializeJson(page.sections),
        seoTitle: page.seoTitle ?? null,
        seoDescription: page.seoDescription ?? null,
      }
      try {
        if (page.id) {
          const updated = await prisma.contentPage.update({ where: { id: page.id }, data })
          return {
            id: updated.id,
            slug: updated.slug,
            title: updated.title,
            description: updated.description,
            sections: page.sections,
            seoTitle: updated.seoTitle,
            seoDescription: updated.seoDescription,
          }
        }
        const created = await prisma.contentPage.create({ data })
        return {
          id: created.id,
          slug: created.slug,
          title: created.title,
          description: created.description,
          sections: page.sections,
          seoTitle: created.seoTitle,
          seoDescription: created.seoDescription,
        }
      } catch (error) {
        if (handleMissingTable(error, 'ContentPage', 'returning draft page')) {
          return { ...page, id: page.id ?? crypto.randomUUID() }
        }
        throw error
      }
    },
    deletePage: async (id: string) => {
      try {
        await prisma.contentPage.delete({ where: { id } })
      } catch (error) {
        if (handleMissingTable(error, 'ContentPage', 'skipping delete')) {
          return
        }
        throw error
      }
    },
    listServices: async () => {
      try {
        const services = await prisma.contentService.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
        return services.map((service) => ({
          id: service.id,
          title: service.title,
          description: service.description,
          order: service.order,
          active: service.active,
        }))
      } catch (error) {
        if (handleMissingTable(error, 'ContentService', 'returning empty list')) {
          return []
        }
        throw error
      }
    },
    upsertService: async (service: ContentService) => {
      const data = {
        title: service.title,
        description: service.description,
        order: service.order,
        active: service.active,
      }
      try {
        if (service.id) {
          const updated = await prisma.contentService.update({ where: { id: service.id }, data })
          return {
            id: updated.id,
            title: updated.title,
            description: updated.description,
            order: updated.order,
            active: updated.active,
          }
        }
        const created = await prisma.contentService.create({ data })
        return {
          id: created.id,
          title: created.title,
          description: created.description,
          order: created.order,
          active: created.active,
        }
      } catch (error) {
        if (handleMissingTable(error, 'ContentService', 'returning draft service')) {
          return { ...service, id: service.id ?? crypto.randomUUID() }
        }
        throw error
      }
    },
    deleteService: async (id: string) => {
      try {
        await prisma.contentService.delete({ where: { id } })
      } catch (error) {
        if (handleMissingTable(error, 'ContentService', 'skipping delete')) {
          return
        }
        throw error
      }
    },
    listProjects: async () => {
      try {
        const projects = await prisma.portfolioProject.findMany({ orderBy: { createdAt: 'desc' } })
        return projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          tags: parseStringArray(project.tags),
          locationText: project.locationText,
          images: parseStringArray(project.images),
        }))
      } catch (error) {
        if (handleMissingTable(error, 'PortfolioProject', 'returning empty list')) {
          return []
        }
        throw error
      }
    },
    upsertProject: async (project: PortfolioProject) => {
      const data = {
        title: project.title,
        description: project.description,
        tags: serializeStringArray(project.tags),
        locationText: project.locationText ?? null,
        images: serializeStringArray(project.images),
      }
      try {
        if (project.id) {
          const updated = await prisma.portfolioProject.update({ where: { id: project.id }, data })
          return {
            id: updated.id,
            title: updated.title,
            description: updated.description,
            tags: project.tags,
            locationText: updated.locationText,
            images: project.images,
          }
        }
        const created = await prisma.portfolioProject.create({ data })
        return {
          id: created.id,
          title: created.title,
          description: created.description,
          tags: project.tags,
          locationText: created.locationText,
          images: project.images,
        }
      } catch (error) {
        if (handleMissingTable(error, 'PortfolioProject', 'returning draft project')) {
          return { ...project, id: project.id ?? crypto.randomUUID() }
        }
        throw error
      }
    },
    deleteProject: async (id: string) => {
      try {
        await prisma.portfolioProject.delete({ where: { id } })
      } catch (error) {
        if (handleMissingTable(error, 'PortfolioProject', 'skipping delete')) {
          return
        }
        throw error
      }
    },
    listPosts: async () => {
      if (!DB_ENABLED) {
        return []
      }
      try {
        const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
        return posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
        }))
      } catch (error) {
        if (handleMissingTable(error, 'BlogPost', 'returning empty list')) {
          return []
        }
        console.warn('[CONTENT] Failed to list posts from Prisma, returning empty list.', error)
        return []
      }
    },
    getPost: async (slug: string) => {
      try {
        const post = await prisma.blogPost.findUnique({ where: { slug } })
        if (!post) {
          return null
        }
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
        }
      } catch (error) {
        if (handleMissingTable(error, 'BlogPost', 'returning null post')) {
          return null
        }
        throw error
      }
    },
    upsertPost: async (post: ContentPost) => {
      const data = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage ?? null,
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        seoTitle: post.seoTitle ?? null,
        seoDescription: post.seoDescription ?? null,
      }
      try {
        if (post.id) {
          const updated = await prisma.blogPost.update({ where: { id: post.id }, data })
          return {
            id: updated.id,
            title: updated.title,
            slug: updated.slug,
            excerpt: updated.excerpt,
            content: updated.content,
            coverImage: updated.coverImage,
            publishedAt: updated.publishedAt ? updated.publishedAt.toISOString() : null,
            seoTitle: updated.seoTitle,
            seoDescription: updated.seoDescription,
          }
        }
        const created = await prisma.blogPost.create({ data })
        return {
          id: created.id,
          title: created.title,
          slug: created.slug,
          excerpt: created.excerpt,
          content: created.content,
          coverImage: created.coverImage,
          publishedAt: created.publishedAt ? created.publishedAt.toISOString() : null,
          seoTitle: created.seoTitle,
          seoDescription: created.seoDescription,
        }
      } catch (error) {
        if (handleMissingTable(error, 'BlogPost', 'returning draft post')) {
          return { ...post, id: post.id ?? crypto.randomUUID() }
        }
        throw error
      }
    },
    deletePost: async (id: string) => {
      try {
        await prisma.blogPost.delete({ where: { id } })
      } catch (error) {
        if (handleMissingTable(error, 'BlogPost', 'skipping delete')) {
          return
        }
        throw error
      }
    },
    createLead: async (payload: LeadPayload) => {
      try {
        const lead = await prisma.lead.create({
          data: {
            name: payload.name,
            phone: payload.phone,
            email: payload.email,
            clientType: payload.clientType,
            location: payload.location,
            address: payload.address ?? null,
            workType: payload.workType,
            urgency: payload.urgency,
            details: payload.details,
            reason: payload.reason ?? null,
            leadType: payload.leadType ?? null,
            plan: payload.plan ?? null,
            hasFiles: payload.hasFiles ?? false,
            consent: payload.consent,
            utmSource: payload.utmSource ?? null,
            utmMedium: payload.utmMedium ?? null,
            utmCampaign: payload.utmCampaign ?? null,
            utmTerm: payload.utmTerm ?? null,
            utmContent: payload.utmContent ?? null,
            fbclid: payload.fbclid ?? null,
            gclid: payload.gclid ?? null,
            landingPage: payload.landingPage ?? null,
            referrer: payload.referrer ?? null,
          },
        })
        return {
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          clientType: lead.clientType,
          location: lead.location,
          address: lead.address,
          workType: lead.workType,
          urgency: lead.urgency,
          details: lead.details,
          reason: lead.reason,
          leadType: lead.leadType,
          plan: lead.plan,
          hasFiles: lead.hasFiles,
          consent: lead.consent,
          utmSource: lead.utmSource,
          utmMedium: lead.utmMedium,
          utmCampaign: lead.utmCampaign,
          utmTerm: lead.utmTerm,
          utmContent: lead.utmContent,
          fbclid: lead.fbclid,
          gclid: lead.gclid,
          landingPage: lead.landingPage,
          referrer: lead.referrer,
        }
      } catch (error) {
        if (handleMissingTable(error, 'Lead', 'returning in-memory lead')) {
          return { id: crypto.randomUUID(), ...payload }
        }
        throw error
      }
    },
  }
}

let cachedStore: ContentStore | null = null

export function getContentStore(): ContentStore {
  if (cachedStore) {
    return cachedStore
  }

  const storeType = (process.env.CONTENT_STORE || 'postgres').toLowerCase()
  if (!DB_ENABLED) {
    try {
      fsSync.mkdirSync(contentDir, { recursive: true })
      return (cachedStore = buildFileStore())
    } catch (error) {
      console.warn('[CONTENT] No persistent disk found, falling back to memory store.')
      return (cachedStore = memoryStore)
    }
  }
  if (storeType === 'file') {
    try {
      fsSync.mkdirSync(contentDir, { recursive: true })
      return (cachedStore = buildFileStore())
    } catch (error) {
      console.warn('[CONTENT] No persistent disk found, falling back to memory store.')
      return (cachedStore = memoryStore)
    }
  }

  return (cachedStore = buildPrismaStore())
}

export async function ensureContentStorage() {
  if (!DB_ENABLED || (process.env.CONTENT_STORE || 'postgres').toLowerCase() !== 'file') {
    return
  }
  try {
    await fs.mkdir(contentDir, { recursive: true })
  } catch (error) {
    console.warn('[CONTENT] No persistent disk found, falling back to memory store.')
    cachedStore = memoryStore
  }
}

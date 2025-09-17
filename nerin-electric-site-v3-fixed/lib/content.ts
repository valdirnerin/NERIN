import fs from 'fs'
import path from 'path'

export function getStorageDir(){
  const p = process.env.STORAGE_DIR || path.join(process.cwd(), '.data')
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
  return p
}

const SITE_FILE = 'site.json'

function getTypeDir(type: string){
  const dir = path.join(getStorageDir(), type)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

function getItemFile(type: string, slug: string){
  return path.join(getTypeDir(type), `${slug}.json`)
}

export function readSite(){
  const dir = getStorageDir()
  const file = path.join(dir, SITE_FILE)
  if (!fs.existsSync(file)){
    const defaults = {
      name: 'NERIN',
      accent: '#f59e0b',
      email: 'hola@nerin.com.ar',
      phone: '+54 11 1234-5678',
      address: 'CABA',
      socials: { instagram: '', linkedin: '' }
    }
    fs.writeFileSync(file, JSON.stringify(defaults, null, 2))
    return defaults
  }
  try{
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  }catch{
    return { name: 'NERIN', accent: '#f59e0b' }
  }
}

export function writeSite(data: any){
  const dir = getStorageDir()
  const file = path.join(dir, SITE_FILE)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  return true
}

export function listItems(type: string){
  const dir = getTypeDir(type)
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace(/\.json$/, ''))
    .sort()
}

export function readMarkdown(type: string, slug: string){
  const file = getItemFile(type, slug)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return null
  }
}

export function writeMarkdown(type: string, slug: string, data: any, content: string){
  const file = getItemFile(type, slug)
  const payload = { data: data ?? {}, content: content ?? '' }
  fs.writeFileSync(file, JSON.stringify(payload, null, 2))
  return payload
}

export function deleteMarkdown(type: string, slug: string){
  const file = getItemFile(type, slug)
  if (fs.existsSync(file)) fs.unlinkSync(file)
}

import fs from 'fs'
import path from 'path'

export function getStorageDir(){
  const p = process.env.STORAGE_DIR || path.join(process.cwd(), '.data')
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
  return p
}

const SITE_FILE = 'site.json'

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

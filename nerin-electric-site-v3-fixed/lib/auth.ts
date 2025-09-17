import fs from 'fs'
import path from 'path'
import { getStorageDir } from './content'

const SESSION_FILE = 'session.json'

function readFlag(){
  const dir = getStorageDir()
  const file = path.join(dir, SESSION_FILE)
  if (!fs.existsSync(file)) return { admin: false, name: null }
  try { return JSON.parse(fs.readFileSync(file,'utf-8')) } catch { return { admin: false, name: null } }
}

function writeFlag(data: any){
  const dir = getStorageDir()
  const file = path.join(dir, SESSION_FILE)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

export async function getSession(){
  const flag = readFlag()
  return {
    user: flag.admin ? { role: 'admin', name: flag.name || 'admin' } : null,
    async save(this: any){
      // Si this.user existe y es admin, persistimos flag; si no, lo apagamos.
      if (this.user && this.user.role === 'admin'){
        writeFlag({ admin: true, name: this.user.name || 'admin' })
      } else {
        writeFlag({ admin: false, name: null })
      }
    }
  }
}

export async function requireAdmin(){
  const flag = readFlag()
  if (!flag.admin){
    throw new Error('Unauthorized')
  }
}

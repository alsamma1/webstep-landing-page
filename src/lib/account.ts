import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), 'data', 'db')
const ACCOUNT_FILE = path.join(DB_DIR, 'account.json')

export function getStoredAccount() {
  // 1. Try local file
  if (fs.existsSync(ACCOUNT_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ACCOUNT_FILE, 'utf-8'))
      if (parsed.username && parsed.password) return parsed
    } catch (e) {
      console.warn('Failed to read account.json:', e)
    }
  }

  // 2. Default from environment
  return {
    name: 'المدير العام',
    username: process.env.ADMIN_USERNAME || 'admin',
    email: 'admin@wepstep.sa',
    password: process.env.ADMIN_PASSWORD || '',
    updatedAt: new Date().toISOString(),
  }
}

export function saveStoredAccount(data: Record<string, unknown>) {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
  fs.writeFileSync(ACCOUNT_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

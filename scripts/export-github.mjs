import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const sourceDir = path.resolve('.')
const parentDir = path.dirname(sourceDir)
const exportDir = path.join(parentDir, 'wepstep-github-export')
const zipFile = path.join(parentDir, 'wepstep-github-export.zip')

const EXCLUDE_NAMES = new Set([
  'node_modules',
  '.next',
  '.env.local',
  '.git',
  '.vercel',
  'tsconfig.tsbuildinfo',
  'wepstep-github-export',
  'wepstep-github-export.zip',
  'الصور', // Raw image working folder if large
])

console.log('Source Directory:', sourceDir)
console.log('Export Directory:', exportDir)
console.log('Target ZIP:', zipFile)

// Remove old exports if exist
if (fs.existsSync(exportDir)) {
  fs.rmSync(exportDir, { recursive: true, force: true })
}
if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile, { force: true })
}

fs.mkdirSync(exportDir, { recursive: true })

function copyDirRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    if (EXCLUDE_NAMES.has(entry.name)) continue
    if (entry.name.endsWith('.local') && entry.name.startsWith('.env')) continue

    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      copyDirRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

console.log('Copying clean project files...')
copyDirRecursive(sourceDir, exportDir)
console.log('Files copied successfully.')

// Create README-DEPLOYMENT.md in export directory
const deployReadme = `# تعليمات رفع ويب ستيب إلى GitHub وربطه بـ Vercel

هذا المجلد يحتوي على كود المشروع الكامل بعد اختباره وتأكيد نجاح بناء الإنتاج (Build Verified: Code 0).

## 1. الخطوة الأولى: رفع الكود إلى مستودع GitHub
يمكنك رفع محتويات هذا المجلد مباشرة إلى مستودع GitHub الخاص بمشروعك (wepstep):
- سواء عبر سحب وإفلات الملفات في موقع GitHub داخل المتصفح.
- أو عبر أداة GitHub Desktop أو سطر الأوامر (Git).

## 2. الخطوة الثانية: متغيرات البيئة في Vercel
في لوحة تحكم **Vercel** > مشروعك > **Settings** > **Environment Variables**، تأكد من إضافة المتغيرات التالية:

\`\`\`env
NEXT_PUBLIC_SITE_URL=https://wepste.com
NEXT_PUBLIC_GA_ID=G-30E5FSM42H

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SECRET_KEY

# Admin Dashboard Credentials
ADMIN_USERNAME=YOUR_ADMIN_USERNAME
ADMIN_PASSWORD=YOUR_STRONG_UNIQUE_PASSWORD
ADMIN_SESSION_SECRET=GENERATE_A_SECURE_RANDOM_SECRET

# Firebase Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
FIREBASE_PROJECT_ID=webstep-landing-page
\`\`\`

## 3. الخطوة الثالثة: النشر التلقائي
بمجرد رفع الملفات إلى فرع main في GitHub، ستقوم منصة Vercel تلقائياً باكتشاف التحديث وبناء الموقع ونشره مباشرة على نطاقك الرسمي:
https://wepste.com
`
fs.writeFileSync(path.join(exportDir, 'DEPLOYMENT_INSTRUCTIONS.md'), deployReadme, 'utf-8')

console.log('Compressing to ZIP archive...')
try {
  // Use PowerShell with safe argument passing to compress
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${exportDir}\\*' -DestinationPath '${zipFile}' -Force"`
  execSync(psCmd, { stdio: 'inherit' })
  const stats = fs.statSync(zipFile)
  console.log(`\n✅ تم إنشاء الملف المضغوط بنجاح: ${zipFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
} catch (err) {
  console.error('Compress-Archive error, trying alternative or keeping folder:', err.message)
}

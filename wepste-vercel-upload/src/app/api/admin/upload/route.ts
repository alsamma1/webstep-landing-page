import { NextRequest, NextResponse } from 'next/server'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'
import path from 'path'
import fs from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'site'
    const folder = (formData.get('folder') as string) || 'home'
    const allowedBuckets = new Set(['blog', 'projects', 'team', 'site', 'home'])

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال أي ملف' }, { status: 400 })
    }
    if (!['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'].includes(file.type)) {
      return NextResponse.json({ error: 'الصيغ المدعومة: WebP, JPEG, PNG, SVG, GIF' }, { status: 415 })
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الصورة يتجاوز الحد المسموح (15 MB)' }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const extension = file.type === 'image/jpeg' ? 'jpg' :
      file.type === 'image/png' ? 'png' :
      file.type === 'image/svg+xml' ? 'svg' :
      file.type === 'image/gif' ? 'gif' : 'webp'

    const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`

    // Try Supabase Storage first if configured
    if (isSupabaseConfigured() && allowedBuckets.has(bucket)) {
      try {
        const client = getServerClient()
        const cleanFolder = folder.split('/').filter(part => /^[a-zA-Z0-9_-]+$/.test(part)).join('/')
        const storagePath = [cleanFolder, fileName].filter(Boolean).join('/')

        const { data, error } = await client.storage.from(bucket).upload(storagePath, buffer, {
          contentType: file.type,
          cacheControl: '31536000',
          upsert: false,
        })

        if (!error && data?.path) {
          const { data: urlData } = client.storage.from(bucket).getPublicUrl(data.path)
          return NextResponse.json({ success: true, url: urlData.publicUrl })
        }
        console.warn('Supabase bucket upload notice (falling back to public/uploads):', error?.message)
      } catch (err: any) {
        console.warn('Supabase storage exception (falling back):', err?.message)
      }
    }

    // Local Disk Fallback in /public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.promises.mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, fileName)
    await fs.promises.writeFile(filePath, buffer)

    return NextResponse.json({ success: true, url: `/uploads/${fileName}` })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'فشل رفع الملف' },
      { status: 500 }
    )
  }
}

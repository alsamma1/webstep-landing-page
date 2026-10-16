/**
 * WebStep — Supabase Client
 * Client-side browser instance (safe for frontend components)
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ─── Storage Helpers ──────────────────────────────────────────────

/**
 * Upload an image file to Supabase Storage
 * @param bucket - 'blog' | 'projects' | 'team' | 'site'
 * @param file - File object from <input type="file">
 * @param folder - optional subfolder e.g. 'covers'
 * @returns public URL of the uploaded image
 */
export async function uploadImage(
  bucket: 'blog' | 'projects' | 'team' | 'site',
  file: File,
  folder = '',
  compression: 'balanced' | 'lossless' = 'balanced'
): Promise<string | null> {
  if (file.size > 20 * 1024 * 1024) throw new Error('حجم الصورة الأصلية يتجاوز 20 MB')
  if (!file.type.startsWith('image/')) throw new Error('الملف المحدد ليس صورة')
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    throw new Error('يرجى اختيار صورة ثابتة بصيغة JPG أو PNG أو WebP')
  }

  const compressed = await compressImage(file, compression)
  const formData = new FormData()
  formData.append('file', compressed, compressed.type === 'image/png' ? 'image.png' : 'image.webp')
  formData.append('bucket', bucket)
  if (folder) formData.append('folder', folder)

  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
  const result = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(result.error || 'فشل رفع الصورة إلى التخزين')
  if (typeof result.url !== 'string') throw new Error('لم يُرجع التخزين رابط الصورة')
  return result.url
}

async function compressImage(file: File, compression: 'balanced' | 'lossless'): Promise<Blob> {
  const source = await createImageBitmap(file)
  const maxDimension = 1920
  const scale = Math.min(1, maxDimension / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(source.width * scale))
  canvas.height = Math.max(1, Math.round(source.height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('تعذر تجهيز الصورة للضغط')
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  source.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) return reject(new Error('تعذر ضغط الصورة'))
        const expectedType = compression === 'lossless' ? 'image/png' : 'image/webp'
        if (blob.type !== expectedType) {
          return reject(new Error(compression === 'lossless' ? 'تعذر حفظ الصورة بصيغة PNG دون فقدان الجودة' : 'متصفحك لا يدعم ضغط الصور إلى WebP'))
        }
        resolve(blob)
      },
      compression === 'lossless' ? 'image/png' : 'image/webp',
      compression === 'lossless' ? undefined : 0.82
    )
  })
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(bucket: 'blog' | 'projects' | 'team' | 'site', url: string): Promise<void> {
  const path = url.split(`/${bucket}/`)[1]
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}

'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  placeholder?: string
  helpText?: string
  hint?: string
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  bucket = 'site',
  folder = 'home',
  placeholder = '/assets/1.png أو رابط صورة...',
  helpText,
  hint,
}: ImageUploadFieldProps) {
  const activeHelp = helpText || hint
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      formData.append('folder', folder)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'تعذر رفع الصورة')
      }

      onChange(data.url)
    } catch (err: any) {
      console.error('File upload error:', err)
      setUploadError(err.message || 'فشل رفع الصورة')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-1.5 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-secondary)]">{label}</label>
        {activeHelp && <span className="text-[10px] text-[var(--text-muted)]">{activeHelp}</span>}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Thumbnail Preview */}
        {value ? (
          <div className="relative w-14 h-14 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] overflow-hidden shrink-0 flex items-center justify-center group">
            {value.startsWith('/') || value.startsWith('http') ? (
              <Image
                src={value}
                alt={label}
                width={56}
                height={56}
                className="w-full h-full object-contain p-1"
                unoptimized
              />
            ) : (
              <span className="text-xs font-mono">{value.slice(0, 4)}</span>
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="إزالة الصورة"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
            <ImageIcon size={20} />
          </div>
        )}

        {/* Text Input for URL */}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-xs font-mono focus:border-[#1F8A54] outline-none"
        />

        {/* Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[#1F8A54]/10 hover:text-[#1F8A54] hover:border-[#1F8A54]/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 size={13} className="animate-spin text-[#1F8A54]" />
              <span>جاري الرفع...</span>
            </>
          ) : (
            <>
              <Upload size={13} />
              <span>رفع من الجهاز</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <p className="text-[11px] text-[#ef4444] font-medium mt-1">{uploadError}</p>
      )}
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useRegion } from '@/components/providers/RegionProvider'
import { Globe, Check, ChevronDown } from 'lucide-react'

interface RegionSwitcherProps {
  compact?: boolean
  className?: string
}

export default function RegionSwitcher({ compact = false, className = '' }: RegionSwitcherProps) {
  const { region, setRegion, isYemen } = useRegion()
  const [open, setOpen] = useState(false)

  const options = [
    {
      code: 'ye' as const,
      name: 'اليمن',
      flag: '🇾🇪',
      currency: 'ريال يمني (ر.ي)',
      phone: '771111357',
    },
    {
      code: 'sa' as const,
      name: 'السعودية والعالم',
      flag: '🇸🇦',
      currency: 'ريال سعودي (ر.س)',
      phone: '+966593672193',
    },
  ]

  const current = isYemen ? options[0] : options[1]

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg sm:rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] transition-all cursor-pointer text-xs font-bold shrink-0 shadow-sm"
          title="تغيير الدولة والعملة (اليمن / السعودية)"
          aria-label="تغيير الدولة والعملة"
        >
          <span className="text-sm leading-none">{current.flag}</span>
          <span className="hidden sm:inline text-[11px] font-black">{current.name}</span>
          <span className="text-[10px] text-[#1F8A54] font-black">{isYemen ? 'ر.ي' : 'ر.س'}</span>
          <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="absolute top-full mt-1.5 left-0 sm:right-0 w-48 sm:w-52 rounded-xl p-1.5 shadow-2xl border border-[var(--border)] bg-[var(--surface)] z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <div className="px-2 py-1 text-[10px] font-bold text-[var(--text-muted)] border-b border-[var(--border)]/50 mb-1">
                اختر الدولة لتخصيص الأسعار وأرقام التواصل:
              </div>
              {options.map((opt) => {
                const isSelected = region === opt.code
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setRegion(opt.code)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-right transition-colors text-xs font-semibold cursor-pointer ${
                      isSelected
                        ? 'bg-[#1F8A54]/10 text-[#1F8A54] font-bold'
                        : 'hover:bg-[var(--bg-muted)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{opt.flag}</span>
                      <div>
                        <div className="leading-tight">{opt.name}</div>
                        <div className="text-[10px] opacity-70">{opt.currency}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-[#1F8A54]" />}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    )
  }

  // Full / Detailed Switcher (for Footer or Mobile)
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
        <Globe size={13} className="text-[#1F8A54]" />
        <span>المنطقة الجغرافية والعملة:</span>
      </div>
      <div className="inline-flex p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
        {options.map((opt) => {
          const isSelected = region === opt.code
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setRegion(opt.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[var(--surface)] text-[#1F8A54] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.name}</span>
              <span className="text-[10px] opacity-70">({opt.code === 'ye' ? 'ر.ي' : 'ر.س'})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

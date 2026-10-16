'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Scale, FileText, ChevronDown, RefreshCw, Mail } from 'lucide-react'
import { LegalPageData, DEFAULT_TERMS_DATA } from '@/lib/legal-pages-server'

export default function TermsPage() {
  const [data, setData] = useState<LegalPageData>(DEFAULT_TERMS_DATA)
  const [open, setOpen] = useState<number | null>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/legal?type=terms')
      .then((res) => res.json())
      .then((resData) => {
        if (resData && Array.isArray(resData.sections)) {
          setData(resData)
        }
      })
      .catch((err) => console.error('Failed to load terms data:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main dir="rtl" className="pt-24 pb-20 text-right">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[var(--bg)] border-b border-[var(--border)] py-16 sm:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(circle, #1F8A54, transparent 65%)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10"
              style={{ background: 'radial-gradient(circle, #10b981, transparent 65%)' }}
            />
          </div>

          <div className="container-ws max-w-4xl relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1F8A54]/15 border border-[#1F8A54]/25 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#1F8A54]/10">
              <Scale size={32} className="text-[#1F8A54]" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tight">
              {data.title || 'الشروط والأحكام'}
            </h1>

            <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
              {data.subtitle || 'يُرجى قراءة هذه الشروط بعناية قبل استخدام خدمات ومنتجات WebStep.'}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] shadow-sm">
              <FileText size={14} className="text-[#1F8A54]" />
              <span>آخر تحديث وتعديل:</span>
              <strong className="text-[var(--text-primary)]">{data.lastUpdated || 'أكتوبر ٢٠٢٥'}</strong>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding">
          <div className="container-ws max-w-3xl mx-auto">
            {loading && (
              <div className="flex items-center justify-center py-6 text-xs text-[var(--text-muted)] gap-2 mb-4">
                <RefreshCw size={14} className="animate-spin text-[#1F8A54]" />
                <span>جاري استرداد أحدث نسخة معتمدة...</span>
              </div>
            )}

            <div className="space-y-3.5">
              {data.sections.map((s, i) => {
                const isOpen = open === i
                return (
                  <div
                    key={s.id || i}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-[var(--surface)] ${
                      isOpen
                        ? 'border-[#1F8A54]/40 shadow-md shadow-[#1F8A54]/5 ring-1 ring-[#1F8A54]/20'
                        : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full p-5 sm:p-6 flex items-center justify-between text-right hover:bg-[var(--bg-muted)]/50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-[#1F8A54] text-white shadow-md shadow-[#1F8A54]/30'
                              : 'bg-[#1F8A54]/15 text-[#1F8A54]'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="font-black text-sm sm:text-base text-[var(--text-primary)] truncate">
                          {s.title}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-[var(--text-muted)] transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#1F8A54]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-6 pt-2 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)]/60 bg-[var(--bg-muted)]/20 animate-fadeIn whitespace-pre-line">
                        {s.content}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Support / Legal Contact Box */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl border border-[#1F8A54]/25 bg-gradient-to-br from-[#1F8A54]/10 via-[var(--surface)] to-[#10b981]/5 text-center shadow-sm">
              <h3 className="font-black text-base text-[var(--text-primary)] mb-2">
                لديك استفسار حول بنود الاتفاقية أو الشروط؟
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-5 leading-relaxed">
                يسعد فريقنا القانوني وخدمة العملاء بالإجابة على جميع تساؤلاتك ومساعدتك في أي استيضاح.
              </p>
              <a
                href="mailto:hello@wepstep.sa"
                className="btn-primary px-7 py-3 text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Mail size={16} />
                <span>تواصل مع الدعم القانوني</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

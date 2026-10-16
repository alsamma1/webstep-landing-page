'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Filter } from 'lucide-react'
import { PROJECTS, PROJECT_CATEGORIES } from '@/data'
import type { ProjectCategory } from '@/types'

const categoryLabels: Record<string, string> = {
  website: 'موقع ويب',
  app: 'تطبيق',
  ecommerce: 'متجر',
  landing: 'لاندينج',
  system: 'نظام',
  uiux: 'UI/UX',
}

const categoryColors: Record<string, string> = {
  website: 'bg-blue-500/10 text-blue-500',
  app: 'bg-purple-500/10 text-purple-500',
  ecommerce: 'bg-orange-500/10 text-orange-500',
  landing: 'bg-pink-500/10 text-pink-500',
  system: 'bg-cyan-500/10 text-cyan-500',
  uiux: 'bg-[rgba(31,138,84,0.1)] text-[#1F8A54]',
}

// Placeholder gradient images for projects
const projectGradients = [
  'from-blue-900 via-blue-800 to-indigo-900',
  'from-slate-900 via-slate-800 to-zinc-900',
  'from-purple-900 via-purple-800 to-violet-900',
  'from-emerald-900 via-green-800 to-teal-900',
  'from-gray-900 via-gray-800 to-slate-900',
  'from-cyan-900 via-cyan-800 to-blue-900',
]

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all')

  const filtered = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory)

  useEffect(() => {
    const initGsap = async () => {
      try {
        const { default: gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
          gsap.fromTo('.portfolio-card', {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.portfolio-grid',
              start: 'top 80%',
            },
          })
        }, sectionRef)

        return () => ctx.revert()
      } catch {}
    }
    initGsap()
  }, [])

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
  }

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="portfolio-title"
    >
      {/* BG accent */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full opacity-[0.04] dark:opacity-[0.07] -z-10"
        style={{ background: 'radial-gradient(circle, #1F8A54 0%, transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="container-ws">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="section-label">أعمالنا</span>
            <h2 id="portfolio-title" className="section-title mb-2">
              مشاريع{' '}
              <span className="text-gradient-green">نفتخر بها</span>
            </h2>
            <p className="section-subtitle">
              نماذج من أعمالنا التي تعكس مستوى الجودة والاحتراف في كل مشروع.
            </p>
          </div>

        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-8" role="tablist" aria-label="تصفية المشاريع">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as 'all' | ProjectCategory)}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`px-4 py-2 rounded-full text-sm font-600 transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#1F8A54] text-white shadow-[0_4px_15px_rgba(31,138,84,0.3)]'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[rgba(31,138,84,0.4)] hover:text-[#1F8A54]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, index) => (
            <article
              key={project.id}
              className="portfolio-card ws-card overflow-hidden group"
            >
              {/* Project Image */}
              <div className={`relative h-44 bg-gradient-to-br ${projectGradients[index % projectGradients.length]} overflow-hidden`}>
                {/* Project Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-black opacity-10 text-white">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Green logo overlay */}
                <div className="absolute top-4 right-4">
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 opacity-40">
                    <path d="M6 13 L16 35 L24 19 L32 35 L42 13" stroke="#1F8A54" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Category tag */}
                <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-700 ${categoryColors[project.category] || 'bg-white/10 text-white'}`}>
                  {categoryLabels[project.category] || project.category}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1F8A54]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={scrollToContact}
                    className="flex items-center gap-2 bg-white text-[#1F8A54] px-4 py-2 rounded-xl font-700 text-sm"
                    aria-label={`عرض مشروع ${project.title}`}
                  >
                    <ExternalLink size={15} />
                    عرض المشروع
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-800 text-[var(--text-primary)] text-base group-hover:text-[#1F8A54] transition-colors">
                    {project.title}
                  </h3>
                  {project.year && (
                    <span className="text-xs text-[var(--text-muted)] flex-shrink-0 mt-1">{project.year}</span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] text-xs font-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-[var(--text-secondary)] mb-4">هل مشروعك القادم هنا؟</p>
          <button onClick={scrollToContact} className="btn-primary">
            ابدأ مشروعك الآن
          </button>
        </div>
      </div>
    </section>
  )
}

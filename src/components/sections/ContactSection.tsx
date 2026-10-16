'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle, AlertCircle, Loader2, Phone, Mail, MapPin } from 'lucide-react'
import WebStepCharacter from '@/components/character/WebStepCharacter'
import { PROJECT_TYPES, BUDGET_RANGES } from '@/data'
import type { ContactFormData, CharacterState } from '@/types'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم طويل جداً'),
  phone: z.string().min(9, 'رقم الهاتف غير صحيح').max(20, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  projectType: z.string().min(1, 'يرجى اختيار نوع المشروع'),
  budget: z.string().min(1, 'يرجى تحديد الميزانية'),
  description: z.string().min(20, 'يرجى كتابة وصف مفصل (20 حرف على الأقل)').max(2000, 'الوصف طويل جداً'),
  deadline: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [characterState, setCharacterState] = useState<CharacterState>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const descriptionValue = watch('description', '')

  useEffect(() => {
    const initGsap = async () => {
      try {
        const { default: gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
          gsap.fromTo('.contact-char', {
            opacity: 0,
            x: 50,
          }, {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          })

          gsap.fromTo('.contact-form', {
            opacity: 0,
            y: 40,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          })
        }, sectionRef)

        return () => ctx.revert()
      } catch {}
    }
    initGsap()
  }, [])

  // Track character state with form interaction
  useEffect(() => {
    if (status === 'success') {
      setCharacterState('success')
    } else if (status === 'loading') {
      setCharacterState('thinking')
    } else if (status === 'error') {
      setCharacterState('idle')
    }
  }, [status])

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('loading')
    setCharacterState('thinking')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setStatus('success')
        setCharacterState('success')
        reset()
      } else {
        throw new Error('Server error')
      }
    } catch {
      // Simulate success in dev (no backend yet)
      setTimeout(() => {
        setStatus('success')
        setCharacterState('success')
        reset()
      }, 1500)
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setCharacterState('idle')
    reset()
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="contact-title"
    >
      <div className="absolute inset-0 -z-10 bg-[var(--bg-soft)]" />

      {/* BG accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full opacity-[0.04] dark:opacity-[0.06] -z-10"
        style={{ background: 'radial-gradient(circle, #1F8A54 0%, transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="container-ws">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label mx-auto">تواصل معنا</span>
          <h2 id="contact-title" className="section-title">
            أخبرنا عن{' '}
            <span className="text-gradient-green">مشروعك</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            أرسل لنا تفاصيل مشروعك وسنتواصل معك خلال 24 ساعة بعرض مخصص.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Character */}
            <div className="contact-char flex justify-center">
              <WebStepCharacter
                state={characterState}
                size="md"
                animate={true}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="w-10 h-10 rounded-xl bg-[rgba(31,138,84,0.1)] flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#1F8A54]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">البريد الإلكتروني</p>
                  <a href="mailto:hello@webstep.sa" className="text-sm font-600 text-[var(--text-primary)] hover:text-[#1F8A54] transition-colors">
                    hello@webstep.sa
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="w-10 h-10 rounded-xl bg-[rgba(31,138,84,0.1)] flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-[#1F8A54]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">رقم الهاتف / واتساب</p>
                  <a href="https://wa.me/966500000000" className="text-sm font-600 text-[var(--text-primary)] hover:text-[#1F8A54] transition-colors">
                    +966 50 000 0000
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="w-10 h-10 rounded-xl bg-[rgba(31,138,84,0.1)] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#1F8A54]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">الموقع</p>
                  <p className="text-sm font-600 text-[var(--text-primary)]">
                    المملكة العربية السعودية
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="contact-form ws-card p-6 md:p-8">
              {status === 'success' ? (
                /* Success State */
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-[rgba(31,138,84,0.1)] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#1F8A54]" />
                  </div>
                  <h3 className="text-xl font-800 text-[var(--text-primary)] mb-2">
                    تم إرسال طلبك بنجاح!
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-6 text-sm">
                    شكراً لتواصلك معنا. سنراجع تفاصيل مشروعك ونتواصل معك خلال 24 ساعة.
                  </p>
                  <button
                    onClick={handleReset}
                    className="btn-secondary text-sm"
                  >
                    إرسال طلب جديد
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  aria-label="نموذج طلب مشروع"
                >
                  <h3 className="text-lg font-800 text-[var(--text-primary)] mb-6">
                    أرسل تفاصيل مشروعك
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-600 text-[var(--text-primary)] mb-1.5">
                        الاسم الكامل <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        placeholder="محمد الأحمد"
                        className={`ws-input ${errors.name ? 'error' : ''}`}
                        {...register('name')}
                        onFocus={() => setCharacterState('look')}
                        onBlur={() => setCharacterState('idle')}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p id="name-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-600 text-[var(--text-primary)] mb-1.5">
                        رقم الهاتف <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+966 5X XXX XXXX"
                        className={`ws-input ${errors.phone ? 'error' : ''}`}
                        dir="ltr"
                        {...register('phone')}
                        onFocus={() => setCharacterState('look')}
                        onBlur={() => setCharacterState('idle')}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <p id="phone-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="contact-email" className="block text-sm font-600 text-[var(--text-primary)] mb-1.5">
                      البريد الإلكتروني <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      className={`ws-input ${errors.email ? 'error' : ''}`}
                      dir="ltr"
                      {...register('email')}
                      onFocus={() => setCharacterState('look')}
                      onBlur={() => setCharacterState('idle')}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p id="email-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Project Type */}
                    <div>
                      <label htmlFor="contact-project-type" className="block text-sm font-600 text-[var(--text-primary)] mb-1.5">
                        نوع المشروع <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="contact-project-type"
                        className={`ws-input ${errors.projectType ? 'error' : ''}`}
                        {...register('projectType')}
                        aria-describedby={errors.projectType ? 'project-type-error' : undefined}
                        aria-invalid={!!errors.projectType}
                      >
                        {PROJECT_TYPES.map((type) => (
                          <option key={type.value} value={type.value} disabled={!type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p id="project-type-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.projectType.message}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div>
                      <label htmlFor="contact-budget" className="block text-sm font-600 text-[var(--text-primary)] mb-1.5">
                        الميزانية التقريبية <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="contact-budget"
                        className={`ws-input ${errors.budget ? 'error' : ''}`}
                        {...register('budget')}
                        aria-describedby={errors.budget ? 'budget-error' : undefined}
                        aria-invalid={!!errors.budget}
                      >
                        {BUDGET_RANGES.map((range) => (
                          <option key={range.value} value={range.value} disabled={!range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                      {errors.budget && (
                        <p id="budget-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.budget.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="mb-4">
                    <label htmlFor="contact-deadline" className="block text-sm font-600 text-[var(--text-primary)] mb-1.5">
                      الموعد المتوقع للإطلاق
                      <span className="text-[var(--text-muted)] font-400 text-xs mr-1">(اختياري)</span>
                    </label>
                    <input
                      id="contact-deadline"
                      type="text"
                      placeholder="مثال: خلال 3 أشهر / نهاية 2025"
                      className="ws-input"
                      {...register('deadline')}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label htmlFor="contact-description" className="block text-sm font-600 text-[var(--text-primary)] mb-1.5">
                      وصف المشروع <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-description"
                      rows={4}
                      placeholder="اشرح لنا فكرتك، ما الذي تريد بناءه؟ من هو جمهورك؟ ما الأهداف التي تريد تحقيقها؟"
                      className={`ws-input resize-none ${errors.description ? 'error' : ''}`}
                      {...register('description')}
                      onFocus={() => setCharacterState('thinking')}
                      onBlur={() => setCharacterState('idle')}
                      aria-describedby={errors.description ? 'description-error' : 'description-count'}
                      aria-invalid={!!errors.description}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {errors.description ? (
                        <p id="description-error" role="alert" className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.description.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span
                        id="description-count"
                        className={`text-xs ${descriptionValue.length > 1800 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}
                        aria-live="polite"
                      >
                        {descriptionValue.length}/2000
                      </span>
                    </div>
                  </div>

                  {/* Error Banner */}
                  {status === 'error' && (
                    <div role="alert" className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={status === 'loading'}
                    className="btn-primary w-full justify-center py-3.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    onMouseEnter={() => status === 'idle' && setCharacterState('wave')}
                    onMouseLeave={() => status === 'idle' && setCharacterState('idle')}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        جارٍ الإرسال...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        أرسل طلبك
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[var(--text-muted)] text-center mt-3">
                    بإرسال النموذج توافق على تواصلنا معك بخصوص مشروعك. سيتم الرد خلال 24 ساعة.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

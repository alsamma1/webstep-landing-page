'use client'

import { useState } from 'react'
import {
  Globe, Smartphone, ShoppingCart, Server, Palette, Layout,
  DollarSign, Check, ArrowLeft, ArrowRight, Send, Link, User,
  Phone, Mail, ChevronDown, Sparkles,
} from 'lucide-react'

/* ─── خيارات الخدمات ─── */
const SERVICE_OPTIONS = [
  { id: 'website',   icon: Globe,         label: 'موقع إلكتروني',      desc: 'موقع تعريفي أو احترافي' },
  { id: 'ecommerce', icon: ShoppingCart,  label: 'متجر إلكتروني',       desc: 'بيع منتجاتك أونلاين' },
  { id: 'app',       icon: Smartphone,    label: 'تطبيق موبايل',        desc: 'iOS & Android' },
  { id: 'system',    icon: Server,        label: 'نظام إداري / ERP',    desc: 'لوحة تحكم وإدارة' },
  { id: 'design',    icon: Palette,       label: 'تصميم UI/UX',          desc: 'هوية بصرية وتصميم' },
  { id: 'landing',   icon: Layout,        label: 'صفحة هبوط',           desc: 'صفحة تسويقية محوّلة' },
]

/* ─── خيارات الميزانية ─── */
const BUDGET_OPTIONS = [
  { id: 'b1', label: 'أقل من 500',  value: '<500'  },
  { id: 'b2', label: '500 – 1,000', value: '500-1000' },
  { id: 'b3', label: '1,000 – 3,000', value: '1000-3000' },
  { id: 'b4', label: '3,000 – 5,000', value: '3000-5000' },
  { id: 'b5', label: 'أكثر من 5,000', value: '>5000' },
  { id: 'b6', label: 'حدد بنفسك',     value: 'custom' },
]

const CURRENCIES = ['USD $', 'SAR ر.س', 'YER ر.ي', 'EUR €', 'AED د.إ']

/* ─── مؤشر الخطوات ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full text-xs font-bold transition-all duration-400"
            style={{
              width:  i <= current ? 32 : 24,
              height: i <= current ? 32 : 24,
              background: i < current
                ? '#1F8A54'
                : i === current
                  ? 'linear-gradient(135deg,#1F8A54,#2ecc71)'
                  : 'rgba(31,138,84,0.1)',
              border: i === current ? '2px solid #1F8A54' : i < current ? 'none' : '1.5px solid rgba(31,138,84,0.25)',
              color: i <= current ? '#fff' : 'rgba(31,138,84,0.5)',
              boxShadow: i === current ? '0 0 16px rgba(31,138,84,0.45)' : 'none',
            }}
          >
            {i < current ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className="h-0.5 w-8 sm:w-14 rounded-full transition-all duration-500"
              style={{ background: i < current ? '#1F8A54' : 'rgba(31,138,84,0.15)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── بطاقة اختيار الخدمة ─── */
function ServiceCard({ option, selected, onClick }: { option: typeof SERVICE_OPTIONS[0]; selected: boolean; onClick: () => void }) {
  const Icon = option.icon
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all duration-300 focus:outline-none"
      style={{
        background: selected ? 'rgba(31,138,84,0.12)' : 'var(--surface)',
        border: selected ? '2px solid #1F8A54' : '1.5px solid var(--border)',
        boxShadow: selected ? '0 0 20px rgba(31,138,84,0.2)' : 'none',
        transform: selected ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1F8A54] flex items-center justify-center">
          <Check size={10} className="text-white" />
        </div>
      )}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{
          background: selected ? '#1F8A54' : 'rgba(31,138,84,0.08)',
        }}
      >
        <Icon size={20} className={selected ? 'text-white' : 'text-[#1F8A54]'} />
      </div>
      <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">{option.label}</span>
      <span className="text-[10px] text-[var(--text-secondary)]">{option.desc}</span>
    </button>
  )
}

/* ─── حقل الإدخال ─── */
function Field({ label, id, type = 'text', value, onChange, placeholder, required }: {
  label: string; id: string; type?: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)]">
        {label} {required && <span className="text-[#1F8A54]">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#1F8A54'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,138,84,0.15)' }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
      />
    </div>
  )
}

/* ─── المكوّن الرئيسي ─── */
export default function ProjectBuilder() {
  const [step, setStep] = useState(0)

  /* الخطوة 1 */
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  /* الخطوة 2 */
  const [budgetOption,  setBudgetOption]  = useState('')
  const [customBudget,  setCustomBudget]  = useState('')
  const [currency,      setCurrency]      = useState('USD $')
  const [currOpen,      setCurrOpen]      = useState(false)

  /* الخطوة 3 */
  const [details,       setDetails]       = useState('')
  const [refs,          setRefs]          = useState(['', '', ''])

  /* الخطوة 4 */
  const [name,          setName]          = useState('')
  const [phone,         setPhone]         = useState('')
  const [email,         setEmail]         = useState('')
  const [sent,          setSent]          = useState(false)

  function toggleService(id: string) {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function canNext() {
    if (step === 0) return selectedServices.length > 0
    if (step === 1) return budgetOption !== '' && (budgetOption !== 'custom' || customBudget.trim() !== '')
    if (step === 2) return details.trim().length > 10
    return name.trim() !== '' && phone.trim() !== ''
  }

  function buildWhatsAppMsg() {
    const svcLabels = selectedServices.map(id => SERVICE_OPTIONS.find(s => s.id === id)?.label).join('، ')
    const budget    = budgetOption === 'custom'
      ? `${customBudget} ${currency}`
      : `${BUDGET_OPTIONS.find(b => b.id === budgetOption)?.label} ${currency}`
    const refLinks  = refs.filter(r => r.trim()).map((r, i) => `رابط ${i + 1}: ${r}`).join('\n')

    return encodeURIComponent(
`🚀 *طلب مشروع جديد — WebStep*

📌 *الخدمات المطلوبة:*
${svcLabels}

💰 *الميزانية:*
${budget}

📝 *تفاصيل المشروع:*
${details}

${refLinks ? `🔗 *مواقع مرجعية:*\n${refLinks}\n` : ''}
👤 *بيانات التواصل:*
الاسم: ${name}
الجوال: ${phone}
${email ? `الإيميل: ${email}` : ''}`
    )
  }

  function handleSend() {
    const msg = buildWhatsAppMsg()
    window.open(`https://wa.me/967771111357?text=${msg}`, '_blank')
    setSent(true)
  }

  /* ─── شاشة النجاح ─── */
  if (sent) return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--bg-soft)] -z-10" />
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[rgba(31,138,84,0.1)] border-2 border-[#1F8A54] flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check size={36} className="text-[#1F8A54]" />
        </div>
        <h2 className="text-3xl font-black text-[var(--text-primary)] mb-3">تم الإرسال! 🎉</h2>
        <p className="text-[var(--text-secondary)] mb-8">سيتواصل معك فريق WebStep خلال أقل من 24 ساعة.</p>
        <button
          onClick={() => { setSent(false); setStep(0); setSelectedServices([]); setDetails(''); setName(''); setPhone(''); setEmail(''); setBudgetOption(''); setCustomBudget(''); setRefs(['','','']) }}
          className="px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg,#1F8A54,#2ecc71)', boxShadow: '0 8px 24px rgba(31,138,84,0.35)' }}
        >
          إرسال طلب جديد
        </button>
      </div>
    </section>
  )

  return (
    <section id="contact" className="relative py-24 overflow-hidden" aria-labelledby="builder-heading">
      {/* خلفية */}
      <div className="absolute inset-0 bg-[var(--bg-soft)] -z-10" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(31,138,84,0.07) 0%,transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6" dir="rtl">

        {/* العنوان */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(31,138,84,0.3)] bg-[rgba(31,138,84,0.06)] mb-4">
            <Sparkles size={14} className="text-[#1F8A54]" />
            <span className="text-sm font-semibold text-[#1F8A54]">لنبني معنا</span>
          </div>
          <h2 id="builder-heading" className="text-4xl sm:text-5xl font-black text-[var(--text-primary)]">
            ابدأ مشروعك الآن
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-md mx-auto">
            أخبرنا بفكرتك في 4 خطوات — وسنتواصل معك خلال 24 ساعة
          </p>
        </div>

        {/* البطاقة الرئيسية */}
        <div
          className="rounded-3xl p-6 sm:p-10"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            boxShadow: '0 24px 80px rgba(0,0,0,.08)',
          }}
        >
          <StepIndicator current={step} total={4} />

          {/* ─── الخطوة 1: اختيار الخدمة ─── */}
          {step === 0 && (
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">ما الذي تريد بناءه؟</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">يمكنك اختيار أكثر من خيار</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICE_OPTIONS.map(opt => (
                  <ServiceCard
                    key={opt.id}
                    option={opt}
                    selected={selectedServices.includes(opt.id)}
                    onClick={() => toggleService(opt.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── الخطوة 2: الميزانية ─── */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">ما ميزانيتك التقريبية؟</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">كل الميزانيات مرحب بها 💪</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {BUDGET_OPTIONS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBudgetOption(b.id)}
                    className="py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-250 focus:outline-none"
                    style={{
                      background: budgetOption === b.id ? 'rgba(31,138,84,0.12)' : 'var(--bg-base)',
                      border: budgetOption === b.id ? '2px solid #1F8A54' : '1.5px solid var(--border)',
                      color: budgetOption === b.id ? '#1F8A54' : 'var(--text-primary)',
                      transform: budgetOption === b.id ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* حقل مخصص */}
              {budgetOption === 'b6' && (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Field
                      label="أدخل الميزانية"
                      id="custom-budget"
                      type="number"
                      value={customBudget}
                      onChange={setCustomBudget}
                      placeholder="مثال: 1500"
                    />
                  </div>
                  {/* اختيار العملة */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setCurrOpen(o => !o)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none"
                      style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      {currency} <ChevronDown size={14} className={currOpen ? 'rotate-180' : ''} style={{ transition: 'transform .2s' }} />
                    </button>
                    {currOpen && (
                      <div
                        className="absolute bottom-full mb-1 left-0 rounded-xl overflow-hidden z-50 shadow-xl"
                        style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', minWidth: 120 }}
                      >
                        {CURRENCIES.map(c => (
                          <button
                            key={c}
                            onClick={() => { setCurrency(c); setCurrOpen(false) }}
                            className="block w-full text-right px-4 py-2.5 text-sm font-medium hover:bg-[rgba(31,138,84,0.08)] transition-colors"
                            style={{ color: c === currency ? '#1F8A54' : 'var(--text-primary)' }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* عرض العملة للخيارات الجاهزة */}
              {budgetOption && budgetOption !== 'b6' && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">العملة:</span>
                  <div className="relative">
                    <button
                      onClick={() => setCurrOpen(o => !o)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold focus:outline-none"
                      style={{ background: 'var(--bg-base)', border: '1.5px solid var(--border)', color: '#1F8A54' }}
                    >
                      {currency} <ChevronDown size={12} />
                    </button>
                    {currOpen && (
                      <div className="absolute top-full mt-1 left-0 rounded-xl overflow-hidden z-50 shadow-xl" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', minWidth: 120 }}>
                        {CURRENCIES.map(c => (
                          <button key={c} onClick={() => { setCurrency(c); setCurrOpen(false) }}
                            className="block w-full text-right px-4 py-2.5 text-sm font-medium hover:bg-[rgba(31,138,84,0.08)] transition-colors"
                            style={{ color: c === currency ? '#1F8A54' : 'var(--text-primary)' }}>{c}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── الخطوة 3: التفاصيل + الروابط ─── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">أخبرنا عن مشروعك</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">كلما أضفت تفاصيل، كان عرضنا أدق</p>
              </div>

              {/* منطقة النص */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="details" className="text-sm font-semibold text-[var(--text-primary)]">
                  وصف المشروع <span className="text-[#1F8A54]">*</span>
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="اشرح فكرتك، الجمهور المستهدف، الميزات التي تريدها..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                  style={{
                    background: 'var(--bg-base)',
                    border: '1.5px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#1F8A54'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,138,84,0.12)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <span className="text-[10px] text-[var(--text-secondary)] text-left">{details.length} حرف</span>
              </div>

              {/* الروابط المرجعية */}
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <Link size={14} className="text-[#1F8A54]" />
                  مواقع تعجبك أو تريد موقعاً مشابهاً لها (اختياري)
                </p>
                <div className="space-y-3">
                  {refs.map((r, i) => (
                    <div key={i} className="relative">
                      <input
                        type="url"
                        value={r}
                        onChange={e => setRefs(prev => { const n=[...prev]; n[i]=e.target.value; return n })}
                        placeholder={`https://example${i + 1}.com`}
                        className="w-full pl-4 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'var(--bg-base)',
                          border: '1.5px solid var(--border)',
                          color: 'var(--text-primary)',
                          direction: 'ltr',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#1F8A54'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31,138,84,0.12)' }}
                        onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1F8A54] opacity-60">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── الخطوة 4: بيانات التواصل ─── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">كيف نتواصل معك؟</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">بياناتك آمنة تماماً — لن تُشارك مع أي جهة</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={15} className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-[#1F8A54] opacity-60 pointer-events-none" />
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      الاسم <span className="text-[#1F8A54]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="اسمك الكريم"
                      className="w-full pr-10 pl-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'var(--bg-base)', border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
                      onFocus={e => { e.currentTarget.style.borderColor='#1F8A54'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(31,138,84,0.12)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none' }}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Phone size={15} className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-[#1F8A54] opacity-60 pointer-events-none" />
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      رقم الجوال <span className="text-[#1F8A54]">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+967 7XX XXX XXX"
                      className="w-full pr-10 pl-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'var(--bg-base)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', direction: 'ltr' }}
                      onFocus={e => { e.currentTarget.style.borderColor='#1F8A54'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(31,138,84,0.12)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none' }}
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <Mail size={15} className="absolute right-3 top-10 text-[#1F8A54] opacity-60 pointer-events-none" />
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                    البريد الإلكتروني <span className="text-[var(--text-secondary)] text-xs font-normal">(اختياري)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-10 pl-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-base)', border: '1.5px solid var(--border)', color: 'var(--text-primary)', direction: 'ltr' }}
                    onFocus={e => { e.currentTarget.style.borderColor='#1F8A54'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(31,138,84,0.12)' }}
                    onBlur={e  => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none' }}
                  />
                </div>
              </div>

              {/* ملخص الطلب */}
              <div
                className="rounded-2xl p-4 mt-2"
                style={{ background: 'rgba(31,138,84,0.06)', border: '1px solid rgba(31,138,84,0.2)' }}
              >
                <p className="text-xs font-bold text-[#1F8A54] mb-2">ملخص طلبك:</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">الخدمات: </span>
                  {selectedServices.map(id => SERVICE_OPTIONS.find(s => s.id === id)?.label).join('، ')}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  <span className="font-semibold text-[var(--text-primary)]">الميزانية: </span>
                  {budgetOption === 'b6' ? `${customBudget} ${currency}` : `${BUDGET_OPTIONS.find(b => b.id === budgetOption)?.label} ${currency}`}
                </p>
              </div>
            </div>
          )}

          {/* ─── أزرار التنقل ─── */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'var(--bg-base)', border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <ArrowRight size={16} /> السابق
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg,#1F8A54,#2ecc71)',
                  boxShadow: canNext() ? '0 6px 20px rgba(31,138,84,0.35)' : 'none',
                }}
              >
                التالي <ArrowLeft size={16} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg,#25D366,#128C7E)',
                  boxShadow: canNext() ? '0 6px 20px rgba(37,211,102,0.4)' : 'none',
                }}
              >
                <Send size={15} /> إرسال عبر واتساب
              </button>
            )}
          </div>
        </div>

        {/* نص تطمين */}
        <p className="text-center text-xs text-[var(--text-secondary)] mt-4 flex items-center justify-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#25D366] inline-block" />
          سيتم إرسال طلبك مباشرة عبر واتساب — استجابة خلال 24 ساعة
        </p>
      </div>
    </section>
  )
}

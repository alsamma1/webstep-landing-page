import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerClient, isSupabaseConfigured } from '@/lib/supabase-server'

const orderSchema = z.object({
  formType: z.literal('order'),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(20),
  email: z.string().trim().email().or(z.literal('')).optional(),
  company: z.string().max(150).optional(),
  service: z.string().min(1).max(150),
  budget: z.string().min(1).max(100),
  timeline: z.string().max(100).optional(),
  notes: z.string().max(4000).optional(),
  answers: z.record(z.string(), z.unknown()).optional(),
  region: z.enum(['ye', 'sa', 'global']).optional(),
})

const messageSchema = z.object({
  formType: z.enum(['message', 'career']),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(20),
  email: z.string().trim().email().or(z.literal('')),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(2).max(4000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const schema = body?.formType === 'order' ? orderSchema : messageSchema
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'بيانات غير صحيحة',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = result.data
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: 'الخدمة غير متاحة مؤقتاً' }, { status: 503 })
    }
    const client = getServerClient()
    const query = data.formType === 'order'
      ? client.from('orders').insert({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          company: data.company || null,
          service: data.service,
          budget: data.budget,
          timeline: data.timeline || 'مرن',
          notes: data.notes || '',
          answers: data.answers || {},
          status: 'new',
          region: data.region || 'global',
        })
      : client.from('messages').insert({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          subject: data.subject,
          message: data.message,
          source: data.formType === 'career' ? 'careers_form' : 'contact_form',
        })
    const { error } = await query
    if (error) {
      console.error('Supabase public form insert failed:', error.message)
      return NextResponse.json({ success: false, error: 'تعذر حفظ البيانات، يرجى المحاولة لاحقاً' }, { status: 502 })
    }

    return NextResponse.json(
      {
        success: true,
        message: data.formType === 'order'
          ? 'تم استلام طلبك بنجاح. سنتواصل معك خلال 24 ساعة.'
          : 'تم استلام رسالتك بنجاح.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[WebStep Contact] Error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

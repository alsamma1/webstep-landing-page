import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'WebStep API is running',
    version: '1.0.0',
    endpoints: {
      contact: 'POST /api/contact',
      orders: 'GET /api/orders (admin only)',
    },
  })
}

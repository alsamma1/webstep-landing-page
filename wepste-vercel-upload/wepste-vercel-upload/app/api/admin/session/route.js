import { NextResponse } from 'next/server';
import {
  adminSessionCookieName,
  adminSessionMaxAge,
  isAdminEmail,
} from '../../../../lib/admin-auth';
import { getFirebaseAdminAuth } from '../../../../lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getRequestProtocol(request) {
  return (
    request.headers
      .get('x-forwarded-proto')
      ?.split(',')[0]
      ?.trim() || new URL(request.url).protocol.slice(0, -1)
  );
}

function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
    const host = forwardedHost || request.headers.get('host');
    const protocol = getRequestProtocol(request);
    if (!host || !['http', 'https'].includes(protocol)) return false;

    const expectedOrigin = new URL(`${protocol}://${host}`).origin;
    const originUrl = new URL(origin);
    if (originUrl.origin !== expectedOrigin) return false;

    const fetchSite = request.headers.get('sec-fetch-site');
    return !fetchSite || fetchSite === 'same-origin';
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'طلب غير صالح.' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'تعذر قراءة طلب تسجيل الدخول.' }, { status: 400 });
  }

  const idToken = typeof body?.idToken === 'string' ? body.idToken : '';
  if (!idToken || idToken.length > 10_000) {
    return NextResponse.json({ message: 'بيانات تسجيل الدخول غير صالحة.' }, { status: 400 });
  }

  const firebaseAuth = getFirebaseAdminAuth();
  if (!firebaseAuth) {
    return NextResponse.json(
      { message: 'إعداد Firebase Admin غير مكتمل على الخادم.' },
      { status: 503 },
    );
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken, true);
    if (!decodedToken.email_verified || !isAdminEmail(decodedToken.email)) {
      return NextResponse.json({ message: 'هذا الحساب غير مخوّل لإدارة الطلبات.' }, { status: 403 });
    }

    const sessionCookie = await firebaseAuth.createSessionCookie(idToken, {
      expiresIn: adminSessionMaxAge,
    });
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: adminSessionCookieName,
      value: sessionCookie,
      httpOnly: true,
      secure: getRequestProtocol(request) === 'https',
      sameSite: 'strict',
      path: '/',
      maxAge: adminSessionMaxAge / 1000,
    });
    return response;
  } catch (error) {
    console.error('Admin session creation failed:', error);
    return NextResponse.json({ message: 'تعذر التحقق من الحساب. حاول تسجيل الدخول مجددًا.' }, { status: 401 });
  }
}

export async function DELETE(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'طلب غير صالح.' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: adminSessionCookieName,
    value: '',
    httpOnly: true,
    secure: getRequestProtocol(request) === 'https',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}

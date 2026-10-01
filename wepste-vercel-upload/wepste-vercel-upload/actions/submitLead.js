'use server';

import { adminServerTimestamp, getFirebaseAdminDb } from '../lib/firebase-admin';

const sanitize = (value, maxLength) =>
  String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);

export async function submitLeadAction(formData) {
  const clientName = sanitize(formData.get('clientName'), 120);
  const phoneNumber = sanitize(formData.get('phoneNumber'), 20);
  const email = sanitize(formData.get('email'), 254).toLowerCase();
  const projectDescription = sanitize(formData.get('projectDescription'), 5000);

  const errors = {};
  if (!clientName || clientName.length < 2) errors.clientName = 'يرجى إدخال اسم العميل.';
  if (!/^\+?[1-9]\d{7,14}$/.test(phoneNumber.replace(/[\s()-]/g, ''))) {
    errors.phoneNumber = 'يرجى كتابة رقم هاتف صحيح مع رمز الدولة، مثل +966500000000.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
  if (!projectDescription || projectDescription.length < 20) errors.projectDescription = 'يرجى وصف المشروع بشكل واضح.';

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'يرجى تصحيح الحقول المطلوبة قبل الإرسال.', errors };
  }

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      console.error(
        'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and service-account credentials.',
      );
      return {
        success: false,
        message:
          'خدمة حفظ الطلبات غير مهيأة في الاستضافة. لم يُسجّل طلبك؛ تواصل معنا عبر واتساب.',
        errors: {},
        canContactOnWhatsApp: true,
      };
    }

    await adminDb.collection('leads').add({
      clientName,
      phoneNumber,
      email,
      projectDescription,
      status: 'new',
      createdAt: adminServerTimestamp(),
    });

    return { success: true, message: 'تم إرسال طلبك بنجاح. سيتم التواصل معك في أقرب وقت.' };
  } catch (error) {
    console.error('submitLeadAction failed:', error);
    const isMissingDatabase = error?.code === 5 || error?.code === 'not-found';
    const isPermissionDenied =
      error?.code === 7 || error?.code === 'permission-denied';
    const message = isMissingDatabase
      ? 'قاعدة بيانات الطلبات غير مفعّلة في Firebase. لم يُسجّل طلبك؛ تواصل معنا عبر واتساب.'
      : isPermissionDenied
        ? 'حساب خدمة الموقع لا يملك صلاحية حفظ الطلبات في Firestore. لم يُسجّل طلبك؛ تواصل عبر واتساب.'
        : 'تعذر الاتصال بقاعدة بيانات الطلبات. لم يُسجّل طلبك؛ حاول مجددًا أو تواصل عبر واتساب.';

    return {
      success: false,
      message,
      errors: {},
      canContactOnWhatsApp: true,
    };
  }
}

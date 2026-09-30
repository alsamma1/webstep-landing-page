'use server';

import { adminDb, adminServerTimestamp, isFirebaseAdminConfigured } from '../lib/firebase-admin';

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

  if (!isFirebaseAdminConfigured) {
    console.error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and service-account credentials.',
    );
    return {
      success: false,
      message: 'خدمة استقبال الطلبات غير مهيأة بعد. يرجى المحاولة لاحقًا.',
      errors: {},
    };
  }

  try {
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
    return { success: false, message: 'تعذر حفظ الطلب الآن. يرجى المحاولة لاحقًا.', errors: {} };
  }
}

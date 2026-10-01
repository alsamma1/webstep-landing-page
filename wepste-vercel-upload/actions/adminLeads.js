'use server';

import { getAdminSession } from '../lib/admin-auth';
import { getFirebaseAdminDb } from '../lib/firebase-admin';
import { leadStatusValues } from '../lib/lead-status';

async function getAuthorizedDatabase() {
  const session = await getAdminSession();
  if (!session) return { error: 'انتهت جلسة الدخول. سجّل الدخول مجددًا.' };

  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Firebase Admin Firestore is not configured.');
  return { db };
}

export async function getAdminLeadsAction() {
  try {
    const { db, error } = await getAuthorizedDatabase();
    if (error) return { success: false, message: error };

    const snapshot = await db
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const leads = snapshot.docs.map((document) => {
      const data = document.data();
      const createdAt = data.createdAt?.toDate?.();

      return {
        id: document.id,
        clientName: typeof data.clientName === 'string' ? data.clientName : '',
        phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber : '',
        email: typeof data.email === 'string' ? data.email : '',
        projectDescription:
          typeof data.projectDescription === 'string' ? data.projectDescription : '',
        status: leadStatusValues.has(data.status) ? data.status : 'new',
        createdAt: createdAt ? createdAt.toISOString() : null,
      };
    });

    return { success: true, leads };
  } catch (error) {
    console.error('getAdminLeadsAction failed:', error);
    return {
      success: false,
      message: 'تعذر تحميل الطلبات. تحقق من إعداد Firebase وسجّل المحاولة مجددًا.',
    };
  }
}

export async function updateLeadStatusAction(leadId, status) {
  if (
    typeof leadId !== 'string' ||
    !/^[A-Za-z0-9_-]{1,150}$/.test(leadId) ||
    typeof status !== 'string' ||
    !leadStatusValues.has(status)
  ) {
    return { success: false, message: 'بيانات تحديث الطلب غير صالحة.' };
  }

  try {
    const { db, error } = await getAuthorizedDatabase();
    if (error) return { success: false, message: error };

    const leadReference = db.collection('leads').doc(leadId);
    const lead = await leadReference.get();
    if (!lead.exists) return { success: false, message: 'لم يتم العثور على هذا الطلب.' };

    await leadReference.update({ status });
    return { success: true };
  } catch (error) {
    console.error('updateLeadStatusAction failed:', error);
    return { success: false, message: 'تعذر تحديث حالة الطلب. حاول مجددًا.' };
  }
}

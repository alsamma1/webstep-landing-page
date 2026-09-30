import 'server-only';

import { getFirebaseAdminDb } from '../lib/firebase-admin';

const serviceSeed = [
  {
    title: 'بناء صفحات الهبوط (Landing Pages)',
    description: 'صفحات هبوط عالية الأداء مصممة لتحويل الزوار إلى عملاء عبر استراتيجيات تسويق رقمية متقدمة وأداء شبه فوري في محركات البحث.',
    category: 'marketing',
    icon: 'rocket',
  },
  {
    title: 'تطوير المواقع الإلكترونية ومتاجر الويب',
    description: 'مواقع احترافية ومتاجر إلكترونية حديثة تعكس هوية العلامة التجارية وتدعم مبيعات رقمية مستدامة عبر واجهات ذكية ومتجاوبة.',
    category: 'web',
    icon: 'building',
  },
  {
    title: 'الأنظمة البرمجية السحابية وأنظمة ERP',
    description: 'حلول ERP متكاملة تدعم المحاسبة، المخزون، الموارد البشرية، والعمليات التشغيلية داخل منصة موحدة ونظام متكامل.',
    category: 'erp',
    icon: 'cloud',
  },
  {
    title: 'تطوير تطبيقات الهواتف والويب الذكية',
    description: 'تطبيقات ذكية مصممة عبر المنصات المختلفة لتحسين تجربة المستخدم، تسريع الأعمال، وتقديم خدمات رقمية متكاملة.',
    category: 'mobile',
    icon: 'workflow',
  },
];

export async function seedCMS() {
  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      console.error('Cannot seed services because Firebase Admin is not configured.');
      return { seeded: false, error: 'Firebase Admin is not configured' };
    }

    const services = adminDb.collection('services');
    return await adminDb.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(services.limit(1));
      if (!snapshot.empty) return { seeded: false, count: snapshot.size };

      serviceSeed.forEach((service, index) => {
        transaction.create(services.doc(`service-${index + 1}`), {
          ...service,
          createdAt: new Date(),
        });
      });

      return { seeded: true, count: serviceSeed.length };
    });
  } catch (error) {
    console.error('seedCMS failed:', error);
    return { seeded: false, error: 'Failed to seed services in Firestore' };
  }
}

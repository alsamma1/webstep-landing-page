export const leadStatuses = [
  { value: 'new', label: 'طلب جديد' },
  { value: 'reviewing', label: 'قيد الدراسة والمراجعة' },
  { value: 'contacted', label: 'تم الاتصال وإرسال عرض سعر' },
  { value: 'cancelled', label: 'طلب ملغي أو غير جدي' },
];

export const leadStatusValues = new Set(leadStatuses.map(({ value }) => value));

export function getLeadStatusLabel(status) {
  return leadStatuses.find((option) => option.value === status)?.label ?? 'طلب جديد';
}

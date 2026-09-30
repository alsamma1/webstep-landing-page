import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ phoneNumber = '+966500000000' }) {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
  const message = encodeURIComponent('السلام عليكم، أود الاستفسار عن بناء مواقع إلكترونية متقدمة، تطبيقات ذكية، وأنظمة ERP مخصصة للشركة.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="التواصل عبر واتساب"
      className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_rgba(37,211,102,0.42)] transition duration-300 hover:-translate-y-1 hover:scale-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
    </a>
  );
}

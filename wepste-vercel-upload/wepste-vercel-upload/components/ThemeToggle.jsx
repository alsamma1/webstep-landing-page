import { Moon, SunMedium } from 'lucide-react';

export default function ThemeToggle() {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="التبديل بين الوضعين الفاتح والداكن"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur-none transition hover:-translate-y-0.5 hover:shadow-md sm:bg-white/80 sm:backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 sm:dark:bg-slate-900/80 dark:text-slate-200"
    >
      <Moon aria-hidden="true" className="h-4 w-4 dark:hidden" />
      <SunMedium aria-hidden="true" className="hidden h-4 w-4 dark:block" />
    </button>
  );
}

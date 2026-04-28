"use client";

import { useLang } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const { lang, toggle } = useLang();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center gap-1 h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-all",
        className
      )}
      title={lang === "fr" ? "Switch to English" : "Passer en français"}
    >
      <span className={cn("transition-all", lang === "fr" ? "text-gray-900 font-bold" : "text-gray-400")}>FR</span>
      <span className="text-gray-300">/</span>
      <span className={cn("transition-all", lang === "en" ? "text-gray-900 font-bold" : "text-gray-400")}>EN</span>
    </button>
  );
}

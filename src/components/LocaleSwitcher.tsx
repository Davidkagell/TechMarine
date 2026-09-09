"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

const LOCALES: Record<
  AppLocale,
  { name: string; flag: string }
> = {
  sv: { name: "Svenska", flag: "🇸🇪" },
  en: { name: "English", flag: "🇬🇧" },
};

export default function LocaleSwitcher() {
  const t = useTranslations("footer");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const currentLanguage = LOCALES[locale] ?? LOCALES.sv;

  const close = useEffectEvent(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);


  return (
    <div className="relative mr-35" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-marine-dark-blue focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label={t("languageLabel")}
      >
        <span className="text-lg leading-none" aria-hidden="true">
          {currentLanguage.flag}
        </span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="listbox"
          aria-label={t("languageLabel")}
          className={`absolute right-0 bottom-full z-50 mb-2 w-48 rounded-md border border-foreground/15 bg-background py-1 shadow-lg ring-1 ring-black/5 `}
        >
          {routing.locales.map((code) => {
            const language = LOCALES[code];
            const isActive = code === locale;

            return (
              <Link
                key={code}
                href={pathname}
                locale={code}
                hrefLang={code}
                role="option"
                aria-selected={isActive}
                onClick={() => setIsOpen(false)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-foreground/5 ${
                  isActive
                    ? "bg-foreground/5 font-medium text-tech-marine-dark-blue"
                    : "text-foreground/80"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  {language.flag}
                </span>
                <span>{language.name}</span>
                {isActive ? (
                  <span className="ml-auto text-tech-marine-dark-blue" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

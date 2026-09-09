"use client";

import { hasLocale, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  categoryHref,
  getChildren,
  getRootCategories,
} from "@/lib/categories";
import { routing } from "@/i18n/routing";

export default function ProductsNav() {
  const t = useTranslations("nav");
  const requestedLocale = useLocale();
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const roots = getRootCategories();

  return (
    <li className="group relative">
      <Link
        href="/products"
        className="inline-flex h-20 items-center"
      >
        {t("products")}
      </Link>
      <div className="invisible absolute top-full left-0 z-50 min-w-72 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-xl border border-black/10 bg-background p-3 shadow-lg dark:border-white/15">
          <ul className="grid gap-3">
            {roots.map((root) => {
              const children = getChildren(root.id);
              return (
                <li key={root.id}>
                  <Link
                    href={categoryHref(root.id)}
                    className="block text-sm font-semibold text-foreground hover:text-price-color"
                  >
                    {root.name[locale]}
                  </Link>
                  <ul className="mt-1.5 space-y-1 border-l border-foreground/10 pl-3">
                    {children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={categoryHref(child.id)}
                          className="block text-sm text-foreground/75 hover:text-foreground"
                        >
                          {child.name[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

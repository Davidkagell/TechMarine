"use client";

import { hasLocale, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryHref, getRootCategories } from "@/lib/categories";
import { routing } from "@/i18n/routing";

export default function CategoryTiles() {
  const t = useTranslations("home");
  const requestedLocale = useLocale();
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const roots = getRootCategories();

  return (
    <section className="category-tiles py-16 px-6 sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="category-tiles__heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("categoriesHeading")}
        </h2>
        <div className="category-tiles__grid mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roots.map((category) => (
            <Link
              key={category.id}
              href={categoryHref(category.id)}
              className="category-tile group relative overflow-hidden rounded-lg border border-black/10 bg-background p-6 shadow-sm transition hover:border-price-color hover:shadow-md dark:border-white/15"
            >
              <h3 className="category-tile__name text-lg font-semibold text-foreground transition group-hover:text-price-color">
                {category.name[locale]}
              </h3>
              <div className="category-tile__arrow mt-2 text-sm text-foreground/60 transition group-hover:text-price-color">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

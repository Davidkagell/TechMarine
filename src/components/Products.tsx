import { hasLocale, useLocale, useTranslations } from "next-intl";
import ProductCard from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import { categoryHref } from "@/lib/categories";
import { routing } from "@/i18n/routing";
import {
  formatProductPrice,
  groupProductsByRootCategory,
} from "@/lib/products";

const MISSING_IMAGE = "/image-missing.jpg";

export default function Products() {
  const t = useTranslations();
  const requestedLocale = useLocale();
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const groups = groupProductsByRootCategory(locale);

  return (
    <main className="mx-auto w-full max-w-6xl px-10 py-6 pb-24">
      <h1 className="text-2xl font-semibold">{t("productsPage.title")}</h1>
      {groups.map((group) => (
        <section key={group.root.id} className="mt-10">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-price-color">
              <Link
                href={categoryHref(group.root.id)}
                className="hover:underline"
              >
                {group.label}
              </Link>
            </h2>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-foreground/65">
              {group.leafGroups.map((leaf) => (
                <li key={leaf.category.id}>
                  <Link
                    href={categoryHref(leaf.category.id)}
                    className="hover:text-foreground hover:underline"
                  >
                    {leaf.category.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.id}`}
                  className="block h-full transition hover:opacity-90"
                >
                  <ProductCard
                    name={product.name[locale]}
                    articleLabel={t("productsPage.articleNumber", {
                      manufacturer: product.manufacturer,
                      number: product.articleNumber,
                    })}
                    description={product.description[locale]}
                    image={product.images[0] || ""}
                    fallbackImage={MISSING_IMAGE}
                    priceLabel={formatProductPrice(
                      locale,
                      product.price,
                      product.currency,
                    )}
                    quantity={product.quantity}
                    inStockLabel={t("productsPage.inStock", {
                      count: product.quantity,
                    })}
                    outOfStockLabel={t("productsPage.outOfStock")}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

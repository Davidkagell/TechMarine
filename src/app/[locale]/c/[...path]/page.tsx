import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import {
  categories,
  categoryHref,
  getCategoryBySlugPath,
  getCategoryChain,
  getChildren,
  getCategorySlugPath,
} from "@/lib/categories";
import { routing } from "@/i18n/routing";
import {
  formatProductPrice,
  getProductsByCategoryId,
} from "@/lib/products";

const MISSING_IMAGE = "/image-missing.jpg";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categories.map((category) => ({
      locale,
      path: getCategorySlugPath(category.id),
    })),
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; path: string[] }>;
}) {
  const { locale: requestedLocale, path } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const category = getCategoryBySlugPath(path);
  if (!category) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "productsPage" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const children = getChildren(category.id);
  const products = getProductsByCategoryId(category.id);
  const chain = getCategoryChain(category.id);

  const breadcrumbs = [
    { label: tNav("products"), href: "/products" },
    ...chain.map((node, index) => ({
      label: node.name[locale],
      href: index < chain.length - 1 ? categoryHref(node.id) : undefined,
    })),
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-10 py-6 pb-24">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-2xl font-semibold">{category.name[locale]}</h1>

      {children.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => {
            const count = getProductsByCategoryId(child.id).length;
            return (
              <li key={child.id}>
                <Link
                  href={categoryHref(child.id)}
                  className="block rounded-xl border border-foreground/10 p-5 transition hover:border-foreground/25 hover:bg-foreground/5"
                >
                  <span className="block text-lg font-semibold">
                    {child.name[locale]}
                  </span>
                  <span className="mt-1 block text-sm text-foreground/60">
                    {t("categoryProductCount", { count })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : products.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}`}
                className="block h-full transition hover:opacity-90"
              >
                <ProductCard
                  name={product.name[locale]}
                  articleLabel={t("articleNumber", {
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
                  inStockLabel={t("inStock", { count: product.quantity })}
                  outOfStockLabel={t("outOfStock")}
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-foreground/65">{t("categoryEmpty")}</p>
      )}
    </main>
  );
}

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCardItem } from "@/components/ProductCardItem";
import {
  categoryHref,
  getCategoryChain,
} from "@/lib/categories";
import { routing } from "@/i18n/routing";
import {
  formatProductPrice,
  getProductById,
  products,
} from "@/lib/products";

const MISSING_IMAGE = "/image-missing.jpg";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({ locale, id: product.id })),
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: requestedLocale, id } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "productsPage" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const chain = getCategoryChain(product.categoryId);

  const breadcrumbs = [
    { label: tNav("products"), href: "/products" },
    ...chain.map((node) => ({
      label: node.name[locale],
      href: categoryHref(node.id),
    })),
    { label: product.name[locale] },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-10 py-6 pb-24">
      <Breadcrumbs items={breadcrumbs} />
      <ProductCardItem
        name={product.name[locale]}
        articleLabel={t("articleNumber", {
          manufacturer: product.manufacturer,
          number: product.articleNumber,
        })}
        description={product.description[locale]}
        images={product.images}
        fallbackImage={MISSING_IMAGE}
        priceLabel={formatProductPrice(locale, product.price, product.currency)}
        quantity={product.quantity}
        inStockLabel={t("inStock", { count: product.quantity })}
        outOfStockLabel={t("outOfStock")}
      />
    </main>
  );
}

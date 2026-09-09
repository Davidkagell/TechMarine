import Image from "next/image";
import { useTranslations } from "next-intl";
import HeaderSearch from "@/components/HeaderSearch";
import ProductsNav from "@/components/ProductsNav";
import { org } from "@/config/org";
import { Link } from "@/i18n/navigation";

export default function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 flex flex-row items-center justify-between gap-4 border-b-2 bg-tech-marine-light-blue px-4 sm:px-10">
      <div className="flex flex-row items-center justify-center gap-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/products/company-logo.png"
            alt={org.name}
            width={64}
            height={64}
            priority
            className="h-16 w-16 object-cover"
          />
        </Link>
        <nav>
          <ul className="flex h-20 flex-row items-center gap-5">
            <li>
              <Link href="/">{t("start")}</Link>
            </li>
            <ProductsNav />
            <li>
              <Link href="/about">{t("about")}</Link>
            </li>
            <li>
              <Link href="/contact">{t("contact")}</Link>
            </li>
          </ul>
        </nav>
      </div>
      <HeaderSearch />
    </header>
  );
}

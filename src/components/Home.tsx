import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const secondaryLinks = [
  { href: "/c/motor/motorolja", labelKey: "ctaOil" as const },
  { href: "/c/motor/oljefilter", labelKey: "ctaFilters" as const },
  { href: "/c/elsystem/pumpar", labelKey: "ctaPumps" as const },
  { href: "/c/fortojning/tampar", labelKey: "ctaRope" as const },
];

export default function Home() {
  const t = useTranslations("home");

  return (
    <section className="home-campaign relative isolate flex min-h-[calc(40vh-5.5rem)] w-full items-center overflow-hidden">
      <div className="home-campaign__bg" aria-hidden="true" />
      <div className="home-campaign__wash" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
        <p className="home-campaign__brand text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          {t("brand")}
        </p>
        <h1 className="home-campaign__title mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-(--campaign-accent) sm:text-4xl">
          {t("campaignTitle")}
        </h1>
        <p className="home-campaign__lead mt-4 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
          {t("campaignLead")}
        </p>

        <div className="home-campaign__ctas mt-8 flex flex-wrap items-center gap-3">
          {secondaryLinks.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="home-campaign__btn-light border border-white/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <Link
            href="/products"
            className="home-campaign__btn-primary bg-(--campaign-cta) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--campaign-cta-hover)"
          >
            {t("ctaCampaign")}
          </Link>
        </div>
      </div>
    </section>
  );
}

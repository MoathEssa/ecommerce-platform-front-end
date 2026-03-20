import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingBag, CheckCircle2 } from "lucide-react";

interface AuthPageLayoutProps {
  children: ReactNode;
}

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
  const { t } = useTranslation("auth");

  const features = [
    t("brand.feature1"),
    t("brand.feature2"),
    t("brand.feature3"),
    t("brand.feature4"),
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Left brand panel (hidden on mobile) ── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary/70 p-12 text-white">
        {/* decorative blobs */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-sm">
          {/* Logo */}
          <div className="flex items-center justify-center rounded-2xl bg-white/15 p-5 shadow-xl ring-1 ring-white/20 backdrop-blur-sm">
            <ShoppingBag className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>

          {/* Brand name */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {t("brand.name")}
            </h1>
            <p className="mt-3 text-lg text-white/80 leading-relaxed">
              {t("brand.tagline")}
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3 self-start text-left">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-white/90"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span className="text-sm leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom attribution */}
        <p className="absolute bottom-6 text-xs text-white/40 z-10">
          © {new Date().getFullYear()} {t("brand.name")}. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
        {/* Mobile-only logo */}
        <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
          <div className="flex items-center justify-center rounded-xl bg-primary p-3">
            <ShoppingBag className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {t("brand.name")}
          </span>
        </div>

        {/* Form slot */}
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}

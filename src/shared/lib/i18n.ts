import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { zodI18nMap } from "zod-i18n-map";
import { z } from "zod";
import zodEn from "zod-i18n-map/locales/en/zod.json";

import authEn from "@features/auth/i18n/en";
import { layoutEn, layoutAr } from "@shared/components/layout/i18n";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      auth: authEn,
      layout: layoutEn,
      zod: zodEn,
    },
    ar: {
      layout: layoutAr,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  ns: ["auth", "layout", "zod"],
  defaultNS: "auth",
});

z.setErrorMap(zodI18nMap);

/**
 * Standalone (non-hook) `t` function for use outside React components,
 * e.g. in Redux middleware or utility files.
 */

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export default i18n;

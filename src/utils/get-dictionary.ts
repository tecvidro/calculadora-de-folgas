import type { Locale } from "@/i18n-config";
import type { Dictionary } from '@/Types/types';

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () =>
    import("../../dictionaries/en.json").then((module) => module.default as unknown as Dictionary),
  pt: () =>
    import("../../dictionaries/pt.json").then((module) => module.default as unknown as Dictionary),
  es: () =>
    import("../../dictionaries/es.json").then((module) => module.default as unknown as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.pt();

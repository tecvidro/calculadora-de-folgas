"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n, type Locale } from "../../../i18n-config";
import { Flag } from "../Flags";

export default function LocaleSwitcher() {
  const pathname = usePathname();

  const getCurrentLocale = (): Locale => {
    if (!pathname) {
      return i18n.defaultLocale;
    }
    const segments = pathname.split("/");
    const potentialLocale = segments[1] as Locale;
    return i18n.locales.includes(potentialLocale)
      ? potentialLocale
      : i18n.defaultLocale;
  };

  const currentLocale = getCurrentLocale();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) {
      return "/";
    }
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div>
      <ul className="flex gap-4">
        {i18n.locales
          .filter((locale) => locale !== currentLocale)
          .map((locale) => {
            return (
              <li className="group uppercase" key={locale}>
                <Link
                  className="flex items-center justify-center gap-2 rounded-sm px-2.5 py-1 group-hover:bg-white"
                  href={redirectedPathname(locale)}
                >
                  <div className="size-5 transition group-hover:scale-120">
                    <Flag locale={locale} />
                  </div>
                  <span className="group-hover:text-blue">{locale}</span>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

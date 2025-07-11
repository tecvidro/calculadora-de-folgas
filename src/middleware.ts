import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { i18n } from './i18n-config'

function getLocale(request: NextRequest): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  )

  const locale = matchLocale(languages, locales, i18n.defaultLocale)
  return locale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // If it's the root path, redirect to the default locale
  if (pathname === '/') {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}`) && pathname !== `/${locale}`
  )

  // If locale is missing for other paths, add locale prefix
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }
}

export const config = {
  matcher: [
    '/', // match root path
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

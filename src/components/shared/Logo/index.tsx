'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { i18n, type Locale } from '../../../i18n-config'

const logoVariants = cva('[&_svg]:size-full', {
  variants: {
    size: {
      lg: 'size-24',
      md: 'size-12',
      sm: 'size-8',
    },
    color: {
      dark: 'text-main',
      light: 'text-white print:text-main',
    },
  },
})

type LogoProps = VariantProps<typeof logoVariants>

export function Logo({ size = 'md', color = 'light' }: LogoProps) {
  const pathname = usePathname()

  const getCurrentLocale = (): Locale => {
    if (!pathname) {
      return i18n.defaultLocale
    }
    const segments = pathname.split('/')
    const potentialLocale = segments[1] as Locale
    return i18n.locales.includes(potentialLocale)
      ? potentialLocale
      : i18n.defaultLocale
  }

  const currentLocale = getCurrentLocale()

  return (
    <Link href={`/${currentLocale}`}>
      <div className={logoVariants({ size, color })}>
        <svg
          fill="none"
          height="328"
          viewBox="0 0 248 328"
          width="248"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Logotipo Tec</title>
          <path
            d="M0.789551 55.4113L55.3468 0.853973L247.211 0V55.4113H163.146L164.124 215.538L109.871 267.834L110.362 54.7391L0.789551 55.4113Z"
            fill="currentColor"
          />
          <path
            d="M97.5917 115.444L4.89087 208.228V264.422L97.5917 173.772"
            fill="currentColor"
          />
          <path
            d="M7.35181 275.498L98.0014 184.848V243.093L10.6329 328L7.35181 275.498Z"
            fill="#E35210"
          />
        </svg>
      </div>
    </Link>
  )
}

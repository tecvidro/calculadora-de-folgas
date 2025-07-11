'use client'
import { cva } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { i18n, type Locale } from '../../../i18n-config'

type LogoProps = {
  size?: 'lg' | 'md' | 'sm'
}

const logoVariants = cva('[&_svg]:size-full', {
  variants: {
    size: {
      lg: 'size-24',
      md: 'size-12',
      sm: 'size-8',
    },
  },
})

export function Logo({ size = 'md' }: LogoProps) {
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
      <div className={logoVariants({ size })}>
        <svg
          fill="none"
          height="38"
          viewBox="0 0 38 38"
          width="38"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Logotipo Tec</title>
          <circle cx="18.917" cy="18.9166" fill="#004282" r="18.917" />
          <circle cx="18.917" cy="18.9166" r="18.917" stroke="white" />
          <path
            d="M18.4599 5.09617L6.71703 11.8759C3.91362 13.4943 2.95032 17.0928 4.56955 19.8973L11.3525 31.6454C12.9718 34.4499 16.5698 35.4149 19.3719 33.7966L31.1161 27.0166C33.9195 25.3979 34.8828 21.7992 33.2637 18.9949L26.4807 7.2468C24.8616 4.44229 21.2636 3.47758 18.4599 5.09617Z"
            fill="#269DC9"
          />
          <path
            d="M12.3486 11.2972H25.4848V14.1951H20.6242V27.3407H17.2004V14.1951H12.3486V11.2972Z"
            fill="white"
          />
          <path
            d="M22.2909 16.5252H25.5282V17.3255H23.2427V18.2532H25.3405V18.9929H23.2427V20.054H25.5768V20.8542H22.2909V16.5252Z"
            fill="white"
          />
          <path
            d="M22.5185 23.1188C22.8696 22.7605 23.3163 22.5813 23.8583 22.5813C24.5837 22.5813 25.1141 22.8216 25.4498 23.3024C25.6351 23.5724 25.7345 23.8434 25.7481 24.1154H24.8441C24.786 23.9061 24.7114 23.7484 24.6202 23.6417C24.4574 23.4524 24.2161 23.3575 23.8966 23.3575C23.571 23.3575 23.3142 23.4912 23.1263 23.7591C22.9383 24.0268 22.8444 24.4052 22.8444 24.895C22.8444 25.3851 22.9431 25.7519 23.1408 25.9958C23.3386 26.2398 23.5898 26.3614 23.8945 26.3614C24.2071 26.3614 24.4452 26.2555 24.6094 26.0437C24.6999 25.93 24.7749 25.7584 24.8349 25.5305H25.7388C25.6608 26.0061 25.4615 26.3929 25.1405 26.6911C24.8199 26.9886 24.4088 27.1377 23.908 27.1377C23.2878 27.1377 22.8005 26.9368 22.4453 26.5352C22.0905 26.1318 21.9131 25.5786 21.9131 24.8758C21.9131 24.1157 22.1148 23.5301 22.5185 23.1188Z"
            fill="white"
          />
          <path
            d="M25.6862 6.78331H12.1276C8.8904 6.78331 6.2571 9.41803 6.2571 12.6565V26.2225C6.2571 29.461 8.8904 32.0957 12.1276 32.0957H25.6862C28.9234 32.0957 31.5572 29.461 31.5572 26.2225V12.6565C31.5572 9.41803 28.9234 6.78331 25.6862 6.78331ZM30.3398 26.2225C30.3398 28.7895 28.2522 30.8775 25.6862 30.8775H12.1276C9.56173 30.8775 7.47415 28.7895 7.47415 26.2225V12.6565C7.47415 10.0895 9.56173 8.00115 12.1276 8.00115H25.6862C28.2522 8.00115 30.3398 10.0895 30.3398 12.6565V26.2225Z"
            fill="white"
          />
        </svg>
      </div>
    </Link>
  )
}

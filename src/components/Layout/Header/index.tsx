import type { Locale } from '@/i18n-config'
import { InfosButton } from '../../../components/shared/InfosButton'
import { Logo } from '../../../components/shared/Logo'

type HeaderProps = {
  title: string
  lang: Locale
}

export function Header({ title, lang }: HeaderProps) {
  return (
    <header className="fixed z-50 flex w-full items-center justify-center bg-header-bg p-4 text-gray-300 shadow-sm-gray">
      <div className="flex w-full max-w-7xl items-center justify-between ">
        <Logo />
        <div>
          <h1 className="uppercase">{title}</h1>
        </div>
        <InfosButton lang={lang} />
      </div>
    </header>
  )
}

import { InfosButton } from '../../../components/shared/InfosButton'
import { Logo } from '../../../components/shared/Logo'
import LocaleSwitcher from '../../shared/LocaleSwitcher'

export function Footer() {
  return (
    <footer className="flex w-full items-center justify-center bg-header-bg p-4 text-gray-300 shadow-sm-gray-up">
      <div className="flex w-full max-w-7xl items-center justify-between ">
        <Logo size="sm" />
        <div>
          <LocaleSwitcher />
        </div>
        <InfosButton href="#" />
      </div>
    </footer>
  )
}

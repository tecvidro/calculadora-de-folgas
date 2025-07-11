import Link from 'next/link'

type InfosButtonProps = {
  href: string
}

export function InfosButton({ href }: InfosButtonProps) {
  return (
    <Link
      className="text-current transition hover:text-green active:text-blue"
      href={href}
    >
      <svg
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Infos button</title>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </Link>
  )
}

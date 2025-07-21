import type { ReactNode } from 'react'

type ContentProps = {
  children: ReactNode
}

export function Content({ children }: ContentProps) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-between gap-4 pt-24 print:pt-4">
      {children}
    </div>
  )
}

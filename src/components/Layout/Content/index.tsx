import type { ReactNode } from 'react'

type ContentProps = {
  children: ReactNode
}

export function Content({ children }: ContentProps) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-between pt-24">
      {children}
    </div>
  )
}

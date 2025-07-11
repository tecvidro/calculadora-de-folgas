import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return <div className="flex w-full max-w-7xl flex-col px-4">{children}</div>
}

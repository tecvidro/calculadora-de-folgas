import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return <div className="flex w-full flex-col px-4">{children}</div>
}

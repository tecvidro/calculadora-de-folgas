import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

const boxVariants = cva('rounded-md p-4', {
  variants: {
    variant: {
      dashed: 'border-1 border-gray-400 border-dashed bg-white',
      dashedDark: 'border-1 border-gray-100 border-dashed bg-none',
      gray: 'bg-gray-100',
      red: 'bg-red text-white',
      orange: 'bg-orange text-white',
      blue: 'bg-main text-white',
      white: 'bg-white',
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
})

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
  children: ReactNode
}

export const Box = ({
  children,
  className,
  variant = 'dashed',
  ...props
}: BoxProps) => {
  return (
    <div className={boxVariants({ variant, className })} {...props}>
      {children}
    </div>
  )
}

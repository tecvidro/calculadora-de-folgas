import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

const titleVariants = cva('text-xl', {
  variants: {
    variant: {
      title: 'font-bold',
      sectionTitle: 'w-full text-center font-normal uppercase',
    },
    align: {
      left: 'text-left',
      right: 'text-right',
      center: 'text-center',
    },
  },
  defaultVariants: {
    variant: 'title',
    align: 'left',
  },
})

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  children: ReactNode
}

export const Title = ({
  children,
  variant = 'title',
  align,
  className,
  ...props
}: TitleProps) => {
  return (
    <h2 className={titleVariants({ variant, align, className })} {...props}>
      {children}
    </h2>
  )
}

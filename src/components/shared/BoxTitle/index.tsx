import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

const titleVariants = cva('text-xl', {
  variants: {
    variant: {
      title: 'font-bold',
      sectionTitle: 'w-full text-center font-normal uppercase',
    },
  },
  defaultVariants: {
    variant: 'title',
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
  className,
  ...props
}: TitleProps) => {
  return (
    <h2 className={titleVariants({ variant, className })} {...props}>
      {children}
    </h2>
  )
}

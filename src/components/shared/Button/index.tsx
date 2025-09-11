import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowRight } from 'lucide-react'
import Link, { type LinkProps } from 'next/link'

const buttonVariants = cva(
  'flex w-full items-center justify-between rounded-md px-4 py-2 transition-colors duration-300',
  {
    variants: {
      intent: {
        primary: 'bg-accent text-white hover:bg-green-600',
        secondary:
          'border border-accent text-accent hover:border-green hover:bg-green hover:text-white',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
)

type ButtonProps = VariantProps<typeof buttonVariants> & {
  label: string
  onClick?: () => void
  target?: '_blank' | '_self'
} & LinkProps

const Button = ({
  label,
  intent,
  onClick,
  target = '_self',
  ...props
}: ButtonProps) => {
  return (
    <Link
      className={buttonVariants({ intent })}
      onClick={onClick}
      target={target}
      {...props}
    >
      <span>{label}</span>
      <ArrowRight size={18} />
    </Link>
  )
}

export default Button

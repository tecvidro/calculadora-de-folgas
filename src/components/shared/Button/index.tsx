import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const buttonVariants = cva(
  "flex items-center justify-between rounded-md px-4 py-2 text-white transition-colors duration-300",
  {
    variants: {
      variant: {
        primary: "bg-green hover:bg-green-600",
        secondary:
          "border border-green text-green hover:bg-green hover:text-white",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  link: string;
  label: string;
}

const Button = ({ link, label, variant }: ButtonProps) => {
  return (
    <Link className={buttonVariants({ variant })} href={link}>
      <span>{label}</span>
      <ArrowRight size={18} />
    </Link>
  );
};

export default Button;

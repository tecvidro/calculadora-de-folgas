import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link, { type LinkProps } from "next/link";

const buttonVariants = cva(
  "flex w-full items-center justify-between rounded-md px-4 py-2 transition-colors duration-300",
  {
    variants: {
      intent: {
        primary: "bg-green text-white hover:bg-green-600",
        secondary:
          "border border-green text-green hover:bg-green hover:text-white",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  label: string;
} & LinkProps;

const Button = ({ label, intent, ...props }: ButtonProps) => {
  return (
    <Link className={buttonVariants({ intent })} {...props}>
      <span>{label}</span>
      <ArrowRight size={18} />
    </Link>
  );
};

export default Button;

import Link from "next/link";

type InfosButtonProps = {
  href: string;
};

export function InfosButton({ href }: InfosButtonProps) {
  return (
    <Link
      href={href}
      className="text-current hover:text-green active:text-blue transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </Link>
  );
}

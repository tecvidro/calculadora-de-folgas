import { ReactNode } from "react";

type ContentProps = {
  children: ReactNode;
};

export function Content({ children }: ContentProps) {
  return (
    <div className="w-full flex flex-col items-center justify-between h-dvh  pt-24">
      {children}
    </div>
  );
}

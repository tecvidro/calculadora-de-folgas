import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export function Container({ children }: ContainerProps) {
  return <div className="w-full max-w-7xl flex flex-col px-4">{children}</div>;
}

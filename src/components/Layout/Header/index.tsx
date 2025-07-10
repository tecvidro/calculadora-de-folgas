import { InfosButton } from "@/components/shared/InfosButton";
import { Logo } from "@/components/shared/Logo";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-header-bg text-gray-300 p-4 shadow-sm-gray flex justify-center items-center fixed w-full">
      <div className="flex justify-between items-center w-full max-w-7xl ">
        <Logo />
        <div>
          <h1 className="uppercase">{title}</h1>
        </div>
        <InfosButton href="#" />
      </div>
    </header>
  );
}

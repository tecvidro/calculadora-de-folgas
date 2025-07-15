import { InfosButton } from "../../../components/shared/InfosButton";
import { Logo } from "../../../components/shared/Logo";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="fixed flex w-full items-center justify-center bg-header-bg p-4 text-gray-300 shadow-sm-gray">
      <div className="flex w-full max-w-7xl items-center justify-between ">
        <Logo />
        <div>
          <h1 className="uppercase">{title}</h1>
        </div>
        <InfosButton href={"/infos"} />
      </div>
    </header>
  );
}

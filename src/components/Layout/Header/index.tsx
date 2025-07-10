import { InfosButton } from "@/components/shared/InfosButton";
import { Logo } from "@/components/shared/Logo";

export function Header() {
  return (
    <header className="bg-header-bg text-gray-300 p-4 shadow-sm-gray flex justify-center items-center fixed w-full">
      <div className="flex justify-between items-center w-full max-w-7xl ">
        <Logo />
        <div>
          <h1 className="uppercase">Calculadora de folgas Tec</h1>
        </div>
        <InfosButton href="#" />
      </div>
    </header>
  );
}

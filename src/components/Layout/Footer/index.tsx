import { InfosButton } from "@/components/shared/InfosButton";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="bg-header-bg text-gray-300 p-4 shadow-sm-gray-up flex justify-center items-center  w-full">
      <div className="flex justify-between items-center w-full max-w-7xl ">
        <Logo size="sm" />
        <div>
          <h1 className="uppercase">LOCALE</h1>
        </div>
        <InfosButton href="#" />
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import Button from "../Button";

type CardProps = {
  name: string;
  model: string;
  subtitle: string;
  link: string;
  imageUrl: string;
};

export function Card({ name, model, subtitle, link, imageUrl }: CardProps) {
  return (
    <div className="flex flex-col gap-2">
      <Link className="flex flex-col gap-2" href={link}>
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded">
          <Image
            alt={`${model} - ${subtitle}`}
            className="h-full w-full object-cover"
            height={500}
            src={imageUrl}
            width={500}
          />
        </div>
        <span className="flex w-fit rounded-sm bg-blue px-2 py-1 text-sm text-white">
          {model}
        </span>
        <span className="text-2xl text-bold">{name}</span>
        <span className="text-lg/5">{subtitle}</span>
      </Link>
      <Button label="Abrir calculadora" link={link} variant="primary" />
    </div>
  );
}

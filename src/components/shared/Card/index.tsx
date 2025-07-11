import Image from "next/image";
import Link from "next/link";

type CardProps = {
  name: string;
  model: string;
  subtitle: string;
  link: string;
  imageUrl: string;
};

export function Card({ name, model, subtitle, link, imageUrl }: CardProps) {
  return (
    <Link href={link} className="flex flex-col gap-2">
      <div className="overflow-hidden rounded bg-red-100 w-full aspect-square flex justify-center items-center">
        <Image
          className="w-full h-full object-cover"
          src={imageUrl}
          width={500}
          height={500}
          alt={`${model} - ${subtitle}`}
        />
      </div>
      <span className="flex w-fit  px-2 py-1 bg-blue text-white text-sm rounded-sm">
        {model}
      </span>
      <span className="text-2xl text-bold">{name}</span>
      <span className="text-lg/5">{subtitle}</span>
    </Link>
  );
}

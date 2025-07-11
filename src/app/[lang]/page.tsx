import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils/get-dictionary";
import Link from "next/link";

export default async function Home(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const dictionary = await getDictionary(params.lang);
  return (
    <div>
      <h1 className="text-center uppercase ">{dictionary.globals.homeTitle}</h1>
      {!!dictionary.products &&
        dictionary.products.map((product) => (
          <Link key={product.slug} href={`/${params.lang}/${product.slug}`}>
            {product.name}
          </Link>
        ))}
    </div>
  );
}

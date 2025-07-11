import { Card } from "@/components/shared/Card";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils/get-dictionary";

export default async function Home(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const dictionary = await getDictionary(params.lang);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center uppercase ">{dictionary.globals.homeTitle}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {!!dictionary.products &&
          dictionary.products.map((product) => (
            <Card
              key={product.slug}
              {...product}
              link={`/${params.lang}/${product.slug}`}
            />
          ))}
      </div>
    </div>
  );
}

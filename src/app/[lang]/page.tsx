import type { Locale } from "@/i18n-config";
import { getDictionary } from "../../../get-dictionary";

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
          <div key={product.slug}>{product.name}</div>
        ))}
    </div>
  );
}

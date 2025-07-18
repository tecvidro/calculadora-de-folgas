import { Title } from "@/components/shared/BoxTitle";
import { Card } from "@/components/shared/Card";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils/get-dictionary";

export default async function Home(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const dictionary = await getDictionary(params.lang);
  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      <Title align="center" variant="sectionTitle">
        {dictionary.globals.homeTitle}
      </Title>
      <div className="grid w-full max-w-7xl grid-cols-2 gap-3 md:grid-cols-3">
        {!!dictionary.products &&
          dictionary.products.map((product) => (
            <Card
              key={product.slug}
              {...product}
              ctaLabel={dictionary.globals.callToActions.card}
              link={`/${params.lang}/${product.slug}`}
            />
          ))}
      </div>
    </div>
  );
}

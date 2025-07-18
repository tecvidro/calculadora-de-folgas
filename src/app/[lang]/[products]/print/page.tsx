import { Title } from "@/components/shared/BoxTitle";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils/get-dictionary";
import { PrintResults } from "@/components/Layout/PrintResults";

export default async function PrintPage(props: {
  params: Promise<{ lang: Locale; products: string }>;
}) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const product = dictionary.products.find(
    (item) => item.slug === params.products,
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      <Title align="center" variant="sectionTitle">
        {product.name}
      </Title>
      <PrintResults resultsLabels={dictionary.globals.resultsLabels} />
    </div>
  );
}

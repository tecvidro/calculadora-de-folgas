import { Alert } from "@/components/shared/Alert";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils/get-dictionary";

export default async function ProductCalculator(props: {
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
    <div className=" flex flex-col items-center gap-4">
      <h1 className="w-full text-center uppercase">{product.name}</h1>
      <p className="w-full text-center">{product.description}</p>
      <Alert text={dictionary.globals.alert} />
    </div>
  );
}

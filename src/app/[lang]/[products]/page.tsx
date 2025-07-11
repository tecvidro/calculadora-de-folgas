import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/utils/get-dictionary";

export default async function Product(props: {
  params: Promise<{ lang: Locale; products: string }>;
}) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);
  const product = dictionary.products.find(
    (product) => product.slug === params.products,
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1 className="text-center uppercase ">{product.name}</h1>
      <p>{product.description}</p>
      <p>{dictionary.globals.alert}</p>
    </div>
  );
}

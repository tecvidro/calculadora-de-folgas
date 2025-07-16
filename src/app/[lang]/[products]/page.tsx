import { CalculatorForm } from "@/components/CalculatorForm";
import { Title } from "@/components/shared/BoxTitle";
import { CalculatorProvider } from "@/context/calculator-context";
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

  const initialPanelsCount = product.content.filter(
    (item) => item.type === "panel",
  )[0].panelsCount;
  const initialDoorsCount = product.content.filter(
    (item) => item.type === "panel",
  )[0].doorsCount;
  const initialWidth = product.content.filter(
    (item) => item.type === "measure",
  )[0].defaultWidth;
  const initialHeight = product.content.filter(
    (item) => item.type === "measure",
  )[0].defaultHeight;
  const initialLockDiscounts = product.content.filter(
    (item) => item.type === "lock",
  )[0].defaultValues;

  return (
    <div className=" flex flex-col items-center gap-4">
      <Title variant="sectionTitle">{product.name}</Title>
      <p className="w-full text-center">{product.description}</p>
      <CalculatorProvider
        initialDoorsCount={initialDoorsCount}
        initialGapHeight={initialHeight}
        initialGapWidth={initialWidth}
        initialLockDiscounts={initialLockDiscounts}
        initialPanelCount={initialPanelsCount}
      >
        <CalculatorForm
          alertText={dictionary.globals.alert}
          dictionary={dictionary}
          product={product}
        />
      </CalculatorProvider>
    </div>
  );
}

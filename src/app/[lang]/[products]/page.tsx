import { CalculatorBuilder } from "@/components/Blocks/CalculatorBuilder";
import { Alert } from "@/components/shared/Alert";
import type { Locale } from "@/i18n-config";
import type { CalculatorBuilderProps } from "@/Types/types";
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

  const content: CalculatorBuilderProps = {
    content: [
      {
        type: "panel",
        id: 1,
        title: "Número de vidros",
        panelsLabel: "Número de painéis",
        panelsDescription:
          "Digite aqui o número de painéis que serão instalados entre as portas.",
        panelsCount: 4,
        doorsLabel: "Número de portas",
        doorsDescription:
          "Para este modelo temos portas nas duas laterais! Número não editável.",
        doorsCount: 2,
      },
      { type: "measure", id: 3, title: "Measure title" },
      { type: "lock", id: 2, title: "Lock title" },
      { type: "model", id: 4, title: "Model title" },
    ],
  };

  return (
    <div className=" flex flex-col items-center gap-4">
      <h1 className="w-full text-center uppercase">{product.name}</h1>
      <p className="w-full text-center">{product.description}</p>
      <Alert text={dictionary.globals.alert} />
      <CalculatorBuilder content={content.content} />
    </div>
  );
}

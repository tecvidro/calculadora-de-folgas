"use client";

import { CalculatorBuilder } from "@/components/Blocks/CalculatorBuilder";
import { Results } from "@/components/Layout/Results";
import { Title } from "@/components/shared/BoxTitle";
import Button from "@/components/shared/Button";
import type { Dictionary, Product } from "@/Types/types";
import ThreeScene from "../ThreeScene";

type CalculatorFormProps = {
  product: Product;
  alertText: string;
  dictionary: Dictionary;
};

export const CalculatorForm = ({
  product,
  dictionary,
}: CalculatorFormProps) => {
  return (
    <div className=" flex w-full max-w-7xl flex-col items-center gap-4">
      <section className="flex flex-col gap-4 md:grid md:grid-cols-[3fr_5fr]">
        <div className="flex flex-col gap-4">
          <CalculatorBuilder content={product.content} />
          <div className="flex flex-col gap-4 md:flex-row">
            <Button label={dictionary.globals.callToActions.print} link="print" target="_blank" />
            <Button
              intent="secondary"
              label={dictionary.globals.callToActions.manual}
              link="#"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Title title={`${product.name}`} variant="sectionTitle">
            {dictionary.globals.resultsLabels.title} {product.name}
          </Title>
          <Results resultsLabels={dictionary.globals.resultsLabels} />
          <ThreeScene
            filename={product.slug}
            labels={dictionary.globals.resultsLabels}
          />
        </div>
      </section>
    </div>
  );
};

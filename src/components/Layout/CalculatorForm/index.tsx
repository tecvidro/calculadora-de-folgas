'use client'

import { CalculatorBuilder } from '@/components/Blocks/CalculatorBuilder'
import { Results } from '@/components/Layout/Results'
import { Title } from '@/components/shared/BoxTitle'
import Button from '@/components/shared/Button'
import type { CalculatorTypes, Dictionary, Product } from '@/Types/types'

type CalculatorFormProps = {
  product: Product
  alertText: string
  dictionary: Dictionary
  productType: string
  calculatorType: CalculatorTypes
}

export const CalculatorForm = ({
  product,
  dictionary,
  productType,
  calculatorType,
}: CalculatorFormProps) => {
  return (
    <div className=" flex w-full max-w-7xl flex-col items-center gap-4">
      <section className="flex w-full flex-col gap-4 md:grid md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <CalculatorBuilder
            content={product.content}
            productType={productType}
          />
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              href={`${product.slug}/print`}
              label={dictionary.globals.callToActions.print}
            />
            <Button
              href={product.manualUrl}
              intent="secondary"
              label={dictionary.globals.callToActions.manual}
              target="_blank"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Title title={`${product.name}`} variant="sectionTitle">
            {dictionary.globals.resultsLabels.title} {product.name}
          </Title>
          <Results
            calculatorType={calculatorType}
            productType={productType}
            resultsLabels={dictionary.globals.resultsLabels}
          />
        </div>
      </section>
    </div>
  )
}

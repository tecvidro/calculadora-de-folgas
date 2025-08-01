'use client'

import { CalculatorBuilder } from '@/components/Blocks/CalculatorBuilder'
import { Results } from '@/components/Layout/Results'
import { Title } from '@/components/shared/BoxTitle'
import Button from '@/components/shared/Button'
import type { Dictionary, Product } from '@/Types/types'
import ThreeScene from '../ThreeScene'

type CalculatorFormProps = {
  product: Product
  alertText: string
  dictionary: Dictionary
  productType: string
}

export const CalculatorForm = ({
  product,
  dictionary,
  productType,
}: CalculatorFormProps) => {
  return (
    <div className=" flex w-full max-w-7xl flex-col items-center gap-4">
      <section className="flex flex-col gap-4 md:grid md:grid-cols-[3fr_5fr]">
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
            resultsLabels={dictionary.globals.resultsLabels}
            productType={productType}
          />
          <ThreeScene />
        </div>
      </section>
    </div>
  )
}

'use client'

import { CalculatorBuilder } from '@/components/Blocks/CalculatorBuilder'
import { Results } from '@/components/Layout/Results'
import { Alert } from '@/components/shared/Alert'
import type { Dictionary, Product } from '@/Types/types'

type CalculatorFormProps = {
  product: Product
  alertText: string
  dictionary: Dictionary
}

export const CalculatorForm = ({
  product,
  alertText,
  dictionary,
}: CalculatorFormProps) => {
  return (
    <div className=" flex flex-col items-center gap-4">
      <Alert text={alertText} />
      <section className="flex flex-col gap-4 md:grid md:grid-cols-2">
        <CalculatorBuilder content={product.content} />
        <Results
          callToactions={dictionary.globals.callToActions}
          product={product.name}
          resultsLabels={dictionary.globals.resultsLabels}
        />
      </section>
    </div>
  )
}

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
      <CalculatorBuilder content={product.content} />
      <Results product={product.name} resultsLabels={dictionary.globals.resultsLabels} />
    </div>
  )
}

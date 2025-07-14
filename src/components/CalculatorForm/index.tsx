'use client'

import { CalculatorBuilder } from '@/components/Blocks/CalculatorBuilder'
import { Results } from '@/components/Layout/Results'
import { Alert } from '@/components/shared/Alert'
import type { Product } from '@/Types/types'

type CalculatorFormProps = {
  product: Product
  alertText: string
}

export const CalculatorForm = ({ product, alertText }: CalculatorFormProps) => {
  return (
    <div className=" flex flex-col items-center gap-4">
      <h1 className="w-full text-center uppercase">{product.name}</h1>
      <p className="w-full text-center">{product.description}</p>
      <Alert text={alertText} />
      <CalculatorBuilder content={product.content} />
      <Results product={product.name} />
    </div>
  )
}

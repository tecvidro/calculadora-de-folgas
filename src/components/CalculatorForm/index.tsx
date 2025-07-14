'use client'

import { useState } from 'react'
import { CalculatorBuilder } from '@/components/Blocks/CalculatorBuilder'
import { Results } from '@/components/Layout/Results'
import { Alert } from '@/components/shared/Alert'
import type { Product } from '@/Types/types'

type CalculatorFormProps = {
  product: Product
  alertText: string
}

export const CalculatorForm = ({ product, alertText }: CalculatorFormProps) => {
  const [panelCount, setPanelCount] = useState(0)
  const [doorsCount, setDoorsCount] = useState(0)
  const [gapWidth, setGapWidth] = useState(0)
  const [gapHeight, setGapHeight] = useState(0)
  const [lockDiscount, setLockDiscount] = useState(0)

  return (
    <div className=" flex flex-col items-center gap-4">
      <h1 className="w-full text-center uppercase">{product.name}</h1>
      <p className="w-full text-center">{product.description}</p>
      <Alert text={alertText} />
      <CalculatorBuilder
        content={product.content}
        setDoorsCount={setDoorsCount}
        setGapHeight={setGapHeight}
        setGapWidth={setGapWidth}
        setLockDiscount={setLockDiscount}
        setPanelCount={setPanelCount}
      />
      <Results
        doorsCount={doorsCount}
        gapHeight={gapHeight}
        gapWidth={gapWidth}
        lockDiscount={lockDiscount}
        panelCount={panelCount}
        product={product.name}
      />
    </div>
  )
}

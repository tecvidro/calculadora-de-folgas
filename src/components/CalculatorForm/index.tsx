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
  const initialPanelsCount = product.content.filter(
    (item) => item.type === 'panel'
  )[0].panelsCount
  const initialDoorsCount = product.content.filter(
    (item) => item.type === 'panel'
  )[0].doorsCount
  const initialWidth = product.content.filter(
    (item) => item.type === 'measure'
  )[0].defaultWidth
  const initialHeight = product.content.filter(
    (item) => item.type === 'measure'
  )[0].defaultHeight
  const initialLockDiscounts = product.content.filter(
    (item) => item.type === 'lock'
  )[0].defaultValues

  const [panelCount, setPanelCount] = useState(initialPanelsCount)
  const [doorsCount, setDoorsCount] = useState(initialDoorsCount)
  const [gapWidth, setGapWidth] = useState(initialWidth)
  const [gapHeight, setGapHeight] = useState(initialHeight)
  const [lockDiscount, setLockDiscount] =
    useState<number[]>(initialLockDiscounts)

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

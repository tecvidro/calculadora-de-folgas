import { useState } from 'react'
import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import { useCalculator } from '@/context/calculator-context'
import type { MeasuresProps } from '@/Types/types'

export default function Measures({
  title,
  description,
  widthLabel,
  heightLabel,
  defaultWidth,
  defaultHeight,
  side = 'A',
}: MeasuresProps) {
  const { setGapWidth, setGapHeight, setGapWidthB, setGapHeightB } =
    useCalculator()
  const [gapWidth, setLocalGapWidth] = useState(defaultWidth)
  const [gapHeight, setLocalGapHeight] = useState(defaultHeight)

  const handleGapWidthChange = (value: number) => {
    setLocalGapWidth(value)
    switch (side) {
      case 'A':
        setGapWidth(value)
        break
      case 'B':
        setGapWidthB(value)
        break
      default:
        return null
    }
  }
  const handleGapHeightChange = (value: number) => {
    setLocalGapHeight(value)
    switch (side) {
      case 'A':
        setGapHeight(value)
        break
      case 'B':
        setGapHeightB(value)
        break
      default:
        return null
    }
  }

  return (
    <Box className="@container flex flex-col gap-4">
      <Title>{title}</Title>
      {!!description && <p>{description}</p>}
      <div className="container flex @lg:flex-row flex-col justify-between gap-4">
        <InputNumber
          hasPlusMinusButton={false}
          label={widthLabel}
          name="panels"
          onValueChange={(value) => handleGapWidthChange(value)}
          value={gapWidth}
        />
        <InputNumber
          hasPlusMinusButton={false}
          label={heightLabel}
          name="doors"
          onValueChange={(value) => handleGapHeightChange(value)}
          value={gapHeight}
        />
      </div>
    </Box>
  )
}

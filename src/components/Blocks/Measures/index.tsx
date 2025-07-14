import { useState } from 'react'
import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import { useCalculator } from '@/context/calculator-context'
import type { MeasuresProps } from '@/Types/types'

export default function Measures({
  title,
  widthLabel,
  heightLabel,
  defaultWidth,
  defaultHeight,
}: MeasuresProps) {
  const { setGapWidth, setGapHeight } = useCalculator()
  const [gapWidth, setLocalGapWidth] = useState(defaultWidth)
  const [gapHeight, setLocalGapHeight] = useState(defaultHeight)

  const handleGapWidthChange = (value: number) => {
    setLocalGapWidth(value)
    setGapWidth(value)
  }
  const handleGapHeightChange = (value: number) => {
    setLocalGapHeight(value)
    setGapHeight(value)
  }

  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <div className="flex justify-between gap-4">
        <InputNumber
          label={widthLabel}
          name="panels"
          onChange={(value) => handleGapWidthChange(value)}
          value={gapWidth}
        />
        <InputNumber
          label={heightLabel}
          name="doors"
          onChange={(value) => handleGapHeightChange(value)}
          value={gapHeight}
        />
      </div>
    </Box>
  )
}

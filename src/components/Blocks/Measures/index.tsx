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

  const handleGapWidthChange = (value: number) => {
    setGapWidth(value)
  }
  const handleGapHeightChange = (value: number) => {
    setGapHeight(value)
  }

  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <div className="flex justify-between gap-4">
        <InputNumber
          defaultValue={defaultWidth}
          label={widthLabel}
          name="panels"
          onChange={(value) => handleGapWidthChange(value)}
        />
        <InputNumber
          defaultValue={defaultHeight}
          label={heightLabel}
          name="doors"
          onChange={(value) => handleGapHeightChange(value)}
        />
      </div>
    </Box>
  )
}

import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import type { MeasuresProps } from '@/Types/types'

export default function Measures({
  title,
  widthLabel,
  heightLabel,
  defaultWidth,
  defaultHeight,
  setGapWidth,
  setGapHeight,
}: MeasuresProps) {
  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <div className="flex justify-between gap-4">
        <InputNumber
          defaultValue={defaultWidth}
          label={widthLabel}
          name="panels"
          onChange={setGapWidth}
        />
        <InputNumber
          defaultValue={defaultHeight}
          label={heightLabel}
          name="doors"
          onChange={setGapHeight}
        />
      </div>
    </Box>
  )
}

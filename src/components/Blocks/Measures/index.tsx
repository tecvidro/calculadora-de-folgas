import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import type { MeasuresProps } from '@/Types/types'

export default function Measures({
  title,
  widthLabel,
  heightLabel,
}: MeasuresProps) {
  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <div className="flex justify-between gap-4">
        <InputNumber defaultValue={4000} label={widthLabel} name="panels" />
        <InputNumber defaultValue={2400} label={heightLabel} name="doors" />
      </div>
    </Box>
  )
}

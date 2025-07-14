import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import type { PanelsProps } from '@/Types/types'

export default function Panels({
  title,
  panelsCount,
  panelsDescription,
  panelsLabel,
  doorsCount,
  doorsDescription,
  doorsLabel,
}: PanelsProps) {
  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <form>
        <InputNumber
          defaultValue={panelsCount}
          description={panelsDescription}
          label={panelsLabel}
          name="panels"
        />
        <InputNumber
          defaultValue={doorsCount}
          description={doorsDescription}
          disabled
          label={doorsLabel}
          name="doors"
        />
      </form>
    </Box>
  )
}

import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputOptions } from '@/components/shared/InputOptions'
import { useCalculator } from '@/context/calculator-context'
import type { ModelProps } from '@/Types/types'

export default function Model({
  title,
  description,
  options,
  label,
}: ModelProps) {
  const { useDefaultLockDiscounts, setUseDefaultLockDiscounts } =
    useCalculator()

  const booleanOptions = [
    { label: options[0].label, value: true },
    { label: options[1].label, value: false },
  ]

  return (
    <Box variant="dashed">
      <Title>{title}</Title>
      {!!description && <p>{description}</p>}
      <InputOptions
        label={label}
        name="model"
        onValueChange={setUseDefaultLockDiscounts}
        options={booleanOptions}
        value={useDefaultLockDiscounts}
      />
    </Box>
  )
}

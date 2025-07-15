import { v4 as uuidv4 } from 'uuid'
import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import { useCalculator } from '@/context/calculator-context'
import type { LockProps } from '@/Types/types'

export default function Lock({
  title,
  description,
  text,
  defaultValues,
  label,
  disabled = false,
}: LockProps) {
  const { lockDiscounts, setLockDiscounts, useDefaultLockDiscounts } =
    useCalculator()

  const handleLockChange = (index: number, value: number) => {
    setLockDiscounts((prevValues: number[]) => {
      const newValues = [...prevValues]
      newValues[index] = value
      return newValues
    })
  }

  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <p>{description}</p>
      <div className="flex justify-between gap-4">
        {(useDefaultLockDiscounts || !defaultValues.option
          ? defaultValues.default
          : defaultValues.option
        ).map((_, i) => (
          <InputNumber
            disabled={disabled}
            key={uuidv4()}
            label={`${label} ${i + 1}`}
            name={`${label}_${i + 1}`}
            onChange={(value) => handleLockChange(i, value)}
            value={lockDiscounts[i]}
          />
        ))}
      </div>
      {text?.map((item) => (
        <p key={item.index}>{item.text}</p>
      ))}
    </Box>
  )
}

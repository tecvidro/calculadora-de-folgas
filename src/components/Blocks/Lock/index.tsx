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
  side = 'A',
}: LockProps) {
  const {
    lockDiscounts,
    setLockDiscounts,
    useDefaultLockDiscounts,
    lockDiscountsB,
    setLockDiscountsB,
    useDefaultLockDiscountsB,
  } = useCalculator()

  const handleLockChange = (index: number, value: number) => {
    switch (side) {
      case 'A':
        setLockDiscounts((prevValues: number[]) => {
          const newValues = [...prevValues]
          newValues[index] = value
          return newValues
        })
        break
      case 'B':
        setLockDiscountsB((prevValues: number[]) => {
          const newValues = [...prevValues]
          newValues[index] = value
          return newValues
        })
        break
    }
  }

  return (
    <Box className="@container flex flex-col gap-4">
      <Title>{title}</Title>
      {!!description && <p>{description}</p>}
      <div className="container flex @lg:flex-row flex-col justify-between gap-4">
        {(useDefaultLockDiscounts || !defaultValues.option
          ? defaultValues.default
          : defaultValues.option
        ).map((_, i) => (
          <InputNumber
            disabled={disabled}
            key={uuidv4()}
            label={`${label} ${i + 1}`}
            name={`${label}_${i + 1}`}
            onValueChange={(value) => handleLockChange(i, value)}
            value={side === 'A' ? lockDiscounts[i] : lockDiscountsB[i]}
          />
        ))}
      </div>
      {text?.map((item) => (
        <p key={item.index}>{item.text}</p>
      ))}
    </Box>
  )
}

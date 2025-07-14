import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import type { LockProps } from '@/Types/types'

export default function Lock({
  title,
  description,
  text,
  defaultValue,
  label,
}: LockProps) {
  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <p>{description}</p>
      <div className="flex justify-between gap-4">
        <InputNumber
          defaultValue={defaultValue}
          label={`${label} 1`}
          name={`${label}_1`}
        />
        <InputNumber
          defaultValue={defaultValue}
          label={`${label} 2`}
          name={`${label}_2`}
        />
      </div>
      {text?.map((item) => (
        <p key={item.index}>{item.text}</p>
      ))}
    </Box>
  )
}

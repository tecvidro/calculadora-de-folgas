import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import type { LockProps } from '@/Types/types'
import { useEffect, useState } from 'react'

export default function Lock({
  title,
  description,
  text,
  defaultValue,
  label,
  setLockDiscount,
}: LockProps) {
  const [lock1, setLock1] = useState(defaultValue)
  const [lock2, setLock2] = useState(defaultValue)

  useEffect(() => {
    setLockDiscount(lock1 + lock2)
  }, [lock1, lock2, setLockDiscount])

  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <p>{description}</p>
      <div className="flex justify-between gap-4">
        <InputNumber
          defaultValue={defaultValue}
          label={`${label} 1`}
          name={`${label}_1`}
          onChange={setLock1}
        />
        <InputNumber
          defaultValue={defaultValue}
          label={`${label} 2`}
          name={`${label}_2`}
          onChange={setLock2}
        />
      </div>
      {text?.map((item) => (
        <p key={item.index}>{item.text}</p>
      ))}
    </Box>
  )
}

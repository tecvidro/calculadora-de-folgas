import { useState } from 'react'
import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'
import { InputNumber } from '@/components/shared/InputNumber'
import { useCalculator } from '@/context/calculator-context'
import type { PanelsProps } from '@/Types/types'

export default function Panels({
  title,
  panelsCount: initialPanelsCount,
  panelsDescription,
  panelsLabel,
  doorsCount: initialDoorsCount,
  doorsDescription,
  doorsLabel,
}: PanelsProps) {
  const { setPanelCount, setDoorsCount } = useCalculator()
  const [panelsCount, setLocalPanelsCount] = useState(initialPanelsCount)
  const [doorsCount, setLocalDoorsCount] = useState(initialDoorsCount)

  const handlePanelCountChange = (value: number) => {
    setLocalPanelsCount(value)
    setPanelCount(value)
  }

  const handleDoorsCountChange = (value: number) => {
    setLocalDoorsCount(value)
    setDoorsCount(value)
  }

  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <form>
        <InputNumber
          description={panelsDescription}
          label={panelsLabel}
          name="panels"
          onChange={handlePanelCountChange}
          value={panelsCount}
        />
        <InputNumber
          description={doorsDescription}
          disabled
          label={doorsLabel}
          name="doors"
          onChange={handleDoorsCountChange}
          value={doorsCount}
        />
      </form>
    </Box>
  )
}

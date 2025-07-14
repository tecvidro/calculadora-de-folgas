import type { CalculatorBuilderProps } from '@/Types/types'
import Lock from '../Lock'
import Measures from '../Measures'
import Model from '../Model'
import Panels from '../Panels'

export const CalculatorBuilder = ({
  content,
  setPanelCount,
  setDoorsCount,
  setGapWidth,
  setGapHeight,
  setLockDiscount,
}: CalculatorBuilderProps) => {
  if (!Array.isArray(content)) {
    return null
  }
  return (
    <div className="flex flex-col gap-4">
      {content.map((block) => {
        switch (block.type) {
          case 'panel':
            return (
              <Panels
                key={block.id}
                {...block}
                setPanelCount={setPanelCount}
                setDoorsCount={setDoorsCount}
              />
            )
          case 'measure':
            return (
              <Measures
                key={block.id}
                {...block}
                setGapWidth={setGapWidth}
                setGapHeight={setGapHeight}
              />
            )
          case 'lock':
            return (
              <Lock
                key={block.id}
                {...block}
                setLockDiscount={setLockDiscount}
              />
            )
          case 'model':
            return <Model key={block.id} {...block} />
          default:
            return null
        }
      })}
    </div>
  )
}

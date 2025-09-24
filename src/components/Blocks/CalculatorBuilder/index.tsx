import type { CalculatorBuilderProps } from '@/Types/types'
import Lock from '../Lock'
import Measures from '../Measures'
import Model from '../Model'
import Panels from '../Panels'

export const CalculatorBuilder = ({ content }: CalculatorBuilderProps) => {
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
                side={block.side}
                title={block.title}
              />
            )
          case 'measure':
            return (
              <Measures
                key={block.id}
                {...block}
                side={block.side}
                title={block.title}
              />
            )
          case 'lock':
            return (
              <Lock
                key={block.id}
                {...block}
                side={block.side}
                title={block.title}
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

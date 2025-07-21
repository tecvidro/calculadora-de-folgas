import type { CalculatorBuilderProps } from '@/Types/types'
import Lock from '../Lock'
import Measures from '../Measures'
import Model from '../Model'
import Panels from '../Panels'

export const CalculatorBuilder = ({
  content,
  productType,
}: CalculatorBuilderProps) => {
  if (!Array.isArray(content)) {
    return null
  }
  const isVDPLVDC = productType === 'vdpl-vdc'

  return (
    <div className="flex flex-col gap-4">
      {content.map((block) => {
        switch (block.type) {
          case 'panel':
            return (
              <Panels
                key={block.id}
                {...block}
                side="A"
                title={isVDPLVDC ? `${block.title} (Lado A)` : block.title}
              />
            )
          case 'measure':
            return (
              <Measures
                key={block.id}
                {...block}
                side="A"
                title={isVDPLVDC ? `${block.title} (Lado A)` : block.title}
              />
            )
          case 'lock':
            return (
              <Lock
                key={block.id}
                {...block}
                side="A"
                title={isVDPLVDC ? `${block.title} (Lado A)` : block.title}
              />
            )
          case 'model':
            return <Model key={block.id} {...block} />
          default:
            return null
        }
      })}

      {isVDPLVDC && (
        <div className="flex flex-col gap-4">
          {content.map((block) => {
            switch (block.type) {
              case 'panel':
                return (
                  <Panels
                    key={`${block.id}-B`}
                    {...block}
                    side="B"
                    title={`${block.title} (Lado B)`}
                  />
                )
              case 'measure':
                return (
                  <Measures
                    key={`${block.id}-B`}
                    {...block}
                    side="B"
                    title={`${block.title} (Lado B)`}
                  />
                )
              case 'lock':
                return (
                  <Lock
                    key={`${block.id}-B`}
                    {...block}
                    side="B"
                    title={`${block.title} (Lado B)`}
                  />
                )
              default:
                return null
            }
          })}
        </div>
      )}
    </div>
  )
}

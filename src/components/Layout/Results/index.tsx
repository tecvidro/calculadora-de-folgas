import { Box } from '@/components/shared/Box'
import { Title } from '@/components/shared/BoxTitle'

import { v4 as uuidv4 } from 'uuid'
type ResultsProps = {
  product: string
  panelCount: number
  doorsCount: number
  gapWidth: number
  gapHeight: number
  lockDiscounts: number[]
}

export const Results = ({
  product,
  panelCount,
  doorsCount,
  gapWidth,
  gapHeight,
  lockDiscounts,
}: ResultsProps) => {
  return (
    <div>
      <Title title={`Resultado de folgas para ${product}`} />
      <div className="grid grid-cols-2">
        <Box variant="gray">
          <div>
            <h3>Informações e medidas</h3>
            <p>Número de vidros:</p>
            <p>Painéis: {panelCount}</p>
            <p>Portas: {doorsCount}</p>
            <p>Medidas do vão:</p>
            <p>Largura: {gapWidth} mm</p>
            <p>Altura: {gapHeight} mm</p>
            <p>Descontos de fechadura:</p>
            {lockDiscounts.map((discount, index) => (
              <p key={uuidv4()}>
                Porta {index + 1}: {discount} mm
              </p>
            ))}
          </div>
        </Box>
      </div>
    </div>
  )
}

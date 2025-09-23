'use client'

import { Calculator, Proportions } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Box } from '@/components/shared/Box'
import { useCalculator } from '@/context/calculator-context'
import type { ResultsLabels } from '@/Types/types'
import { calculator } from '@/utils/calculator'

type CalculatorResults = {
  panelsWidth: number
  doorsWidth: { id: number; width: number }[]
  finalHeight: number
}

type SideData = {
  panelCount: number
  doorsCount: number
  gapWidth: number
  gapHeight: number
  lockDiscounts: number[]
  finalResults: CalculatorResults
}

type PrintResultsProps = {
  resultsLabels: ResultsLabels
  productType: string
}

export const PrintResults = ({
  resultsLabels,
  productType,
}: PrintResultsProps) => {
  const {
    panelCount,
    doorsCount,
    gapWidth,
    gapHeight,
    lockDiscounts,
    panelCountB,
    doorsCountB,
    gapWidthB,
    gapHeightB,
    lockDiscountsB,
  } = useCalculator()

  const isVDPLVDC = productType === 'vdpl-vdc'

  const paramsA = {
    params: {
      gap: {
        width: gapWidth,
        height: gapHeight,
      },
      glasses: {
        panels: panelCount,
        doors: doorsCount,
      },
      lock: lockDiscounts,
      adjustments: {
        profile: 19,
        transpass: 15,
        doorAdjustment: 31,
        heightDiscount: 85,
      },
    },
  }
  const finalResultsA = calculator(paramsA)

  const paramsB = {
    params: {
      gap: {
        width: gapWidthB,
        height: gapHeightB,
      },
      glasses: {
        panels: panelCountB,
        doors: doorsCountB,
      },
      lock: lockDiscountsB,
      adjustments: {
        profile: 19,
        transpass: 15,
        doorAdjustment: 31,
        heightDiscount: 85,
      },
    },
  }
  const finalResultsB = calculator(paramsB)

  const renderSideResults = (data: SideData, sideLabel: string) => (
    <div className="flex w-full flex-col items-center gap-4">
      {sideLabel && <h3 className="font-bold">{sideLabel}</h3>}
      <div className="grid w-full max-w-7xl grid-cols-2 items-start gap-4">
        <Box className="h-full" variant="dashed">
          <div className="w-full max-w-5xl [&_div]:border-b-1 [&_div]:border-dashed [&_div]:py-4 [&_div]:last-of-type:border-0">
            <h3 className="flex gap-2 border-b-1 border-dashed pb-4 font-bold">
              <Calculator />
              {resultsLabels.infoAndMeasures}
            </h3>

            <div className="">
              <h4 className="font-bold">{resultsLabels.numberOfGlasses}</h4>
              <p>
                {resultsLabels.panels}: {data.panelCount}
              </p>
              <p>
                {resultsLabels.doors}: {data.doorsCount}
              </p>
            </div>
            <div className="">
              <h3 className=" font-bold">{resultsLabels.gapMeasures}</h3>
              <p>
                {resultsLabels.width}: {data.gapWidth}mm
              </p>
              <p>
                {resultsLabels.height}: {data.gapHeight}mm
              </p>
            </div>
            <div className="py-4">
              <h3 className="font-bold">{resultsLabels.lockDiscounts}</h3>
              {data.lockDiscounts.map((discount, index) => (
                <p key={uuidv4()}>
                  {resultsLabels.door} {index + 1}: {discount}mm
                </p>
              ))}
            </div>
          </div>
        </Box>
        <Box className="h-full" variant="dashed">
          <h3 className="flex gap-2 border-b-1 border-dashed pb-4 font-bold">
            <Proportions />
            {resultsLabels.glassDimensions}
          </h3>
          <div className="[&_div]:border-b-1 [&_div]:border-dashed [&_div]:py-4 [&_div]:last-of-type:border-0">
            <div>
              <h4 className="font-bold">Painéis:</h4>
              <p>Largura: {data.finalResults.panelsWidth}mm</p>
              <p>Altura: {data.finalResults.finalHeight}mm</p>
            </div>
            {!!data.finalResults.doorsWidth &&
              data.finalResults.doorsWidth.map((item) => (
                <div key={item.id}>
                  <h4 className="font-bold">Porta {item.id}:</h4>
                  <p>Largura: {item.width}mm</p>
                  <p>Altura: {data.finalResults.finalHeight}mm</p>
                </div>
              ))}
          </div>
        </Box>
      </div>
    </div>
  )

  return (
    <div className="[&>div]:print:first:break-after-page">
      {renderSideResults(
        {
          panelCount,
          doorsCount,
          gapWidth,
          gapHeight,
          lockDiscounts,
          finalResults: {
            ...finalResultsA,
            doorsWidth: finalResultsA.doorsWidths,
          },
        },
        isVDPLVDC ? 'Lado A' : ''
      )}
      {isVDPLVDC && (
        <div className="mt-4">
          {renderSideResults(
            {
              panelCount: panelCountB,
              doorsCount: doorsCountB,
              gapWidth: gapWidthB,
              gapHeight: gapHeightB,
              lockDiscounts: lockDiscountsB,
              finalResults: {
                ...finalResultsB,
                doorsWidth: finalResultsB.doorsWidths,
              },
            },
            'Lado B'
          )}
        </div>
      )}
    </div>
  )
}

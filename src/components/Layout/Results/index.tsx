import {
  GalleryHorizontal,
  GalleryHorizontalEnd,
  KeyRound,
  Calculator as LucideCalculator,
  Proportions,
  RulerDimensionLine,
  SquareStack,
} from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Box } from '@/components/shared/Box'
import { useCalculator } from '@/context/calculator-context'
import type { CalculatorTypes, ResultsLabels } from '@/Types/types'
import { calculatorVdpl, calculatorVdpo } from '@/utils/calculator'

type SideData = {
  panelCount: number
  doorsCount: number
  gapWidth: number
  gapHeight: number
  lockDiscounts: number[]
  finalResults: {
    panelsWidth: number
    doorsWidths: { id: number; width: number }[]
    finalHeight: number
  }
}

type ResultsProps = {
  resultsLabels: ResultsLabels
  productType: string
  calculatorType: CalculatorTypes
}

export const Results = ({
  resultsLabels,
  productType,
  calculatorType,
}: ResultsProps) => {
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
    setFinalHeight,
    setDoorsWidths,
    setDoorsWidthsB,
    setPanelsWidth,
  } = useCalculator()

  const isVDPLVDC = productType === 'vdpl-vdc'

  const paramsA = useMemo(
    () => ({
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
      },
    }),
    [gapWidth, gapHeight, panelCount, doorsCount, lockDiscounts]
  )
  const finalResultsA = useMemo(
    () =>
      calculatorType === 'vdpo'
        ? calculatorVdpo(paramsA)
        : calculatorVdpl(paramsA),
    [paramsA, calculatorType]
  )

  const paramsB = useMemo(
    () => ({
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
      },
    }),
    [gapWidthB, gapHeightB, panelCountB, doorsCountB, lockDiscountsB]
  )
  const finalResultsB = useMemo(
    () =>
      calculatorType === 'vdpo'
        ? calculatorVdpo(paramsB)
        : calculatorVdpl(paramsB),
    [paramsB, calculatorType]
  )

  useEffect(() => {
    setFinalHeight(finalResultsA.finalHeight)
    setDoorsWidths(finalResultsA.doorsWidths)
    setPanelsWidth(finalResultsA.panelsWidth)
  }, [finalResultsA, setFinalHeight, setDoorsWidths, setPanelsWidth])

  useEffect(() => {
    setDoorsWidthsB(finalResultsB.doorsWidths)
  }, [finalResultsB, setDoorsWidthsB])

  const renderResults = (data: SideData, sideLabel: string) => (
    <div className="flex w-full flex-col gap-4">
      {sideLabel && <h3 className="font-bold">{sideLabel}</h3>}
      <div className="flex w-ful flex-col gap-4 ">
        <Box className="flex w-full flex-col gap-4" variant="gray">
          <h3 className="flex gap-2 font-bold">
            <LucideCalculator />
            {resultsLabels.infoAndMeasures}
          </h3>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <Box className="flex grow-1 flex-col gap-2">
              <h4 className="flex items-center gap-2 font-bold">
                <SquareStack size={18} />
                {resultsLabels.numberOfGlasses}
              </h4>
              <p>
                {resultsLabels.panels}: {data.panelCount}
              </p>
              <p>
                {resultsLabels.doors}: {data.doorsCount}
              </p>
            </Box>
            <Box className="flex grow-1 flex-col gap-2">
              <h4 className="flex items-center gap-2 font-bold">
                <RulerDimensionLine size={18} />
                {resultsLabels.gapMeasures}
              </h4>
              <p>
                {resultsLabels.width}: {data.gapWidth} mm
              </p>
              <p>
                {resultsLabels.height}: {data.gapHeight} mm
              </p>
            </Box>
            <Box className="flex grow-1 flex-col gap-2">
              <h4 className="flex items-center gap-2 font-bold">
                <KeyRound size={18} />
                {resultsLabels.lockDiscounts}
              </h4>
              {data.lockDiscounts.map((discount, index) => (
                <p key={uuidv4()}>
                  {resultsLabels.door} {index + 1}: {discount} mm
                </p>
              ))}
            </Box>
          </div>
        </Box>
        <Box className="flex w-full flex-col gap-4" variant="blue">
          <h3 className="flex gap-2 font-bold">
            <Proportions />
            {resultsLabels.glassDimensions}
          </h3>
          <div className="flex grid-cols-3 flex-col gap-4 sm:grid">
            <Box className="flex flex-col gap-2" variant="orange">
              <h4 className="flex items-center gap-2 font-bold">
                <GalleryHorizontal size={18} /> {resultsLabels.panels}:
              </h4>
              <p>
                {resultsLabels.width}: {data.finalResults.panelsWidth}mm
              </p>
              <p>
                {resultsLabels.height}: {data.finalResults.finalHeight}mm
              </p>
            </Box>
            {!!data.finalResults.doorsWidths &&
              data.finalResults.doorsWidths.map((item) => (
                <Box
                  className="flex flex-col gap-2"
                  key={item.id}
                  variant="orange"
                >
                  <h4 className="flex items-center gap-2 font-bold">
                    <GalleryHorizontalEnd size={18} />
                    {resultsLabels.door}: {item.id}:
                  </h4>
                  <p>
                    {resultsLabels.width}: {item.width}mm
                  </p>
                  <p>
                    {resultsLabels.height}: {data.finalResults.finalHeight}mm
                  </p>
                </Box>
              ))}
          </div>
        </Box>
      </div>
    </div>
  )

  return (
    <div className="flex w-full flex-col gap-4">
      {renderResults(
        {
          panelCount,
          doorsCount,
          gapWidth,
          gapHeight,
          lockDiscounts,
          finalResults: finalResultsA,
        },
        isVDPLVDC ? 'Lado A' : ''
      )}
      {isVDPLVDC && (
        <div className="mt-8">
          {renderResults(
            {
              panelCount: panelCountB,
              doorsCount: doorsCountB,
              gapWidth: gapWidthB,
              gapHeight: gapHeightB,
              lockDiscounts: lockDiscountsB,
              finalResults: finalResultsB,
            },
            'Lado B'
          )}
        </div>
      )}
    </div>
  )
}

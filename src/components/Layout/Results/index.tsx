import { v4 as uuidv4 } from "uuid";
import { Box } from "@/components/shared/Box";
import { useCalculator } from "@/context/calculator-context";
import type { ResultsLabels } from "@/Types/types";
import { calculator } from "@/utils/calculator";
import { useEffect } from "react";

type CalculatorResults = {
  panelsWidth: number;
  doorsWidth: { id: number; width: number }[];
  finalHeight: number;
};

type SideData = {
  panelCount: number;
  doorsCount: number;
  gapWidth: number;
  gapHeight: number;
  lockDiscounts: number[];
  finalResults: CalculatorResults;
};

type ResultsProps = {
  resultsLabels: ResultsLabels;
  productType: string;
};

export const Results = ({ resultsLabels, productType }: ResultsProps) => {
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
  } = useCalculator();

  const isVDPLVDC = productType === "vdpl-vdc";

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
  };
  const finalResultsA = calculator(paramsA);

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
  };
  const finalResultsB = calculator(paramsB);

  useEffect(() => {
    setFinalHeight(finalResultsA.finalHeight);
  }, [finalResultsA.finalHeight, setFinalHeight]);

  const renderResults = (data: SideData, sideLabel: string) => (
    <div className="flex w-full flex-col gap-4">
      {sideLabel && <h3 className="font-bold">{sideLabel}</h3>}
      <div className="flex w-ful flex-col gap-4 md:grid md:grid-cols-2">
        <Box className="w-full" variant="gray">
          <div>
            <h3>{resultsLabels.infoAndMeasures}</h3>
            <p>{resultsLabels.numberOfGlasses}</p>
            <p>
              {resultsLabels.panels}: {data.panelCount}
            </p>
            <p>
              {resultsLabels.doors}: {data.doorsCount}
            </p>
            <p>{resultsLabels.gapMeasures}</p>
            <p>
              {resultsLabels.width}: {data.gapWidth} mm
            </p>
            <p>
              {resultsLabels.height}: {data.gapHeight} mm
            </p>
            <p>{resultsLabels.lockDiscounts}</p>
            {data.lockDiscounts.map((discount, index) => (
              <p key={uuidv4()}>
                {resultsLabels.door} {index + 1}: {discount} mm
              </p>
            ))}
          </div>
        </Box>
        <Box variant="blue">
          <div>
            <h3 className="font-bold">{resultsLabels.glassDimensions}</h3>
            <div>
              <h4 className="font-bold">Painéis:</h4>
              <p>Largura: {data.finalResults.panelsWidth}mm</p>
              <p>Altura: {data.finalResults.finalHeight}mm</p>
              {!!data.finalResults.doorsWidth &&
                data.finalResults.doorsWidth.map((item) => (
                  <div key={item.id}>
                    <h4 className="font-bold">Porta {item.id}:</h4>
                    <p>Largura: {item.width}mm</p>
                    <p>Altura: {data.finalResults.finalHeight}mm</p>
                  </div>
                ))}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );

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
        isVDPLVDC ? "Lado A" : "",
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
            "Lado B",
          )}
        </div>
      )}
    </div>
  );
};

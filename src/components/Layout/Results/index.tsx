import { v4 as uuidv4 } from "uuid";
import { Box } from "@/components/shared/Box";
import { useCalculator } from "@/context/calculator-context";
import type { ResultsLabels } from "@/Types/types";
import { calculator } from "@/utils/calculator";

type ResultsProps = {
  resultsLabels: ResultsLabels;
};

export const Results = ({ resultsLabels }: ResultsProps) => {
  const { panelCount, doorsCount, gapWidth, gapHeight, lockDiscounts } =
    useCalculator();

  const params = {
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
  const finalResults = calculator(params);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-ful flex-col gap-4 md:grid md:grid-cols-2">
        <Box className="w-full" variant="gray">
          <div>
            <h3>{resultsLabels.infoAndMeasures}</h3>
            <p>{resultsLabels.numberOfGlasses}</p>
            <p>
              {resultsLabels.panels}: {panelCount}
            </p>
            <p>
              {resultsLabels.doors}: {doorsCount}
            </p>
            <p>{resultsLabels.gapMeasures}</p>
            <p>
              {resultsLabels.width}: {gapWidth} mm
            </p>
            <p>
              {resultsLabels.height}: {gapHeight} mm
            </p>
            <p>{resultsLabels.lockDiscounts}</p>
            {lockDiscounts.map((discount, index) => (
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
              <p>Largura: {finalResults.panelsWidth}mm</p>
              <p>Altura: {finalResults.finalHeight}mm</p>
              {!!finalResults.doorsWidth &&
                finalResults.doorsWidth.map((item) => (
                  <div key={item.id}>
                    <h4 className="font-bold">Porta {item.id}:</h4>
                    <p>Largura: {item.width}mm</p>
                    <p>Altura: {finalResults.finalHeight}mm</p>
                  </div>
                ))}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

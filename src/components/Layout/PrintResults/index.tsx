"use client";

import { v4 as uuidv4 } from "uuid";
import { Box } from "@/components/shared/Box";
import { useCalculator } from "@/context/calculator-context";
import type { ResultsLabels } from "@/Types/types";

type ResultsProps = {
  resultsLabels: ResultsLabels;
};

export const PrintResults = ({ resultsLabels }: ResultsProps) => {
  const { panelCount, doorsCount, gapWidth, gapHeight, lockDiscounts } =
    useCalculator();

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="grid w-full max-w-7xl grid-cols-2 items-start gap-4">
        <Box variant="dashed">
          <div className="w-full max-w-5xl">
            <div className="border-b-1 border-dashed py-4">
              <h3 className="font-bold">{resultsLabels.infoAndMeasures}</h3>
              <p>{resultsLabels.numberOfGlasses}</p>
              <p>
                {resultsLabels.panels}: {panelCount}
              </p>
              <p>
                {resultsLabels.doors}: {doorsCount}
              </p>
            </div>
            <div className="border-b-1 border-dashed py-4">
              <h3 className=" font-bold">{resultsLabels.gapMeasures}</h3>
              <p>
                {resultsLabels.width}: {gapWidth} mm
              </p>
              <p>
                {resultsLabels.height}: {gapHeight} mm
              </p>
            </div>
            <div className="py-4">
              <h3 className="font-bold">{resultsLabels.lockDiscounts}</h3>
              {lockDiscounts.map((discount, index) => (
                <p key={uuidv4()}>
                  {resultsLabels.door} {index + 1}: {discount} mm
                </p>
              ))}
            </div>
          </div>
        </Box>

        <Box variant="dashed">
          <div>
            <h3 className="font-bold">{resultsLabels.glassDimensions}</h3>
          </div>
        </Box>
      </div>
    </div>
  );
};

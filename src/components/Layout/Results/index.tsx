import { v4 as uuidv4 } from "uuid";
import { Box } from "@/components/shared/Box";
import { Title } from "@/components/shared/BoxTitle";
import Button from "@/components/shared/Button";
import { useCalculator } from "@/context/calculator-context";
import type { CallToActions, ResultsLabels } from "@/Types/types";

type ResultsProps = {
  product: string;
  resultsLabels: ResultsLabels;
  callToactions: CallToActions;
};

export const Results = ({
  product,
  resultsLabels,
  callToactions,
}: ResultsProps) => {
  const { panelCount, doorsCount, gapWidth, gapHeight, lockDiscounts } =
    useCalculator();

  return (
    <div className="flex w-full flex-col gap-4">
      <Title title={`${product}`} variant="sectionTitle">
        {resultsLabels.title}
      </Title>
      <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2">
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
            <h3>{resultsLabels.glassDimensions}</h3>
          </div>
        </Box>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Button label={callToactions.print} link="#" />
        <Button intent="secondary" label={callToactions.manual} link="#" />
      </div>
    </div>
  );
};

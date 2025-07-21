import { useState } from "react";
import { Box } from "@/components/shared/Box";
import { InputNumber } from "@/components/shared/InputNumber";
import { useCalculator } from "@/context/calculator-context";
import type { PanelsProps } from "@/Types/types";

export default function Panels({
  panelsCount: initialPanelsCount,
  panelsDescription,
  panelsLabel,
  doorsCount: initialDoorsCount,
  doorsDescription,
  doorsLabel,
  side = "A",
}: PanelsProps) {
  const { setPanelCount, setDoorsCount, setPanelCountB, setDoorsCountB } =
    useCalculator();
  const [panelsCount, setLocalPanelsCount] = useState(initialPanelsCount);
  const [doorsCount, setLocalDoorsCount] = useState(initialDoorsCount);

  const handlePanelCountChange = (value: number) => {
    setLocalPanelsCount(value);
    switch (side) {
      case "A":
        setPanelCount(value);
        break;
      case "B":
        setPanelCountB(value);
        break;
      default:
        return null;
    }
  };

  const handleDoorsCountChange = (value: number) => {
    setLocalDoorsCount(value);
    switch (side) {
      case "A":
        setDoorsCount(value);
        break;
      case "B":
        setDoorsCountB(value);
        break;
      default:
        return null;
    }
  };

  return (
    <Box className="flex flex-col gap-4">
      <form>
        <InputNumber
          description={panelsDescription}
          label={panelsLabel}
          name="panels"
          onChange={handlePanelCountChange}
          value={panelsCount}
        />
        <InputNumber
          description={doorsDescription}
          disabled
          label={doorsLabel}
          name="doors"
          onChange={handleDoorsCountChange}
          value={doorsCount}
        />
      </form>
    </Box>
  );
}

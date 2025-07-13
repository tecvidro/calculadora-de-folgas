import type { PanelsProps } from "@/Types/types";

export default function Panels({
  title,
  panelsCount,
  panelsDescription,
  panelsLabel,
  doorsCount,
  doorsDescription,
  doorsLabel,
}: PanelsProps) {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
}

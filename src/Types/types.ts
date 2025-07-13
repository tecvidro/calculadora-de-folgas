export type BlockTypes = "panel" | "measure" | "lock" | "model";

export interface Base<T extends BlockTypes> {
  id: number;
  type: T;
}

export type PanelsProps = Base<"panel"> & {
  title: string;
  panelsLabel: string;
  panelsDescription: string;
  panelsCount: number;
  doorsLabel: string;
  doorsDescription: string;
  doorsCount: number;
};

export type LockProps = Base<"lock"> & {
  title: string;
};

export type ModelProps = Base<"model"> & {
  title: string;
};

export type MeasuresProps = Base<"measure"> & {
  title: string;
};

export type BlockContentType =
  | PanelsProps
  | MeasuresProps
  | ModelProps
  | LockProps;

export type CalculatorBuilderProps = {
  content: BlockContentType[];
};


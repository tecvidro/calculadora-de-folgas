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
  description: string;
  text: {
    index: number;
    text: string;
  }[];
  label: string;
  defaultValues: {
    default: number[];
    option: number[];
  };
  disabled?: boolean;
};

export type ModelProps = Base<"model"> & {
  title: string;
};

export type MeasuresProps = Base<"measure"> & {
  title: string;
  widthLabel: string;
  heightLabel: string;
  defaultWidth: number;
  defaultHeight: number;
};

export type BlockContentType =
  | PanelsProps
  | MeasuresProps
  | ModelProps
  | LockProps;

export type CalculatorBuilderProps = {
  content: BlockContentType[];
};

export type Product = {
  name: string;
  slug: string;
  model: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  content: BlockContentType[];
};

export type ResultsLabels = {
  title: string;
  infoAndMeasures: string;
  numberOfGlasses: string;
  panels: string;
  doors: string;
  gapMeasures: string;
  width: string;
  height: string;
  lockDiscounts: string;
  door: string;
  glassDimensions: string;
};

export type Dictionary = {
  globals: {
    title: string;
    description: string;
    homeTitle: string;
    alert: string;
    callToActions: {
      card: string;
      print: string;
      manual: string;
    };
    resultsLabels: ResultsLabels;
  };
  products: Product[];
};

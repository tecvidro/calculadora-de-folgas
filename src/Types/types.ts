export type BlockTypes = "panel" | "measure" | "lock" | "model";

export interface Base<T extends BlockTypes> {
  id: string;
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
  side?: "A" | "B";
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
  side?: "A" | "B";
};

export type ModelProps = Base<"model"> & {
  title: string;
  description: string;
  label: string;
  options: { label: string; value: string }[];
};

export type MeasuresProps = Base<"measure"> & {
  title: string;
  description?: string;
  widthLabel: string;
  heightLabel: string;
  defaultWidth: number;
  defaultHeight: number;
  side?: "A" | "B";
};

export type BlockContentType =
  | PanelsProps
  | MeasuresProps
  | ModelProps
  | LockProps;

export type CalculatorBuilderProps = {
  content: BlockContentType[];
  productType: string;
};

export type Product = {
  name: string;
  slug: string;
  model: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  manualUrl: string;
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
  panel: string;
  masonry: string;
  glassDimensions: string;
};

export type CallToActions = {
  card: string;
  print: string;
  manual: string;
};

export type Dictionary = {
  globals: {
    title: string;
    description: string;
    homeTitle: string;
    alert: string;
    callToActions: CallToActions;
    resultsLabels: ResultsLabels;
  };
  infosPage: {
    title: string;
    steps: { id: string; text: string }[];
  };
  products: Product[];
};

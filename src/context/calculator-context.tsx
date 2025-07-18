"use client";

import { calculator } from "@/utils/calculator";
import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

interface CalculatorContextType {
  panelCount: number;
  setPanelCount: (count: number) => void;
  doorsCount: number;
  setDoorsCount: (count: number) => void;
  gapWidth: number;
  setGapWidth: (width: number) => void;
  gapHeight: number;
  setGapHeight: (height: number) => void;
  lockDiscounts: number[];
  setLockDiscounts: (
    discounts: number[] | ((prev: number[]) => number[]),
  ) => void;
  useDefaultLockDiscounts: boolean;
  setUseDefaultLockDiscounts: (useDefault: boolean) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined,
);

interface CalculatorProviderProps {
  children: ReactNode;
  initialPanelCount: number;
  initialDoorsCount: number;
  initialGapWidth: number;
  initialGapHeight: number;
  initialLockDiscounts: {
    default: number[];
    option?: number[];
  };
  useDefaultLockDiscounts?: boolean;
}

export const CalculatorProvider = ({
  children,
  initialPanelCount,
  initialDoorsCount,
  initialGapWidth,
  initialGapHeight,
  initialLockDiscounts,
  useDefaultLockDiscounts: initialUseDefaultLockDiscounts = true,
}: CalculatorProviderProps) => {
  const [panelCount, setPanelCount] = useState<number>(initialPanelCount);
  const [doorsCount, setDoorsCount] = useState<number>(initialDoorsCount);
  const [gapWidth, setGapWidth] = useState<number>(initialGapWidth);
  const [gapHeight, setGapHeight] = useState<number>(initialGapHeight);
  const [useDefaultLockDiscounts, setUseDefaultLockDiscounts] =
    useState<boolean>(initialUseDefaultLockDiscounts);
  const [lockDiscounts, setLockDiscounts] = useState<number[]>(
    initialUseDefaultLockDiscounts
      ? initialLockDiscounts.default
      : initialLockDiscounts.option || initialLockDiscounts.default,
  );

  useEffect(() => {
    if (useDefaultLockDiscounts) {
      setLockDiscounts(initialLockDiscounts.default);
    } else {
      setLockDiscounts(
        initialLockDiscounts.option || initialLockDiscounts.default,
      );
    }
  }, [useDefaultLockDiscounts, initialLockDiscounts]);

  return (
    <CalculatorContext.Provider
      value={{
        panelCount,
        setPanelCount,
        doorsCount,
        setDoorsCount,
        gapWidth,
        setGapWidth,
        gapHeight,
        setGapHeight,
        lockDiscounts,
        setLockDiscounts,
        useDefaultLockDiscounts,
        setUseDefaultLockDiscounts,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
};

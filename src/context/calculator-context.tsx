'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

interface CalculatorContextType {
  panelCount: number
  setPanelCount: (count: number) => void
  doorsCount: number
  setDoorsCount: (count: number) => void
  gapWidth: number
  setGapWidth: (width: number) => void
  gapHeight: number
  setGapHeight: (height: number) => void
  lockDiscounts: number[]
  setLockDiscounts: (
    discounts: number[] | ((prev: number[]) => number[])
  ) => void
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
)

interface CalculatorProviderProps {
  children: ReactNode
  initialPanelCount: number
  initialDoorsCount: number
  initialGapWidth: number
  initialGapHeight: number
  initialLockDiscounts: number[]
}

export const CalculatorProvider = ({
  children,
  initialPanelCount,
  initialDoorsCount,
  initialGapWidth,
  initialGapHeight,
  initialLockDiscounts,
}: CalculatorProviderProps) => {
  const [panelCount, setPanelCount] = useState<number>(initialPanelCount)
  const [doorsCount, setDoorsCount] = useState<number>(initialDoorsCount)
  const [gapWidth, setGapWidth] = useState<number>(initialGapWidth)
  const [gapHeight, setGapHeight] = useState<number>(initialGapHeight)
  const [lockDiscounts, setLockDiscounts] =
    useState<number[]>(initialLockDiscounts)

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
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}

export const useCalculator = () => {
  const context = useContext(CalculatorContext)
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}

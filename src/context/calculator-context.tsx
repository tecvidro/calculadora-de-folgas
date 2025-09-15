'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

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
  useDefaultLockDiscounts: boolean
  setUseDefaultLockDiscounts: (useDefault: boolean) => void

  panelCountB: number
  setPanelCountB: (count: number) => void
  doorsCountB: number
  setDoorsCountB: (count: number) => void
  gapWidthB: number
  setGapWidthB: (width: number) => void
  gapHeightB: number
  setGapHeightB: (height: number) => void
  lockDiscountsB: number[]
  setLockDiscountsB: (
    discounts: number[] | ((prev: number[]) => number[])
  ) => void
  useDefaultLockDiscountsB: boolean
  setUseDefaultLockDiscountsB: (useDefault: boolean) => void

  finalHeight: number
  setFinalHeight: (height: number) => void
  doorsWidth: number
  setDoorsWidth: (width: number) => void
  doorsWidthB: number
  setDoorsWidthB: (width: number) => void
  panelsWidth: number
  setPanelsWidth: (width: number) => void
  isReady: boolean
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
  initialLockDiscounts: {
    default: number[]
    option?: number[]
  }
  useDefaultLockDiscounts?: boolean
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
  const [panelCount, setPanelCount] = useState<number>(initialPanelCount)
  const [doorsCount, setDoorsCount] = useState<number>(initialDoorsCount)
  const [gapWidth, setGapWidth] = useState<number>(initialGapWidth)
  const [gapHeight, setGapHeight] = useState<number>(initialGapHeight)
  const [useDefaultLockDiscounts, setUseDefaultLockDiscounts] =
    useState<boolean>(initialUseDefaultLockDiscounts)
  const [lockDiscounts, setLockDiscounts] = useState<number[]>(
    initialUseDefaultLockDiscounts
      ? initialLockDiscounts.default
      : initialLockDiscounts.option || initialLockDiscounts.default
  )

  const [panelCountB, setPanelCountB] = useState<number>(initialPanelCount)
  const [doorsCountB, setDoorsCountB] = useState<number>(initialDoorsCount)
  const [gapWidthB, setGapWidthB] = useState<number>(initialGapWidth)
  const [gapHeightB, setGapHeightB] = useState<number>(initialGapHeight)
  const [useDefaultLockDiscountsB, setUseDefaultLockDiscountsB] =
    useState<boolean>(initialUseDefaultLockDiscounts)
  const [lockDiscountsB, setLockDiscountsB] = useState<number[]>(
    initialUseDefaultLockDiscounts
      ? initialLockDiscounts.default
      : initialLockDiscounts.option || initialLockDiscounts.default
  )

  const [finalHeight, setFinalHeight] = useState<number>(0)
  const [doorsWidth, setDoorsWidth] = useState<number>(0)
  const [doorsWidthB, setDoorsWidthB] = useState<number>(0)
  const [panelsWidth, setPanelsWidth] = useState<number>(0)

  const isReady = gapWidth > 0 && gapHeight >= 0

  useEffect(() => {
    if (useDefaultLockDiscounts) {
      setLockDiscounts(initialLockDiscounts.default)
    } else {
      setLockDiscounts(
        initialLockDiscounts.option || initialLockDiscounts.default
      )
    }
  }, [useDefaultLockDiscounts, initialLockDiscounts])

  useEffect(() => {
    if (useDefaultLockDiscountsB) {
      setLockDiscountsB(initialLockDiscounts.default)
    } else {
      setLockDiscountsB(
        initialLockDiscounts.option || initialLockDiscounts.default
      )
    }
  }, [useDefaultLockDiscountsB, initialLockDiscounts])

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
        panelCountB,
        setPanelCountB,
        doorsCountB,
        setDoorsCountB,
        gapWidthB,
        setGapWidthB,
        gapHeightB,
        setGapHeightB,
        lockDiscountsB,
        setLockDiscountsB,
        useDefaultLockDiscountsB,
        setUseDefaultLockDiscountsB,
        finalHeight,
        setFinalHeight,
        doorsWidth,
        setDoorsWidth,
        doorsWidthB,
        setDoorsWidthB,
        panelsWidth,
        setPanelsWidth,
        isReady,
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

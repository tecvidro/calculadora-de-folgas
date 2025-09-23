type Calculator = {
  params: {
    gap: {
      width: number
      height: number
    }
    glasses: {
      panels: number
      doors: number
    }
    lock: number[]
  }
}

export const calculatorVdpl = ({ params }: Calculator) => {
  const gapWidth = params.gap.width
  const gapHeight = params.gap.height
  const panelsCount = params.glasses.panels
  const doorsCount = params.glasses.doors

  const totalGlassesCount = panelsCount + doorsCount

  const adjustments = {
    profile: 19,
    transpass: 15,
    doorAdjustment: 31,
    heightDiscount: 85,
  }

  const totalProfileDiscount = adjustments.profile * 2
  const totalTranpass = adjustments.transpass * (totalGlassesCount - 1)
  const lockDiscounts = params.lock.reduce((sum, current) => sum + current, 0)

  const totalGap =
    gapWidth - totalProfileDiscount + (totalTranpass - lockDiscounts)

  const finalHeight = Math.floor(gapHeight - adjustments.heightDiscount)

  const panelsWidth = Math.floor(totalGap / totalGlassesCount)

  const doorsWidths = Array.from({ length: doorsCount }, (_, index) => {
    const doorWidth =
      panelsWidth + params.lock[index] - adjustments.doorAdjustment
    return { id: index + 1, width: Math.floor(doorWidth) }
  })

  return {
    panelsWidth,
    doorsWidths,
    finalHeight,
  }
}

export const calculatorVdpo = ({ params }: Calculator) => {
  const gapWidth = params.gap.width
  const gapHeight = params.gap.height
  const panelsCount = params.glasses.panels
  const doorsCount = params.glasses.doors

  const totalGlassesCount = panelsCount + doorsCount

  const adjustments = {
    transpass: 15,
    heightDiscount: 85,
  }

  if (doorsCount !== 2 && doorsCount !== 4) {
    throw new Error('ERRD48O')
  }

  const totalProfileDiscount = doorsCount === 2 ? 10 : 16

  const totalTranpass = adjustments.transpass * (panelsCount + 2)

  const lockDiscounts = params.lock.reduce((sum, current) => sum + current, 0)

  const totalGap =
    gapWidth - totalProfileDiscount + totalTranpass - lockDiscounts

  const finalHeight = Math.floor(gapHeight - adjustments.heightDiscount)

  const panelsWidth = Math.floor(totalGap / totalGlassesCount)

  const doorsWidths = Array.from({ length: doorsCount }, (_, index) => {
    const lockValue = params.lock[index] ?? 0
    const doorWidth = panelsWidth + lockValue
    return { id: index + 1, width: Math.floor(doorWidth) }
  })

  return {
    panelsWidth,
    doorsWidths,
    finalHeight,
  }
}

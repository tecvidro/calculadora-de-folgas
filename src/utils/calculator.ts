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
    profile: 19, // desconto perfil
    transpass: 15, // transpasse
    doorAdjustment: 31, // ajuste das portas
    heightDiscount: 85, // ajuste altura perfis
  }

  const totalProfileDiscount = adjustments.profile * 2 // multiplicar desconto perfis por 2
  const totalTranpass = adjustments.transpass * (totalGlassesCount - 1) // calcular total de transpasses
  const lockDiscounts = params.lock.reduce((sum, current) => sum + current, 0) // somar todos os descontos de fechadura

  const totalGap =
    gapWidth - totalProfileDiscount + (totalTranpass - lockDiscounts) // calcular o vão total com os descontos

  const finalHeight = Math.ceil(gapHeight - adjustments.heightDiscount) // calcular altura

  const panelsWidth = Math.ceil(totalGap / totalGlassesCount) // calcular a largura dos painéis (vão / nº total de vidros)

  const doorsWidths = Array.from({ length: doorsCount }, (_, index) => {
    const doorWidth =
      panelsWidth + params.lock[index] - adjustments.doorAdjustment // calcular a largura das portas (lagura painel + desconto fechadura - ajustes fas portas)
    return { id: index + 1, width: Math.ceil(doorWidth) }
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

  const totalProfileDiscount = doorsCount === 2 ? 10 : 16 // desconto perfis

  const totalTranpass = adjustments.transpass * (panelsCount + 2) // calcular total de transpasses (transpasse * total de painéis + 2)

  const lockDiscounts = params.lock.reduce((sum, current) => sum + current, 0) // calcular total de desconto das fechaduras

  const totalGap =
    gapWidth - totalProfileDiscount + totalTranpass - lockDiscounts // calcular vão total

  const finalHeight = Math.floor(gapHeight - adjustments.heightDiscount) // calcular altura com descontos

  const panelsWidth = Math.floor(totalGap / totalGlassesCount) // calcular a largura dos painéis (vão total / nº total de vidros)

  const doorsWidths = Array.from({ length: doorsCount }, (_, index) => {
    const lockValue = params.lock[index] ?? 0 // pega o valor do desconto de fechadura
    const doorWidth = panelsWidth + lockValue // calcula a largura das portas (largura dos painéis + desonto da fechadura)
    return { id: index + 1, width: Math.floor(doorWidth) }
  })

  return {
    panelsWidth,
    doorsWidths,
    finalHeight,
  }
}

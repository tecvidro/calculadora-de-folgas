import { CalculatorProvider } from '@/context/calculator-context'
import type { Locale } from '@/i18n-config'
import { getDictionary } from '@/utils/get-dictionary'

export default async function ProductLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale; products: string }>
}) {
  const params = await paramsPromise
  const dictionary = await getDictionary(params.lang)
  const product = dictionary.products.find(
    (item) => item.slug === params.products
  )

  if (!product) {
    return <div>Product not found</div>
  }

  const initialPanelsCount = product.content.filter(
    (item) => item.type === 'panel'
  )[0].panelsCount
  const initialDoorsCount = product.content.filter(
    (item) => item.type === 'panel'
  )[0].doorsCount
  const initialWidth = product.content.filter(
    (item) => item.type === 'measure'
  )[0].defaultWidth
  const initialHeight = product.content.filter(
    (item) => item.type === 'measure'
  )[0].defaultHeight
  const initialLockDiscounts = product.content.filter(
    (item) => item.type === 'lock'
  )[0].defaultValues

  return (
    <CalculatorProvider
      initialDoorsCount={initialDoorsCount}
      initialGapHeight={initialHeight}
      initialGapWidth={initialWidth}
      initialLockDiscounts={initialLockDiscounts}
      initialPanelCount={initialPanelsCount}
    >
      {children}
    </CalculatorProvider>
  )
}

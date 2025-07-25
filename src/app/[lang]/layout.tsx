import type { Metadata } from 'next'
import { Roboto_Condensed } from 'next/font/google'
import type React from 'react'
import { getDictionary } from '@/utils/get-dictionary'
import { Content } from '../../components/Layout/Content'
import { Footer } from '../../components/Layout/Footer'
import { Header } from '../../components/Layout/Header'
import { Container } from '../../components/shared/Container'
import { i18n, type Locale } from '../../i18n-config'
import '../globals.css'

const robotoCondensed = Roboto_Condensed({
  variable: '--roboto-condensed',
  subsets: ['latin'],
  weight: ['400', '800'],
})

export async function generateMetadata(props: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return {
    title: dictionary.globals.title,
    description: dictionary.globals.description,
  }
}

export function generateStaticParams() {
  return i18n.locales.map((locale: Locale) => ({ lang: locale }))
}

export default async function Root(props: {
  children: React.ReactNode
  modal: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const params = await props.params

  const dictionary = await getDictionary(params.lang)

  const { children, modal } = props
  return (
    <html lang={params.lang}>
      <body className={`${robotoCondensed.variable} antialiased`}>
        {modal}
        <Header lang={params.lang} title={dictionary.globals.title} />
        <Content>
          <Container>{children}</Container>
          <Footer lang={params.lang} />
        </Content>
        <div id="modal-root" />
      </body>
    </html>
  )
}

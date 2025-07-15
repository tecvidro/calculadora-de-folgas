import { Alert } from '@/components/shared/Alert'
import { Box } from '@/components/shared/Box'
import { Modal } from '@/components/shared/Modal'
import type { Locale } from '@/i18n-config'
import { getDictionary } from '@/utils/get-dictionary'

export default async function ProductCalculator(props: {
  params: Promise<{ lang: Locale; products: string }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)
  const infos = dictionary.infosPage

  return (
    <Modal>
      <div className="flex w-full flex-col items-center gap-4">
        <h2 className=" w-full pr-12 text-left uppercase">{infos.title}</h2>
        <Box className="flex w-full max-w-4xl flex-col items-start">
          {infos.steps.map((item, index) => (
            <p key={item.id}>
              <b>{index + 1}</b>. {item.text}
            </p>
          ))}
        </Box>
        <Alert text={dictionary.globals.alert} />
      </div>
    </Modal>
  )
}

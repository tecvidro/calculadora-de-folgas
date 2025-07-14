import { Box } from '../Box'

type AlertProps = {
  text: string
}

export const Alert = ({ text }: AlertProps) => {
  return (
    <Box variant="red" className="w-full max-w-4xl">
      {text}
    </Box>
  )
}

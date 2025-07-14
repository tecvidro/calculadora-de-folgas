import { Box } from '../Box'

type AlertProps = {
  text: string
}

export const Alert = ({ text }: AlertProps) => {
  return (
    <Box className="w-full max-w-4xl" variant="red">
      {text}
    </Box>
  )
}

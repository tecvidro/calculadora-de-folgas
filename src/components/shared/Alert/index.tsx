import { Box } from '../Box'

type AlertProps = {
  text: string
}

export const Alert = ({ text }: AlertProps) => {
  return (
    <Box className="flex w-full max-w-7xl gap-2" variant="red">
      {text}
    </Box>
  )
}

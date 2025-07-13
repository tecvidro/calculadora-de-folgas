type AlertProps = {
  text: string
}

export const Alert = ({ text }: AlertProps) => {
  return (
    <div className="w-full max-w-4xl rounded bg-red p-4 text-center text-white">
      {text}
    </div>
  )
}

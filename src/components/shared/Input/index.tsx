type InputProps = {
  name: string
  label: string
  description?: string
  defaultValue: string | number
  disabled?: boolean
}

export const Input = ({
  label,
  defaultValue,
  description,
  name,
  disabled = false,
}: InputProps) => {
  return (
    <fieldset className="flex w-full flex-col gap-1 py-2">
      <label className="font-bold" htmlFor={name}>
        {label}
      </label>
      {!!description && <div>{description}</div>}
      <input
        className="rounded border p-2 text-center disabled:bg-gray-100"
        defaultValue={defaultValue}
        disabled={disabled}
        id={name}
        type="number"
      />
    </fieldset>
  )
}

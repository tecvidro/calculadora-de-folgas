'use client'

type InputOptionsProps = {
  name: string
  label: string
  description?: string
  value: boolean
  onChange?: (value: boolean) => void
  options: { label: string; value: boolean }[]
}

export const InputOptions = ({
  label,
  value,
  description,
  name,
  onChange,
  options,
}: InputOptionsProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === 'true'
    onChange?.(newValue)
  }

  return (
    <fieldset className="flex w-full flex-col gap-1 py-2">
      <legend className="font-bold">{label}</legend>
      {!!description && <div>{description}</div>}
      <div className="flex items-center gap-4 rounded border p-2">
        {options.map((option) => (
          <div className="flex items-center gap-2" key={String(option.value)}>
            <input
              checked={value === option.value}
              className="cursor-pointer"
              id={`${name}-${String(option.value)}`}
              name={name}
              onChange={handleChange}
              type="radio"
              value={String(option.value)}
            />
            <label
              className="cursor-pointer"
              htmlFor={`${name}-${String(option.value)}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

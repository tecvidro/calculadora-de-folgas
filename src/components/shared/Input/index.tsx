'use client'
import { useState } from 'react'

type InputProps = {
  name: string
  label: string
  description?: string
  defaultValue: string | number
  disabled?: boolean
  onValueChange?: (value: number) => void
}

export const Input = ({
  label,
  defaultValue,
  description,
  name,
  disabled = false,
  onValueChange,
}: InputProps) => {
  const [value, setValue] = useState(Number(defaultValue))

  const handleBlur = () => {
    onValueChange?.(value)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(event.target.value, 10)
    if (!Number.isNaN(newValue)) {
      setValue(newValue)
    } else if (event.target.value === '') {
      setValue(0)
    }
  }

  return (
    <fieldset className="flex w-full flex-col gap-1 py-2">
      <label className="font-bold" htmlFor={name}>
        {label}
      </label>
      {!!description && <div>{description}</div>}
      <input
        className="rounded border p-2 text-center disabled:bg-gray-100"
        value={value}
        disabled={disabled}
        id={name}
        type="number"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </fieldset>
  )
}

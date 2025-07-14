'use client'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

type InputNumberProps = {
  name: string
  label: string
  description?: string
  defaultValue: number
  disabled?: boolean
  onChange?: (value: number) => void
}

export const InputNumber = ({
  label,
  defaultValue,
  description,
  name,
  disabled = false,
  onChange,
}: InputNumberProps) => {
  const [value, setValue] = useState(defaultValue)

  const handleIncrement = () => {
    setValue((prev) => {
      const newValue = prev + 1
      onChange?.(newValue)
      return newValue
    })
  }

  const handleDecrement = () => {
    setValue((prev) => {
      const newValue = prev > 1 ? prev - 1 : 1
      onChange?.(newValue)
      return newValue
    })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(event.target.value, 10)
    if (!Number.isNaN(newValue) && newValue >= 1) {
      setValue(newValue)
      onChange?.(newValue)
    } else if (event.target.value === '') {
      setValue(1)
      onChange?.(1)
    }
  }

  return (
    <fieldset className="flex w-full flex-col gap-1 py-2">
      <label className="font-bold" htmlFor={name}>
        {label}
      </label>
      {!!description && <div>{description}</div>}
      <div
        aria-disabled={disabled}
        className="flex h-12 items-center gap-1 rounded border p-1 aria-disabled:bg-gray-100 aria-disabled:[&_button]:opacity-0"
      >
        <button
          className="cursor-pointer rounded-md p-2 hover:bg-gray-100 active:bg-green disabled:cursor-not-allowed disabled:opacity-0"
          disabled={disabled || value <= 1}
          onClick={handleDecrement}
          type="button"
        >
          <Minus size={20} />
        </button>
        <input
          className="w-full text-center [appearance:textfield] disabled:bg-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          disabled={disabled}
          id={name}
          min="1"
          onChange={handleChange}
          type="number"
          value={value}
        />
        <button
          className="cursor-pointer rounded-md p-2 hover:bg-gray-100 active:bg-green disabled:cursor-not-allowed disabled:opacity-0"
          disabled={disabled}
          onClick={handleIncrement}
          type="button"
        >
          <Plus size={20} />
        </button>
      </div>
    </fieldset>
  )
}

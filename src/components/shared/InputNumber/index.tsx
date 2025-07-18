'use client'
import { Minus, Plus } from 'lucide-react'

type InputNumberProps = {
  name: string
  label: string
  description?: string
  value: number
  disabled?: boolean
  onChange?: (value: number) => void
}

export const InputNumber = ({
  label,
  value,
  description,
  name,
  disabled = false,
  onChange,
}: InputNumberProps) => {
  const handleIncrement = () => {
    const newValue = value + 1
    onChange?.(newValue)
  }

  const handleDecrement = () => {
    const newValue = value > 1 ? value - 1 : 1
    onChange?.(newValue)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(event.target.value, 10)
    if (!Number.isNaN(newValue) && newValue >= 1) {
      onChange?.(newValue)
    } else if (event.target.value === '') {
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

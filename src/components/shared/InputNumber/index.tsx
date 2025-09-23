'use client'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

type InputNumberProps = {
  name: string
  label: string
  description?: string
  value: number
  disabled?: boolean
  hasPlusMinusButton?: boolean
  onValueChange?: (value: number) => void
}

export const InputNumber = ({
  label,
  value,
  description,
  name,
  disabled = false,
  hasPlusMinusButton = true,
  onValueChange,
}: InputNumberProps) => {
  const [inputValue, setInputValue] = useState(value)

  const handleIncrement = () => {
    const newValue = inputValue + 1
    setInputValue(newValue)
    onValueChange?.(newValue)
  }

  const handleDecrement = () => {
    const newValue = inputValue > 1 ? inputValue - 1 : 1
    setInputValue(newValue)
    onValueChange?.(newValue)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(event.target.value, 10)
    if (!Number.isNaN(newValue) && newValue >= 1) {
      setInputValue(newValue)
    } else if (event.target.value === '') {
      setInputValue(0)
    }
  }

  const handleBlur = () => {
    onValueChange?.(inputValue)
  }

  return (
    <fieldset className="flex w-full flex-col gap-2 py-2">
      <label className="font-bold" htmlFor={name}>
        {label}
      </label>
      <div
        aria-disabled={disabled}
        className="flex h-12 items-center gap-1 rounded border p-1 aria-disabled:bg-gray-100 aria-disabled:[&_button]:opacity-0"
      >
        {!!hasPlusMinusButton && (
          <button
            className="cursor-pointer rounded-md p-2 hover:bg-gray-100 active:bg-green disabled:cursor-not-allowed disabled:opacity-0"
            disabled={disabled || inputValue <= 1}
            onClick={handleDecrement}
            type="button"
          >
            <Minus size={20} />
          </button>
        )}
        <input
          className="w-full text-center [appearance:textfield] disabled:bg-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          disabled={disabled}
          id={name}
          min="1"
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={(event) => event.target.select()}
          type="number"
          value={inputValue}
        />
        {!!hasPlusMinusButton && (
          <button
            className="cursor-pointer rounded-md p-2 hover:bg-gray-100 active:bg-green disabled:cursor-not-allowed disabled:opacity-0"
            disabled={disabled}
            onClick={handleIncrement}
            type="button"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      {!!description && <div>{description}</div>}
    </fieldset>
  )
}

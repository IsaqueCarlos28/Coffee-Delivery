import styled from 'styled-components'
import { MAX_QUANTITY } from '../constants'

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  ariaLabel?: string
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const ControlButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.25rem;
  font-weight: 700;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const ValueInput = styled.input`
  width: 2rem;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-size: 1rem;
  font-weight: 400;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = MAX_QUANTITY,
  ariaLabel = 'Quantidade',
}: QuantityInputProps) {
  const handleDecrease = () => {
    onChange(clamp(value - 1, min, max))
  }

  const handleIncrease = () => {
    onChange(clamp(value + 1, min, max))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, '')

    if (rawValue === '') {
      onChange(min)
      return
    }

    const parsed = Number(rawValue)
    if (!Number.isInteger(parsed)) return

    onChange(clamp(parsed, min, max))
  }

  return (
    <Container>
      <ControlButton
        type="button"
        onClick={handleDecrease}
        aria-label="Diminuir quantidade"
        disabled={value <= min}
      >
        −
      </ControlButton>
      <ValueInput
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={ariaLabel}
        value={value}
        onChange={handleInputChange}
      />
      <ControlButton
        type="button"
        onClick={handleIncrease}
        aria-label="Aumentar quantidade"
        disabled={value >= max}
      >
        +
      </ControlButton>
    </Container>
  )
}

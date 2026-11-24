import styled from 'styled-components'
import { useTheme } from '../hooks/useTheme'

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  @media (min-width: 480px) {
    padding: 0.5rem 0.75rem;
  }
`

const ToggleText = styled.span`
  display: none;

  @media (min-width: 480px) {
    display: inline;
  }
`

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <ToggleButton
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      aria-pressed={isDark}
      title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
      <ToggleText>{isDark ? 'Claro' : 'Escuro'}</ToggleText>
    </ToggleButton>
  )
}

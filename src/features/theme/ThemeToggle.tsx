import type { ReactElement } from 'react';
import { useTheme } from './useTheme';

export function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Chuyển sang giao diện ${isLight ? 'tối' : 'sáng'}`}
      title={`Chuyển sang giao diện ${isLight ? 'tối' : 'sáng'}`}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1px solid currentColor',
        backgroundColor: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        fontSize: '0.875rem',
        transition: 'all 0.2s ease',
      }}
    >
      <span aria-hidden="true">{isLight ? '🌙' : '☀️'}</span>
      <span>{isLight ? 'Chế độ tối' : 'Chế độ sáng'}</span>
    </button>
  );
}

export default ThemeToggle;

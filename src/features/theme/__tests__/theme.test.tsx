import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../useTheme';
import { ThemeToggle } from '../ThemeToggle';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-btn">
        Đổi
      </button>
    </div>
  );
}

describe('ThemeContext & useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
  });

  it('cung cấp theme mặc định là light và gán data-theme lên documentElement', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('chuyển đổi theme từ light sang dark và cập nhật dataset.theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByTestId('toggle-btn');
    await user.click(button);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('ThemeToggle component render đúng nhãn và chuyển đổi khi click', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /Chuyển sang giao diện tối/i });
    expect(toggleBtn).toBeInTheDocument();

    await user.click(toggleBtn);

    expect(
      screen.getByRole('button', { name: /Chuyển sang giao diện sáng/i })
    ).toBeInTheDocument();
  });

  it('ném lỗi khi useTheme được gọi ngoài ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme phải được sử dụng bên trong một <ThemeProvider>');

    consoleSpy.mockRestore();
  });
});

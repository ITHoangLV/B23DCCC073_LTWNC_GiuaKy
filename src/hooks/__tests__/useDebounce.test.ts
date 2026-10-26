import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce custom hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('1. Trả về giá trị ban đầu ngay lập tức khi hook khởi tạo', () => {
    const { result } = renderHook(() => useDebounce('ban đầu', 300));
    expect(result.current).toBe('ban đầu');
  });

  it('2. Không thay đổi giá trị trước khi hết thời gian chờ debounce (300ms)', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }: { val: string; delay: number }) => useDebounce(val, delay),
      { initialProps: { val: 'từ khoá 1', delay: 300 } }
    );

    expect(result.current).toBe('từ khoá 1');

    rerender({ val: 'từ khoá 2', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('từ khoá 1');
  });

  it('3. Cập nhật đúng giá trị mới sau khi hết đủ thời gian trễ debounce (300ms)', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }: { val: string; delay: number }) => useDebounce(val, delay),
      { initialProps: { val: 'react', delay: 300 } }
    );

    rerender({ val: 'react typescript', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('react typescript');
  });

  it('4. Reset timer khi giá trị thay đổi liên tục và chỉ lấy giá trị cuối cùng', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }: { val: string; delay: number }) => useDebounce(val, delay),
      { initialProps: { val: 'a', delay: 300 } }
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ val: 'ab', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ val: 'abc', delay: 300 });

    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('abc');
  });

  it('5. Hoạt động với nhiều kiểu dữ liệu khác nhau (Generic: number, object)', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }: { val: number; delay: number }) => useDebounce(val, delay),
      { initialProps: { val: 10, delay: 200 } }
    );

    rerender({ val: 25, delay: 200 });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe(25);
  });
});

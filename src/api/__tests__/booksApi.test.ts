import { fetchBooksApi } from '../booksApi';
import { isOk, isErr } from '../../types/api';
import { MOCK_BOOKS } from '../../data/mockBooks';

describe('booksApi - API giả lập và Type Guards', () => {
  it('trả về danh sách sách thành công khi không có cờ shouldFail', async () => {
    const result = await fetchBooksApi({ delayMs: 10 });

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.data).toHaveLength(MOCK_BOOKS.length);
      expect(result.data[0].id).toBe('book-1');
      expect(result.ok).toBe(true);
    }
  });

  it('trả về lỗi khi shouldFail = true', async () => {
    const result = await fetchBooksApi({ shouldFail: true, delayMs: 10 });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Không thể kết nối đến máy chủ thư viện');
    }
  });

  it('trả về bản sao dữ liệu mới, không làm biến đổi (mutate) mảng mockBooks gốc', async () => {
    const result = await fetchBooksApi({ delayMs: 10 });

    if (isOk(result)) {
      result.data[0].available = 999;
      expect(MOCK_BOOKS[0].available).toBe(4);
    }
  });

  it('type guards isOk và isErr thu hẹp kiểu (narrowing) chính xác', () => {
    const successResult = { ok: true as const, data: ['test'] };
    const errorResult = { ok: false as const, error: 'Lỗi mạng' };

    expect(isOk(successResult)).toBe(true);
    expect(isErr(successResult)).toBe(false);

    expect(isOk(errorResult)).toBe(false);
    expect(isErr(errorResult)).toBe(true);
  });
});

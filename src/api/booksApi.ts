import type { ApiResult } from '../types/api';
import type { Book } from '../features/books/types';
import { MOCK_BOOKS } from '../data/mockBooks';

export interface FetchBooksApiOptions {
  shouldFail?: boolean;
  delayMs?: number;
}

export function fetchBooksApi(
  options: FetchBooksApiOptions = {}
): Promise<ApiResult<Book[]>> {
  const { shouldFail = false, delayMs = 500 } = options;

  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện (HTTP 500). Vui lòng thử lại sau!',
        });
        return;
      }

      const clonedBooks: Book[] = MOCK_BOOKS.map((book) => ({ ...book }));
      resolve({
        ok: true,
        data: clonedBooks,
      });
    }, delayMs);
  });
}

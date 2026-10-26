import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { borrowBook, setWarning } from '../../features/books/booksSlice';

export const MAX_BORROW = 3;

export const borrowLimitMiddleware: Middleware<{}, RootState> =
  (storeApi) => (next) => (action) => {
    if (borrowBook.match(action)) {
      const state = storeApi.getState();
      const currentBorrowedCount = state.books.borrowedIds.length;

      if (currentBorrowedCount >= MAX_BORROW) {
        storeApi.dispatch(
          setWarning(`Bạn chỉ được mượn tối đa ${MAX_BORROW} cuốn sách cùng lúc! Hãy trả bớt sách trước khi mượn thêm.`)
        );
        // Dừng tại đây, không chuyển tiếp action đến Reducer
        return;
      }
    }

    return next(action);
  };

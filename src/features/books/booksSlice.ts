import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Book } from './types';
import { fetchBooks } from './booksThunks';

export interface BooksState {
  readonly items: Book[];
  readonly status: 'idle' | 'loading' | 'succeeded' | 'failed';
  readonly error: string | null;
  readonly borrowedIds: string[];
  readonly warning: string | null;
}

const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
  borrowedIds: [],
  warning: null,
};

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);

      if (!book) {
        state.warning = 'Không tìm thấy sách yêu cầu!';
        return;
      }

      if (book.available <= 0) {
        state.warning = `Sách "${book.title}" đã hết bản trong thư viện!`;
        return;
      }

      if (state.borrowedIds.includes(bookId)) {
        state.warning = `Bạn đã mượn cuốn "${book.title}" rồi!`;
        return;
      }

      book.available -= 1;
      state.borrowedIds.push(bookId);
      state.warning = null;
    },

    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const index = state.borrowedIds.indexOf(bookId);

      if (index === -1) {
        state.warning = 'Bạn không đang mượn cuốn sách này!';
        return;
      }

      state.borrowedIds.splice(index, 1);
      const book = state.items.find((b) => b.id === bookId);
      if (book) {
        book.available += 1;
      }
      state.warning = null;
    },

    setWarning: (state, action: PayloadAction<string>) => {
      state.warning = action.payload;
    },

    clearWarning: (state) => {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể tải danh sách sách!';
      });
  },
});

export const { borrowBook, returnBook, setWarning, clearWarning } = booksSlice.actions;
export default booksSlice.reducer;

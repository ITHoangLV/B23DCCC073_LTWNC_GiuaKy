import booksReducer, {
  borrowBook,
  returnBook,
  setWarning,
  clearWarning,
  type BooksState,
} from '../booksSlice';
import { fetchBooks } from '../booksThunks';
import type { Book } from '../types';

const sampleBook1: Book = {
  id: 'b-1',
  title: 'React TypeScript Pro',
  author: 'Nguyễn Văn A',
  category: 'CNTT',
  year: 2023,
  available: 2,
};

const sampleBookOutOfStock: Book = {
  id: 'b-2',
  title: 'Clean Code',
  author: 'Robert Martin',
  category: 'CNTT',
  year: 2008,
  available: 0,
};

describe('booksSlice Reducer & ExtraReducers', () => {
  const initialTestState: BooksState = {
    items: [sampleBook1, sampleBookOutOfStock],
    status: 'idle',
    error: null,
    borrowedIds: [],
    warning: null,
  };

  it('1. Trả về state mặc định ban đầu khi action không khớp', () => {
    expect(booksReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      items: [],
      status: 'idle',
      error: null,
      borrowedIds: [],
      warning: null,
    });
  });

  it('2. borrowBook: giảm số bản available đi 1 và thêm id vào borrowedIds', () => {
    const nextState = booksReducer(initialTestState, borrowBook('b-1'));

    expect(nextState.borrowedIds).toContain('b-1');
    expect(nextState.items.find((b) => b.id === 'b-1')?.available).toBe(1);
    expect(nextState.warning).toBeNull();
  });

  it('3. returnBook: tăng số bản available lên 1 và xoá id khỏi borrowedIds', () => {
    const borrowedState: BooksState = {
      ...initialTestState,
      items: [{ ...sampleBook1, available: 1 }],
      borrowedIds: ['b-1'],
    };

    const nextState = booksReducer(borrowedState, returnBook('b-1'));

    expect(nextState.borrowedIds).not.toContain('b-1');
    expect(nextState.items.find((b) => b.id === 'b-1')?.available).toBe(2);
    expect(nextState.warning).toBeNull();
  });

  it('4. Phòng thủ: không cho phép mượn khi sách đã hết bản (available = 0)', () => {
    const nextState = booksReducer(initialTestState, borrowBook('b-2'));

    expect(nextState.borrowedIds).not.toContain('b-2');
    expect(nextState.items.find((b) => b.id === 'b-2')?.available).toBe(0);
    expect(nextState.warning).toContain('đã hết bản');
  });

  it('5. Phòng thủ: không cho phép mượn trùng cuốn sách đang mượn', () => {
    const alreadyBorrowedState: BooksState = {
      ...initialTestState,
      borrowedIds: ['b-1'],
    };

    const nextState = booksReducer(alreadyBorrowedState, borrowBook('b-1'));

    expect(nextState.borrowedIds).toEqual(['b-1']);
    expect(nextState.warning).toContain('Bạn đã mượn cuốn');
  });

  it('6. setWarning và clearWarning hoạt động chính xác', () => {
    const warnedState = booksReducer(initialTestState, setWarning('Cảnh báo quá hạn'));
    expect(warnedState.warning).toBe('Cảnh báo quá hạn');

    const clearedState = booksReducer(warnedState, clearWarning());
    expect(clearedState.warning).toBeNull();
  });

  it('7. fetchBooks.pending chuyển status thành "loading"', () => {
    const action = { type: fetchBooks.pending.type };
    const nextState = booksReducer(initialTestState, action);

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  it('8. fetchBooks.fulfilled lưu danh sách sách và chuyển status thành "succeeded"', () => {
    const mockBooksList: Book[] = [sampleBook1];
    const action = {
      type: fetchBooks.fulfilled.type,
      payload: mockBooksList,
    };
    const nextState = booksReducer(initialTestState, action);

    expect(nextState.status).toBe('succeeded');
    expect(nextState.items).toEqual(mockBooksList);
    expect(nextState.error).toBeNull();
  });

  it('9. fetchBooks.rejected lưu lỗi và chuyển status thành "failed"', () => {
    const errorMessage = 'Máy chủ thư viện bảo trì';
    const action = {
      type: fetchBooks.rejected.type,
      payload: errorMessage,
    };
    const nextState = booksReducer(initialTestState, action);

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe(errorMessage);
  });
});

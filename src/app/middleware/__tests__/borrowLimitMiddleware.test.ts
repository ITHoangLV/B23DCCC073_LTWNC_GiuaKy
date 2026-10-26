import { configureStore } from '@reduxjs/toolkit';
import booksReducer, {
  borrowBook,
  returnBook,
} from '../../../features/books/booksSlice';
import { borrowLimitMiddleware, MAX_BORROW } from '../borrowLimitMiddleware';
import type { Book } from '../../../features/books/types';

const createMockBooks = (): Book[] => [
  { id: 'b-1', title: 'Sách 1', author: 'Tác giả 1', category: 'CNTT', year: 2020, available: 5 },
  { id: 'b-2', title: 'Sách 2', author: 'Tác giả 2', category: 'Kinh tế', year: 2021, available: 5 },
  { id: 'b-3', title: 'Sách 3', author: 'Tác giả 3', category: 'Ngoại ngữ', year: 2022, available: 5 },
  { id: 'b-4', title: 'Sách 4', author: 'Tác giả 4', category: 'CNTT', year: 2023, available: 5 },
  { id: 'b-5', title: 'Sách 5', author: 'Tác giả 5', category: 'Kinh tế', year: 2024, available: 0 },
];

function createTestStore() {
  const store = configureStore({
    reducer: {
      books: booksReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(borrowLimitMiddleware),
  });

  store.dispatch({
    type: 'books/fetchBooks/fulfilled',
    payload: createMockBooks(),
  });

  return store;
}

describe('borrowLimitMiddleware - Giới hạn mượn tối đa 3 cuốn', () => {
  it('hằng số MAX_BORROW phải bằng 3', () => {
    expect(MAX_BORROW).toBe(3);
  });

  it('cho phép mượn lần lượt 3 cuốn sách đầu tiên bình thường', () => {
    const store = createTestStore();

    store.dispatch(borrowBook('b-1'));
    store.dispatch(borrowBook('b-2'));
    store.dispatch(borrowBook('b-3'));

    const state = store.getState().books;
    expect(state.borrowedIds).toEqual(['b-1', 'b-2', 'b-3']);
    expect(state.borrowedIds).toHaveLength(3);
    expect(state.warning).toBeNull();
  });

  it('chặn mượn cuốn thứ 4 khi đã mượn đủ 3 cuốn và hiển thị cảnh báo', () => {
    const store = createTestStore();

    store.dispatch(borrowBook('b-1'));
    store.dispatch(borrowBook('b-2'));
    store.dispatch(borrowBook('b-3'));

    store.dispatch(borrowBook('b-4'));

    const state = store.getState().books;
    expect(state.borrowedIds).toEqual(['b-1', 'b-2', 'b-3']);
    expect(state.borrowedIds).toHaveLength(3);

    const book4 = state.items.find((b) => b.id === 'b-4');
    expect(book4?.available).toBe(5);

    expect(state.warning).toBe(
      'Bạn chỉ được mượn tối đa 3 cuốn sách cùng lúc! Hãy trả bớt sách trước khi mượn thêm.'
    );
  });

  it('trả 1 cuốn sách thì có thể mượn lại cuốn khác thành công', () => {
    const store = createTestStore();

    store.dispatch(borrowBook('b-1'));
    store.dispatch(borrowBook('b-2'));
    store.dispatch(borrowBook('b-3'));

    store.dispatch(borrowBook('b-4'));
    expect(store.getState().books.borrowedIds).toHaveLength(3);

    store.dispatch(returnBook('b-1'));
    expect(store.getState().books.borrowedIds).toHaveLength(2);
    expect(store.getState().books.borrowedIds).not.toContain('b-1');

    store.dispatch(borrowBook('b-4'));
    const finalState = store.getState().books;
    expect(finalState.borrowedIds).toHaveLength(3);
    expect(finalState.borrowedIds).toContain('b-4');
    expect(finalState.warning).toBeNull();
  });

  it('cho phép các action khác (như returnBook) đi qua bình thường không bị can thiệp', () => {
    const store = createTestStore();

    store.dispatch(borrowBook('b-1'));
    expect(store.getState().books.borrowedIds).toContain('b-1');

    store.dispatch(returnBook('b-1'));
    expect(store.getState().books.borrowedIds).not.toContain('b-1');
  });
});

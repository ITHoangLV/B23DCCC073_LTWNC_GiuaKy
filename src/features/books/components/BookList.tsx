import { useMemo, useCallback } from 'react';
import type { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectBookItems, selectBorrowedIds } from '../selectors';
import { borrowBook, returnBook } from '../booksSlice';
import { useFilterStore } from '../../filters/useFilterStore';
import { BookItem } from './BookItem';

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function BookList(): ReactElement {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBookItems);
  const borrowedIds = useAppSelector(selectBorrowedIds);

  const keyword = useFilterStore((state) => state.keyword);
  const category = useFilterStore((state) => state.category);

  const handleBorrow = useCallback(
    (id: string) => {
      dispatch(borrowBook(id));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
    },
    [dispatch]
  );

  const filteredBooks = useMemo(() => {
    const trimmedKeyword = keyword.trim();
    const normalizedKeyword = normalizeText(trimmedKeyword);

    return books.filter((book) => {
      const matchesCategory =
        category === 'Tất cả' || book.category === category;

      const matchesKeyword =
        trimmedKeyword === '' ||
        normalizeText(book.title).includes(normalizedKeyword) ||
        normalizeText(book.author).includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });
  }, [books, keyword, category]);

  if (filteredBooks.length === 0) {
    return (
      <div
        data-testid="empty-books-message"
        style={{
          padding: '4rem 1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-light) 100%)',
          borderRadius: '16px',
          border: '1px dashed var(--border-color)',
          marginTop: '1.5rem',
        }}
      >
        <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem', lineHeight: 1 }}>📚🔍</p>
        <h3
          style={{
            margin: '0 0 0.5rem',
            color: 'var(--text-primary)',
            fontSize: '1.15rem',
            fontWeight: 700,
          }}
        >
          Không tìm thấy sách phù hợp
        </h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Hãy thử tìm kiếm với từ khoá khác hoặc chọn lại thể loại{' '}
          <strong>"Tất cả"</strong>.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="books-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginTop: 0,
      }}
    >
      {filteredBooks.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          isBorrowed={borrowedIds.includes(book.id)}
          onBorrow={handleBorrow}
          onReturn={handleReturn}
        />
      ))}
    </div>
  );
}

export default BookList;

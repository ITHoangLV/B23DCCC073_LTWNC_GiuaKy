import type { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchBooks } from '../booksThunks';
import { selectBooksStatus, selectBooksError } from '../selectors';
import { BorrowedList } from './BorrowedList';
import { SearchBar } from '../../filters/components/SearchBar';
import { CategoryFilter } from '../../filters/components/CategoryFilter';
import { BookList } from './BookList';

export function MainLibraryView(): ReactElement {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);

  const handleRetry = () => {
    dispatch(fetchBooks({ shouldFail: false }));
  };

  if (status === 'loading') {
    return (
      <div data-testid="loading-state" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="spinner" />
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
          Đang tải danh sách sách từ thư viện (khoảng 500ms)...
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div
        role="alert"
        data-testid="error-state"
        style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          backgroundColor: 'var(--danger-bg)',
          border: '1px solid var(--danger-color)',
          borderRadius: '12px',
          maxWidth: '550px',
          margin: '2rem auto',
        }}
      >
        <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>❌</p>
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--danger-color)' }}>
          Tải dữ liệu thất bại!
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          {error}
        </p>
        <button
          type="button"
          onClick={handleRetry}
          style={{
            padding: '0.6rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--accent-color)',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <BorrowedList />

      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <SearchBar />
        <CategoryFilter />
      </section>

      <section>
        <BookList />
      </section>
    </>
  );
}

export default MainLibraryView;

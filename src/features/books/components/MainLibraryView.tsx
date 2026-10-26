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
    <div className="library-layout">
      <aside className="library-sidebar-left">
        <section
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <h2
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              margin: '0 0 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            <span aria-hidden="true">🏷️</span>
            <span>Thể loại sách</span>
          </h2>
          <CategoryFilter />
        </section>
      </aside>

      <div className="library-main">
        <section style={{ marginBottom: '1.25rem' }}>
          <SearchBar />
        </section>

        <section>
          <BookList />
        </section>
      </div>

      <aside className="library-sidebar-right">
        <BorrowedList />
      </aside>
    </div>
  );
}

export default MainLibraryView;

import { useEffect, useMemo } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBooks } from '../books/booksThunks';
import {
  selectBookItems,
  selectBooksStatus,
  selectBooksError,
  selectBorrowedCount,
  selectBorrowedBooks,
} from '../books/selectors';
import type { CategoryStats, Category } from '../books/types';
import { returnBook } from '../books/booksSlice';
import { MAX_BORROW } from '../../app/middleware/borrowLimitMiddleware';

const CATEGORY_STYLE: Record<
  Category,
  { color: string; light: string; emoji: string }
> = {
  CNTT:      { color: 'var(--cntt-color)',      light: 'var(--cntt-light)',      emoji: '💻' },
  'Kinh tế': { color: 'var(--kinhte-color)',    light: 'var(--kinhte-light)',    emoji: '💼' },
  'Ngoại ngữ': { color: 'var(--ngoaingu-color)', light: 'var(--ngoaingu-light)', emoji: '🌏' },
};

export function StatsPage(): ReactElement {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBookItems);
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);
  const borrowedCount = useAppSelector(selectBorrowedCount);
  const borrowedBooks = useAppSelector(selectBorrowedBooks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [dispatch, status]);

  const categoryStats = useMemo<CategoryStats>(() => {
    const stats: CategoryStats = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book) => {
      if (book.category in stats) {
        stats[book.category] += 1;
      }
    });

    return stats;
  }, [books]);

  const totalAvailableCopies = useMemo<number>(() => {
    return books.reduce((acc, book) => acc + book.available, 0);
  }, [books]);

  if (status === 'loading') {
    return (
      <div
        data-testid="stats-loading"
        style={{
          textAlign: 'center',
          padding: '5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className="spinner" />
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
          Đang tải dữ liệu thống kê từ máy chủ thư viện...
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div
        role="alert"
        style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          backgroundColor: 'var(--danger-bg)',
          border: '1px solid var(--danger-color)',
          borderRadius: '14px',
          maxWidth: '550px',
          margin: '2rem auto',
        }}
      >
        <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem', lineHeight: 1 }}>❌</p>
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--danger-color)', fontWeight: 700 }}>
          Không thể tải dữ liệu thống kê!
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          {error}
        </p>
        <button
          type="button"
          onClick={() => dispatch(fetchBooks({ shouldFail: false }))}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem' }}
        >
          🔄 Thử lại
        </button>
      </div>
    );
  }

  const categories: readonly Category[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  return (
    <div data-testid="stats-page" style={{ paddingBottom: '2rem' }} className="fade-in-up">
      <div style={{ marginBottom: '1.75rem' }}>
        <Link
          to="/"
          id="back-home-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--accent-color)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          <span aria-hidden="true">←</span>
          <span>Quay lại trang tra cứu sách</span>
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            margin: '0 0 0.4rem',
            fontSize: '1.65rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          📊 Thống Kê Hoạt Động Thư Viện
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
          Tổng hợp chi tiết phân bổ đầu sách theo chuyên ngành và tình trạng mượn trả của sinh viên.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          className="stats-card"
          style={{
            background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--ngoaingu-color) 100%)',
            borderRadius: '14px',
            padding: '1.35rem 1.25rem',
            color: '#ffffff',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tổng số đầu sách
          </span>
          <p
            data-testid="total-books-count"
            style={{ margin: '0.5rem 0 0.25rem', fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }}
          >
            {books.length}
          </p>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>đầu sách chuyên ngành</span>
        </div>

        <div
          className="stats-card"
          style={{
            background: 'linear-gradient(135deg, var(--success-color) 0%, #059669 100%)',
            borderRadius: '14px',
            padding: '1.35rem 1.25rem',
            color: '#ffffff',
            boxShadow: '0 4px 14px 0 rgb(22 163 74 / 0.3)',
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Bản còn trong kho
          </span>
          <p
            data-testid="total-copies-count"
            style={{ margin: '0.5rem 0 0.25rem', fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }}
          >
            {totalAvailableCopies}
          </p>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>cuốn sẵn sàng cho mượn</span>
        </div>

        <div
          className="stats-card"
          style={{
            background: borrowedCount >= MAX_BORROW
              ? 'linear-gradient(135deg, var(--warning-color) 0%, #b45309 100%)'
              : 'linear-gradient(135deg, var(--cntt-color) 0%, var(--kinhte-color) 100%)',
            borderRadius: '14px',
            padding: '1.35rem 1.25rem',
            color: '#ffffff',
            boxShadow: borrowedCount >= MAX_BORROW
              ? '0 4px 14px 0 rgb(217 119 6 / 0.35)'
              : '0 4px 14px 0 rgb(99 102 241 / 0.3)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Đang mượn
          </span>
          <p
            data-testid="borrowed-stats-count"
            style={{ margin: '0.5rem 0 0.25rem', fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }}
          >
            {borrowedCount} / {MAX_BORROW}
          </p>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            {borrowedCount >= MAX_BORROW ? '⚠️ Đã đạt giới hạn tối đa' : 'cuốn đang giữ'}
          </span>
        </div>
      </div>

      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <h3
          style={{
            margin: '0 0 1.25rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          📑 Phân Bổ Đầu Sách Theo Thể Loại
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {categories.map((cat) => {
            const count = categoryStats[cat];
            const percentage = books.length > 0 ? Math.round((count / books.length) * 100) : 0;
            const { color, light, emoji } = CATEGORY_STYLE[cat];

            return (
              <div
                key={cat}
                data-testid={`category-stat-${cat}`}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem 1.1rem',
                  backgroundColor: light,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.625rem',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: color,
                    }}
                  >
                    <span aria-hidden="true">{emoji}</span>
                    {cat}
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      color: color,
                      lineHeight: 1,
                    }}
                  >
                    {count}{' '}
                    <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      đầu sách
                    </span>
                  </span>
                </div>

                <div
                  style={{
                    height: '7px',
                    width: '100%',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.4rem',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>

                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Chiếm {percentage}% tổng số đầu sách
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          📋 Chi Tiết Sách Đang Giữ ({borrowedCount} cuốn)
        </h3>

        {borrowedBooks.length === 0 ? (
          <p
            style={{
              margin: 0,
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
            }}
          >
            Hiện tại bạn không mượn cuốn sách nào từ thư viện.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {borrowedBooks.map((book) => (
              <div
                key={book.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: '0 0 0.2rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {book.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {CATEGORY_STYLE[book.category].emoji}{' '}
                    <strong>{book.category}</strong> · ✍️ <strong>{book.author}</strong> · 📅 {book.year}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(returnBook(book.id))}
                  className="btn btn-warning"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  ↩ Trả sách
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Bắt buộc export default để React.lazy hoạt động chính xác
export default StatsPage;

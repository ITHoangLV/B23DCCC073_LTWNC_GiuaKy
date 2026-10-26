import React from 'react';
import type { ReactElement } from 'react';
import type { BookCardProps } from '../types';

export interface BookItemProps {
  readonly book: BookCardProps;
  readonly isBorrowed: boolean;
  readonly onBorrow: (id: string) => void;
  readonly onReturn: (id: string) => void;
}

function getBadgeClass(category: BookCardProps['category']): string {
  if (category === 'CNTT') return 'badge-cntt';
  if (category === 'Kinh tế') return 'badge-kinhte';
  return 'badge-ngoaingu';
}

export const BookItem = React.memo(function BookItem({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
}: BookItemProps): ReactElement {
  const isOutOfStock = book.available <= 0;

  const handleBorrowClick = () => {
    if (!isOutOfStock && !isBorrowed) {
      onBorrow(book.id);
    }
  };

  const handleReturnClick = () => {
    if (isBorrowed) {
      onReturn(book.id);
    }
  };

  return (
    <article
      className="book-card fade-in-up"
      data-testid={`book-item-${book.id}`}
      data-category={book.category}
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '1rem 1rem 0.9rem',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div>
        {book.coverImage && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              backgroundColor: 'var(--accent-light)',
            }}
          >
            <img
              src={book.coverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isOutOfStock ? 'grayscale(0.6) opacity(0.7)' : 'none',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.65rem',
          }}
        >
          <span
            className={`category-badge ${getBadgeClass(book.category)}`}
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '999px',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {book.category}
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            {book.year}
          </span>
        </div>

        <h3
          style={{
            fontSize: '0.98rem',
            margin: '0 0 0.4rem',
            lineHeight: 1.4,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          {book.title}
        </h3>

        <p
          style={{
            margin: '0 0 0',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          ✍️{' '}
          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {book.author}
          </strong>
        </p>
      </div>

      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px dashed var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Số bản còn:
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: isOutOfStock ? 'var(--danger-color)' : 'var(--success-color)',
              background: isOutOfStock ? 'var(--danger-bg)' : 'var(--success-light)',
              padding: '0.15rem 0.6rem',
              borderRadius: '999px',
            }}
          >
            {book.available} cuốn
          </span>
        </div>

        {isBorrowed ? (
          <button
            type="button"
            data-testid={`return-btn-${book.id}`}
            onClick={handleReturnClick}
            className="btn btn-warning"
            style={{
              width: '100%',
              padding: '0.65rem',
              fontSize: '0.875rem',
              borderRadius: '9px',
            }}
          >
            <span aria-hidden="true">↩</span>
            <span>Trả sách</span>
          </button>
        ) : (
          <button
            type="button"
            data-testid={`borrow-btn-${book.id}`}
            disabled={isOutOfStock}
            onClick={handleBorrowClick}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.65rem',
              fontSize: '0.875rem',
              borderRadius: '9px',
              background: isOutOfStock ? 'var(--btn-disabled-bg)' : undefined,
              color: isOutOfStock ? 'var(--btn-disabled-text)' : undefined,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              opacity: isOutOfStock ? 0.65 : 1,
            }}
          >
            {isOutOfStock ? '🚫 Hết sách' : '📥 Mượn sách'}
          </button>
        )}
      </div>
    </article>
  );
});

export default BookItem;

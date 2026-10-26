import type { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectBorrowedBooks, selectBorrowedCount } from '../selectors';
import { returnBook } from '../booksSlice';
import { MAX_BORROW } from '../../../app/middleware/borrowLimitMiddleware';

export function BorrowedList(): ReactElement {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  const borrowedCount = useAppSelector(selectBorrowedCount);

  const handleReturn = (id: string) => {
    dispatch(returnBook(id));
  };

  const isFull = borrowedCount >= MAX_BORROW;

  return (
    <section
      data-testid="borrowed-section"
      style={{
        background: isFull
          ? 'linear-gradient(135deg, var(--warning-light), var(--bg-card))'
          : 'linear-gradient(135deg, var(--accent-light), var(--bg-card))',
        border: '1px solid',
        borderColor: isFull ? 'var(--warning-color)' : 'var(--border-color)',
        borderRadius: '14px',
        padding: '1.25rem',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: 'var(--shadow-xs)',
        transition: 'border-color 0.3s ease, background 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          <span aria-hidden="true">📖</span>
          <span>Sách tôi đang mượn</span>
        </h2>

        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            padding: '0.25rem 0.85rem',
            borderRadius: '999px',
            background: isFull
              ? 'linear-gradient(135deg, var(--warning-color), #b45309)'
              : 'var(--bg-card)',
            color: isFull ? '#ffffff' : 'var(--text-secondary)',
            border: isFull ? 'none' : '1px solid var(--border-color)',
            boxShadow: isFull ? '0 2px 8px rgb(217 119 6 / 0.3)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {borrowedCount}/{MAX_BORROW} cuốn
        </span>
      </div>

      {borrowedBooks.length === 0 ? (
        <p
          style={{
            margin: 0,
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
          }}
        >
          Hãy bắt đầu mượn sách!
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
          }}
        >
          {borrowedBooks.map((book) => (
            <div
              key={book.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-xs)',
                gap: '0.5rem',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: '38px',
                    height: '52px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '1px solid var(--border-color)',
                  }}
                />
              )}

              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p
                  style={{
                    margin: '0 0 0.15rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={book.title}
                >
                  {book.title}
                </p>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  {book.category} · {book.author}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleReturn(book.id)}
                aria-label={`Trả sách ${book.title}`}
                className="btn btn-warning"
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78rem',
                  borderRadius: '7px',
                  flexShrink: 0,
                }}
              >
                ↩ Trả
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default BorrowedList;

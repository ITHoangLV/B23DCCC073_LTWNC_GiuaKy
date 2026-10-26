import { useEffect, lazy, Suspense } from 'react';
import type { ReactElement } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchBooks } from './features/books/booksThunks';
import { selectBooksStatus, selectBooksWarning } from './features/books/selectors';
import { clearWarning } from './features/books/booksSlice';
import { MainLibraryView } from './features/books/components/MainLibraryView';
import { ThemeToggle } from './features/theme/ThemeToggle';

const StatsPage = lazy(() => import('./features/stats/StatsPage'));

export function App(): ReactElement {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectBooksStatus);
  const warning = useAppSelector(selectBooksWarning);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldFail = searchParams.get('fail') === '1';

    if (status === 'idle') {
      dispatch(fetchBooks({ shouldFail }));
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => {
        dispatch(clearWarning());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [warning, dispatch]);

  const isStatsPage = location.pathname === '/stats';

  return (
    <div className="app-container">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1
              style={{
                margin: '0 0 0.3rem',
                fontSize: '1.8rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.3rem',
                  height: '2.3rem',
                  borderRadius: '11px',
                  background: 'var(--accent-color)',
                  color: 'var(--bg-primary)',
                  boxShadow: 'var(--shadow-accent)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M8 7h8" />
                  <path d="M8 11h5" />
                </svg>
              </span>
              <span className="gradient-text">Thư viện sách</span>
            </h1>
          </Link>
          <p
            style={{
              margin: 0,
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Hệ thống tra cứu và quản lý mượn / trả sách trực tuyến
          </p>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Link
            to="/"
            id="nav-home-link"
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '10px',
              background: !isStatsPage
                ? 'var(--accent-color)'
                : 'var(--bg-card)',
              border: '1px solid',
              borderColor: !isStatsPage ? 'transparent' : 'var(--border-color)',
              color: !isStatsPage ? 'var(--bg-primary)' : 'var(--text-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: !isStatsPage ? 'var(--shadow-accent)' : 'none',
            }}
          >
            <span aria-hidden="true">📖</span>
            <span>Tra cứu</span>
          </Link>

          <Link
            to="/stats"
            id="nav-stats-link"
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '10px',
              background: isStatsPage
                ? 'var(--accent-color)'
                : 'var(--bg-card)',
              border: '1px solid',
              borderColor: isStatsPage ? 'transparent' : 'var(--border-color)',
              color: isStatsPage ? 'var(--bg-primary)' : 'var(--text-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              boxShadow: isStatsPage ? 'var(--shadow-accent)' : 'none',
            }}
          >
            <span aria-hidden="true">📊</span>
            <span>Thống kê</span>
          </Link>

          <ThemeToggle />
        </nav>
      </header>

      {warning && (
        <aside
          role="alert"
          data-testid="warning-banner"
          className="fade-in-up"
          style={{
            background: 'linear-gradient(135deg, var(--danger-bg), #fff1f1)',
            border: '1px solid',
            borderColor: 'var(--danger-color)',
            color: 'var(--danger-color)',
            padding: '0.9rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px -2px rgb(220 38 38 / 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span aria-hidden="true">⚠️</span>
            <span>{warning}</span>
          </div>

          <button
            type="button"
            onClick={() => dispatch(clearWarning())}
            aria-label="Đóng cảnh báo"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--danger-color)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: '0 0.5rem',
              opacity: 0.8,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </aside>
      )}

      <main>
        <Suspense
          fallback={
            <div
              data-testid="suspense-loading"
              style={{
                textAlign: 'center',
                padding: '5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div className="spinner" />
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Đang tải trang...
              </p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<MainLibraryView />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<MainLibraryView />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;

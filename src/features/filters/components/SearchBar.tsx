import { useState, useEffect } from 'react';
import type { ReactElement, ChangeEvent } from 'react';
import { useFilterStore } from '../useFilterStore';
import { useDebounce } from '../../../hooks/useDebounce';

export function SearchBar(): ReactElement {
  const keywordFromStore = useFilterStore((state) => state.keyword);
  const setKeyword = useFilterStore((state) => state.setKeyword);

  const [inputValue, setInputValue] = useState(keywordFromStore);

  const debouncedKeyword = useDebounce(inputValue, 300);

  useEffect(() => {
    setKeyword(debouncedKeyword);
  }, [debouncedKeyword, setKeyword]);

  useEffect(() => {
    if (keywordFromStore !== inputValue && keywordFromStore === '') {
      setInputValue('');
    }
  }, [keywordFromStore, inputValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
    setKeyword('');
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
      <span
        style={{
          position: 'absolute',
          left: '0.9rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
          fontSize: '1rem',
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        🔍
      </span>

      <input
        type="search"
        id="search-input"
        data-testid="search-input"
        placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
        value={inputValue}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '0.7rem 2.5rem 0.7rem 2.6rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          fontFamily: 'var(--font-family)',
          fontWeight: 500,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: 'var(--shadow-xs)',
        }}
      />

      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Xoá tìm kiếm"
          style={{
            position: 'absolute',
            right: '0.7rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--border-color)',
            border: 'none',
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.75rem',
            width: '1.35rem',
            height: '1.35rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;

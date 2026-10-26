import type { ReactElement } from 'react';
import { useFilterStore, type FilterCategory } from '../useFilterStore';

const CATEGORIES: readonly FilterCategory[] = [
  'Tất cả',
  'CNTT',
  'Kinh tế',
  'Ngoại ngữ',
];

const CATEGORY_EMOJI: Record<FilterCategory, string> = {
  'Tất cả': '🌐',
  'CNTT': '💻',
  'Kinh tế': '💼',
  'Ngoại ngữ': '🌏',
};

export function CategoryFilter(): ReactElement {
  const currentCategory = useFilterStore((state) => state.category);
  const setCategory = useFilterStore((state) => state.setCategory);

  return (
    <div
      role="group"
      aria-label="Lọc theo thể loại sách"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
      }}
    >
      {CATEGORIES.map((category) => {
        const isSelected = currentCategory === category;

        return (
          <button
            key={category}
            type="button"
            data-testid={`category-btn-${category}`}
            onClick={() => setCategory(category)}
            style={{
              width: '100%',
              padding: '0.6rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid',
              borderColor: isSelected ? 'transparent' : 'var(--border-color)',
              background: isSelected
                ? 'var(--accent-color)'
                : 'var(--bg-secondary)',
              color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isSelected ? 'var(--shadow-accent)' : 'var(--shadow-xs)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
              <span aria-hidden="true" style={{ fontSize: '1rem' }}>{CATEGORY_EMOJI[category]}</span>
              <span>{category}</span>
            </span>
            {isSelected && <span aria-hidden="true" style={{ fontSize: '0.85rem' }}>✓</span>}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;

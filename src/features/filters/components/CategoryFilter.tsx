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
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center',
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
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: isSelected ? 'transparent' : 'var(--border-color)',
              background: isSelected
                ? 'var(--gradient-brand)'
                : 'var(--bg-card)',
              color: isSelected ? '#ffffff' : 'var(--text-primary)',
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: isSelected ? 'var(--shadow-accent)' : 'var(--shadow-xs)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <span aria-hidden="true">{CATEGORY_EMOJI[category]}</span>
            <span>{category}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;

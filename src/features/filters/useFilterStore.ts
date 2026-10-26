import { create } from 'zustand';
import type { Category } from '../books/types';

export type FilterCategory = Category | 'Tất cả';

export interface FilterState {
  readonly keyword: string;
  readonly category: FilterCategory;
  readonly setKeyword: (keyword: string) => void;
  readonly setCategory: (category: FilterCategory) => void;
  readonly reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  keyword: '',
  category: 'Tất cả',
  setKeyword: (keyword: string) => set({ keyword }),
  setCategory: (category: FilterCategory) => set({ category }),
  reset: () => set({ keyword: '', category: 'Tất cả' }),
}));

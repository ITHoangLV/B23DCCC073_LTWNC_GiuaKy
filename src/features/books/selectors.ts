import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export const selectBooksState = (state: RootState) => state.books;

export const selectBookItems = (state: RootState) => state.books.items;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBorrowedIds = (state: RootState) => state.books.borrowedIds;
export const selectBooksWarning = (state: RootState) => state.books.warning;

export const selectBorrowedBooks = createSelector(
  [selectBookItems, selectBorrowedIds],
  (items, borrowedIds) => items.filter((book) => borrowedIds.includes(book.id))
);

export const selectBorrowedCount = createSelector(
  [selectBorrowedIds],
  (borrowedIds) => borrowedIds.length
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Book } from './types';
import { fetchBooksApi, type FetchBooksApiOptions } from '../../api/booksApi';
import { isOk } from '../../types/api';

export const fetchBooks = createAsyncThunk<
  Book[],
  FetchBooksApiOptions | undefined,
  { rejectValue: string }
>('books/fetchBooks', async (options, { rejectWithValue }) => {
  const result = await fetchBooksApi(options);

  if (isOk(result)) {
    return result.data;
  }

  return rejectWithValue(result.error);
});

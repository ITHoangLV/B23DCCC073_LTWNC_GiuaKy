import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../../books/booksSlice';
import { StatsPage } from '../StatsPage';
import type { Book } from '../../books/types';

const mockBooks: Book[] = [
  { id: 'b-1', title: 'React Pro', author: 'An', category: 'CNTT', year: 2023, available: 4 },
  { id: 'b-2', title: 'NodeJS', author: 'Binh', category: 'CNTT', year: 2022, available: 2 },
  { id: 'b-3', title: 'Kinh Tế Vĩ Mô', author: 'Chau', category: 'Kinh tế', year: 2021, available: 5 },
  { id: 'b-4', title: 'IELTS Prep', author: 'Dung', category: 'Ngoại ngữ', year: 2024, available: 3 },
];

function renderWithProviders(
  preloadedState = {
    books: {
      items: mockBooks,
      status: 'succeeded' as const,
      error: null,
      borrowedIds: ['b-1', 'b-3'],
      warning: null,
    },
  }
) {
  const store = configureStore({
    reducer: {
      books: booksReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <StatsPage />
      </MemoryRouter>
    </Provider>
  );
}

describe('StatsPage Component (Route /stats & Record<Category, number>)', () => {
  it('1. Hiển thị số lượng đầu sách theo từng thể loại chính xác', () => {
    renderWithProviders();

    const cnttStat = screen.getByTestId('category-stat-CNTT');
    expect(cnttStat).toHaveTextContent('2 đầu sách');

    const kinhTeStat = screen.getByTestId('category-stat-Kinh tế');
    expect(kinhTeStat).toHaveTextContent('1 đầu sách');

    const ngoaiNguStat = screen.getByTestId('category-stat-Ngoại ngữ');
    expect(ngoaiNguStat).toHaveTextContent('1 đầu sách');
  });

  it('2. Hiển thị tổng số đầu sách và số sách sinh viên đang mượn', () => {
    renderWithProviders();

    expect(screen.getByTestId('total-books-count')).toHaveTextContent('4');

    expect(screen.getByTestId('borrowed-stats-count')).toHaveTextContent('2 / 3');

    expect(screen.getByTestId('total-copies-count')).toHaveTextContent('14');
  });

  it('3. Có link quay lại trang tra cứu sách trỏ về route "/"', () => {
    renderWithProviders();

    const backLink = screen.getByRole('link', { name: /Quay lại trang tra cứu sách/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('4. Tự động dispatch fetchBooks khi người dùng vào thẳng /stats lúc status = idle', () => {
    const store = configureStore({
      reducer: {
        books: booksReducer,
      },
      preloadedState: {
        books: {
          items: [],
          status: 'idle' as const,
          error: null,
          borrowedIds: [],
          warning: null,
        },
      },
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <StatsPage />
        </MemoryRouter>
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookItem } from '../BookItem';
import type { BookCardProps } from '../../types';

const mockBookAvailable: BookCardProps = {
  id: 'book-101',
  title: 'Học React và TypeScript Chuyên Sâu',
  author: 'Nguyễn Văn Dev',
  category: 'CNTT',
  year: 2024,
  available: 3,
};

const mockBookOutOfStock: BookCardProps = {
  id: 'book-102',
  title: 'Kinh Tế Lượng Ứng Dụng',
  author: 'Trần Kinh Tế',
  category: 'Kinh tế',
  year: 2022,
  available: 0,
};

describe('BookItem Component (React.memo + RTL + userEvent)', () => {
  it('1. Hiển thị đầy đủ và chính xác thông tin cuốn sách (tên, tác giả, thể loại, năm, số bản)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookItem
        book={mockBookAvailable}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(screen.getByText('Học React và TypeScript Chuyên Sâu')).toBeInTheDocument();
    expect(screen.getByText('Nguyễn Văn Dev')).toBeInTheDocument();
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
    expect(screen.getByText(/3 cuốn/)).toBeInTheDocument();
  });

  it('2. Click vào nút "Mượn sách" gọi đúng hàm onBorrow với đúng book id', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookItem
        book={mockBookAvailable}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowBtn = screen.getByRole('button', { name: /Mượn sách/i });
    expect(borrowBtn).not.toBeDisabled();

    await user.click(borrowBtn);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('book-101');
    expect(handleReturn).not.toHaveBeenCalled();
  });

  it('3. Nút mượn bị vô hiệu hoá (disabled) khi số bản còn lại bằng 0 và không gọi onBorrow khi click', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookItem
        book={mockBookOutOfStock}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const outOfStockBtn = screen.getByRole('button', { name: /Hết sách/i });
    expect(outOfStockBtn).toBeDisabled();

    await user.click(outOfStockBtn);

    expect(handleBorrow).not.toHaveBeenCalled();
  });

  it('4. Hiển thị nút "Trả sách" khi sách đang được mượn (isBorrowed = true) và click gọi đúng onReturn', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookItem
        book={mockBookAvailable}
        isBorrowed={true}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const returnBtn = screen.getByRole('button', { name: /Trả sách/i });
    expect(returnBtn).toBeInTheDocument();

    await user.click(returnBtn);

    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('book-101');
    expect(handleBorrow).not.toHaveBeenCalled();
  });
});

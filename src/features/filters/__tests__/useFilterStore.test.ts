import { act } from '@testing-library/react';
import { useFilterStore } from '../useFilterStore';

describe('useFilterStore Zustand Store', () => {
  beforeEach(() => {
    act(() => {
      useFilterStore.getState().reset();
    });
  });

  it('khởi tạo với giá trị mặc định keyword rỗng và category là Tất cả', () => {
    const state = useFilterStore.getState();
    expect(state.keyword).toBe('');
    expect(state.category).toBe('Tất cả');
  });

  it('setKeyword cập nhật từ khoá tìm kiếm chính xác', () => {
    act(() => {
      useFilterStore.getState().setKeyword('React');
    });

    expect(useFilterStore.getState().keyword).toBe('React');
  });

  it('setCategory cập nhật thể loại sách chính xác', () => {
    act(() => {
      useFilterStore.getState().setCategory('CNTT');
    });

    expect(useFilterStore.getState().category).toBe('CNTT');
  });

  it('reset khôi phục trạng thái bộ lọc về ban đầu', () => {
    act(() => {
      useFilterStore.getState().setKeyword('Kinh tế');
      useFilterStore.getState().setCategory('Kinh tế');
    });

    expect(useFilterStore.getState().keyword).toBe('Kinh tế');
    expect(useFilterStore.getState().category).toBe('Kinh tế');

    act(() => {
      useFilterStore.getState().reset();
    });

    expect(useFilterStore.getState().keyword).toBe('');
    expect(useFilterStore.getState().category).toBe('Tất cả');
  });
});

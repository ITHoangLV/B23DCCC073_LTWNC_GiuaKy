# BÁO CÁO BÀI TẬP GIỮA KỲ — HỆ THỐNG THƯ VIỆN SÁCH

- **Môn học:** Lập trình Web Nâng Cao
- **Sinh viên thực hiện:** Lưu Việt Hoàng
- **Mã sinh viên:** `B23DCCC073`
- **Repository GitHub:** [https://github.com/ITHoangLV/B23DCCC073_LTWNC_GiuaKy](https://github.com/ITHoangLV/B23DCCC073_LTWNC_GiuaKy)
- **Công nghệ nền tảng:** React 18, TypeScript (Strict Mode), Redux Toolkit, Zustand, React Router DOM, Jest & React Testing Library, Vite.

---

## 1. Giới Thiệu Dự Án

Ứng dụng **Thư viện sách** là hệ thống quản lý và tra cứu sách trực tuyến dành cho sinh viên khoa CNTT, Kinh tế và Ngoại ngữ. Ứng dụng cung cấp giải pháp số hóa toàn diện việc mượn và trả sách với các tính năng:
- Tra cứu sách tốc độ cao với kỹ thuật debounce 300ms theo tên sách hoặc tên tác giả.
- Bộ lọc thể loại chuyên ngành kết hợp thanh tìm kiếm thông minh.
- Quản lý mượn/trả sách theo thời gian thực với middleware Redux kiểm soát giới hạn tối đa 3 cuốn/sinh viên.
- Bố cục 2 cột hiện đại với khu vực "Sách tôi đang mượn" nằm ở sidebar bên phải, hỗ trợ ghim cố định (sticky).
- Hỗ trợ giao diện 2 chế độ Sáng / Tối theo tông màu chủ đạo **Đen & Be (Black & Beige)** tinh tế, sang trọng.
- Trang thống kê phân bổ đầu sách và số lượng tồn kho tách bundle qua kỹ thuật Code-Splitting (`React.lazy` và `Suspense`).

---

## 2. Công Nghệ Sử Dụng & Kiến Trúc Dự Án

### 2.1. Công nghệ chính
- **Ngôn ngữ:** TypeScript 5.6 (Chế độ Strict, 100% không sử dụng `any`, không `@ts-ignore`).
- **Thư viện UI:** React 18 (Sử dụng Function Component, Hooks nâng cao `useMemo`, `useCallback`, `React.memo`).
- **Build tool:** Vite 6 (Hỗ trợ Fast Refresh và tối ưu hóa bundle khi build production).
- **Quản lý trạng thái:**
  - **Redux Toolkit + React-Redux:** Quản lý dữ liệu miền (Domain State) gồm danh mục sách, danh sách mượn, middleware kiểm soát giới hạn và async thunk nạp dữ liệu.
  - **Zustand:** Quản lý trạng thái giao diện (UI State) gồm từ khóa tìm kiếm và bộ lọc danh mục.
- **Quản lý Theme:** React Context API kết hợp CSS Custom Properties đồng bộ qua thuộc tính `data-theme`.
- **Định tuyến:** React Router DOM v6 với kiến trúc nạp chậm (Lazy Loading) trang Thống Kê.
- **Kiểm thử tự động:** Jest 29, ts-jest, jsdom, React Testing Library và `@testing-library/user-event`.

### 2.2. Cấu trúc thư mục (Feature-Based Architecture)
```
src/
├── api/
│   ├── __tests__/
│   │   └── booksApi.test.ts          Unit test API giả lập & Type Guards
│   └── booksApi.ts                   Mô phỏng API trễ 500ms, hỗ trợ cờ mô phỏng lỗi
├── app/
│   ├── middleware/
│   │   ├── __tests__/
│   │   │   └── borrowLimitMiddleware.test.ts  Test Redux Middleware giới hạn mượn
│   │   └── borrowLimitMiddleware.ts  Middleware chặn mượn quá 3 cuốn
│   ├── hooks.ts                      Typed hooks useAppDispatch & useAppSelector
│   └── store.ts                      Cấu hình Redux Store
├── data/
│   └── mockBooks.ts                  Dữ liệu 15 cuốn sách thuộc 3 chuyên ngành
├── features/
│   ├── books/
│   │   ├── __tests__/
│   │   │   └── booksSlice.test.ts    Test cases Reducer và ExtraReducers
│   │   ├── components/
│   │   │   ├── __tests__/
│   │   │   │   └── BookItem.test.tsx Test RTL và mô phỏng sự kiện người dùng
│   │   │   ├── BookItem.tsx          Thẻ sách tối ưu với React.memo
│   │   │   ├── BookList.tsx          Danh sách sách áp dụng lọc với useMemo
│   │   │   ├── BorrowedList.tsx      Sidebar sách đang mượn dạng cột
│   │   │   └── MainLibraryView.tsx   Bố cục 2 cột chính: Catalog và Sidebar
│   │   ├── booksSlice.ts             Redux Slice quản lý sách và thao tác mượn/trả
│   │   ├── booksThunks.ts            createAsyncThunk xử lý fetch dữ liệu bất đồng bộ
│   │   ├── selectors.ts              Selectors tối ưu với Redux
│   │   └── types.ts                  Khai báo kiểu và Utility Types (Record, Pick, Readonly, Partial)
│   ├── filters/
│   │   ├── __tests__/
│   │   │   └── useFilterStore.test.ts Test Zustand store
│   │   ├── components/
│   │   │   ├── CategoryFilter.tsx    Bộ lọc danh mục dạng pill
│   │   │   └── SearchBar.tsx         Ô tìm kiếm có debounce 300ms
│   │   └── useFilterStore.ts         Zustand store quản lý filter state
│   ├── stats/
│   │   ├── __tests__/
│   │   │   └── StatsPage.test.tsx    Test giao diện và tính toán số liệu thống kê
│   │   └── StatsPage.tsx             Trang thống kê tách bundle qua React.lazy
│   └── theme/
│       ├── __tests__/
│       │   └── theme.test.tsx        Test ThemeContext và toggle theme
│       ├── ThemeContext.tsx          Context lưu trữ theme và đồng bộ localStorage
│       ├── ThemeToggle.tsx           Nút chuyển đổi giao diện Sáng / Tối
│       └── useTheme.ts               Custom hook sử dụng theme an toàn kiểu
├── hooks/
│   ├── __tests__/
│   │   └── useDebounce.test.ts       Unit test cho custom hook useDebounce
│   └── useDebounce.ts                Custom hook generic useDebounce<T>
├── types/
│   └── api.ts                        Khai báo generic ApiResult<T> và type guards
├── App.tsx                           Khung ứng dụng, thanh điều hướng và routing
├── index.css                         Hệ thống design token Đen & Be và CSS layout
├── main.tsx                          Entry point tích hợp Redux, Theme, Router
└── setupTests.ts                     Cấu hình Jest-DOM matchers
```

---

## 3. Bảng Đối Chiếu Kết Quả Thực Hiện Yêu Cầu Đề Bài

### 3.1. Yêu cầu chức năng
| STT | Nội dung yêu cầu | File thực hiện | Kết quả |
|:---:|:---|:---|:---:|
| 1 | Lấy danh sách sách trễ ~500ms; hiển thị "Đang tải..."; báo lỗi kèm nút "Thử lại" | `src/api/booksApi.ts`, `src/features/books/components/MainLibraryView.tsx` | Đạt |
| 2 | Hiển thị thông tin sách: tên, tác giả, thể loại (CNTT / Kinh tế / Ngoại ngữ), năm, số bản | `src/features/books/components/BookItem.tsx` | Đạt |
| 3 | Tìm kiếm theo tên hoặc tác giả (không phân biệt hoa thường), debounce 300ms | `src/features/filters/components/SearchBar.tsx`, `src/hooks/useDebounce.ts` | Đạt |
| 4 | Lọc theo thể loại: Tất cả / CNTT / Kinh tế / Ngoại ngữ | `src/features/filters/components/CategoryFilter.tsx`, `src/features/filters/useFilterStore.ts` | Đạt |
| 5 | Mượn sách: số bản giảm 1; nút "Mượn sách" disabled khi hết sách (`available === 0`) | `src/features/books/booksSlice.ts`, `src/features/books/components/BookItem.tsx` | Đạt |
| 6 | Trả sách: sách đang mượn hiển thị nút "Trả sách", khi trả xong số bản tăng 1 | `src/features/books/booksSlice.ts`, `src/features/books/components/BookItem.tsx` | Đạt |
| 7 | Mỗi sinh viên mượn tối đa 3 cuốn; vượt quá thì chặn và hiển thị thông báo cảnh báo | `src/app/middleware/borrowLimitMiddleware.ts`, `src/App.tsx` | Đạt |
| 8 | Nút chuyển giao diện Sáng / Tối sử dụng CSS Variables và thuộc tính `data-theme` | `src/features/theme/ThemeToggle.tsx`, `src/index.css` | Đạt |
| 9 | Trang Thống kê (`/stats`): thống kê số sách theo thể loại và số sách đang mượn | `src/features/stats/StatsPage.tsx` | Đạt |

### 3.2. Yêu cầu kỹ thuật
| STT | Nội dung yêu cầu kỹ thuật | File thực hiện | Kết quả |
|:---:|:---|:---|:---:|
| 1 | Đầy đủ type, Generic `ApiResult<T>`, Type Guards `isOk`/`isErr`, áp dụng ≥ 2 Utility Types, không `any` | `src/types/api.ts`, `src/features/books/types.ts` (`Record`, `Pick`, `Readonly`, `Partial`) | Đạt |
| 2 | Redux Toolkit: `createSlice`, `createAsyncThunk` đủ 3 trạng thái, typed hooks, cấu trúc feature-based | `src/features/books/booksSlice.ts`, `src/features/books/booksThunks.ts`, `src/app/store.ts` | Đạt |
| 3 | Giới hạn mượn 3 cuốn cài đặt bằng **1 Redux Middleware tự viết** (`MAX_BORROW = 3`) | `src/app/middleware/borrowLimitMiddleware.ts` | Đạt |
| 4 | State bộ lọc dùng **Zustand**; Theme dùng **Context API** (`useMemo`, `useCallback`, `useTheme`) | `src/features/filters/useFilterStore.ts`, `src/features/theme/ThemeContext.tsx` | Đạt |
| 5 | Custom hook generic `useDebounce<T>` | `src/hooks/useDebounce.ts` | Đạt |
| 6 | Tối ưu hiệu năng: `useMemo` tính lọc, `React.memo(BookItem)`, `useCallback` handlers, `key={book.id}`, `React.lazy` | `BookList.tsx`, `BookItem.tsx`, `App.tsx`, `StatsPage.tsx` | Đạt |
| 7 | Bộ test tự động xanh 100%: test Slice, test RTL BookItem với userEvent, test useDebounce fake timers | `src/**/__tests__/*.test.{ts,tsx}` | Đạt |
| 8 | API giả lập trễ 500ms, nhận cờ `shouldFail`, trả về bản sao dữ liệu (deep clone) | `src/api/booksApi.ts` | Đạt |

---

## 4. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 4.1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 4.2. Khởi chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### 4.3. Chạy toàn bộ kiểm thử tự động (Test Suite)
```bash
npm test
```
- Kết quả: **9 Test Suites passed**, **41 Tests passed**, 0 failed.

### 4.4. Kiểm tra kiểu dữ liệu TypeScript (Strict Type Check)
```bash
npx tsc --noEmit
```
- Kết quả: Mã nguồn sạch 100%, không phát sinh bất kỳ lỗi hoặc cảnh báo kiểu nào.

### 4.5. Đóng gói ứng dụng cho Production
```bash
npm run build
```
- Kết quả: Bundle được tối ưu hóa, trang Thống Kê được bóc tách riêng thành chunk phục vụ Lazy Loading.

### 4.6. Kiểm tra kịch bản giả lập lỗi mạng
Thêm tham số `fail=1` trên thanh địa chỉ trình duyệt:
```
http://localhost:3000/?fail=1
```
Ứng dụng sẽ hiển thị hộp cảnh báo tải thất bại cùng nút **"Thử lại"** để nạp lại dữ liệu thành công.

---

## 5. Kết Luận

Dự án đã hoàn thành đầy đủ 100% các yêu cầu chức năng và kỹ thuật của đề bài bài tập giữa kỳ môn Lập trình Web Nâng Cao, đảm bảo tính thẩm mỹ, độ ổn định cao, mã nguồn trong sạch, chuẩn mực và đã được kiểm thử toàn diện.

# 📚 Mini Library — Hệ Thống Tra Cứu và Quản Lý Mượn Trả Sách

> **Bài tập giữa kỳ môn:** Lập trình Web Nâng Cao  
> **Sinh viên thực hiện:** `B23DCCC073`  
> **Tên repository:** `B23DCCC073_LTWNC_GiuaKy`  
> **Công nghệ chủ đạo:** React 18, TypeScript (Strict Mode), Redux Toolkit, Zustand, React Router DOM, Jest & React Testing Library.

---

## 🎯 Giới Thiệu Dự Án
Ứng dụng **Mini Library** giải quyết bài toán quản lý mượn/trả sách chuyên ngành tại thư viện khoa, thay thế phương pháp ghi chép thủ công. Ứng dụng cung cấp giao diện trực quan, hiện đại, hỗ trợ tra cứu tốc độ cao, quản lý mượn trả theo thời gian thực với các giới hạn nghiệp vụ chặt chẽ và trang thống kê trực quan.

---

## 🛠️ Công Nghệ & Kiến Trúc Dự Án

### 1. Công nghệ sử dụng
- **Core:** React 18, TypeScript (Strict Mode, 100% không `any`, không `@ts-ignore`).
- **Build Tool:** Vite 6 (Fast HMR, tối ưu bundle).
- **Server State Management:** `@reduxjs/toolkit` + `react-redux` (Store, Slice, Async Thunk, Custom Middleware).
- **UI State Management:** `zustand` (Quản lý trạng thái bộ lọc tìm kiếm & thể loại siêu nhẹ).
- **Theme Management:** React Context (`useMemo`, `useCallback`, `data-theme` CSS Variables).
- **Routing & Optimization:** `react-router-dom` v6, `React.lazy` + `Suspense` (Code-Splitting).
- **Custom Hooks:** Generic `useDebounce<T>`, `useTheme`.
- **Testing:** `jest`, `ts-jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.

### 2. Cấu trúc thư mục Feature-Based
```
src/
├── api/
│   ├── __tests__/
│   │   └── booksApi.test.ts          # Unit test API giả lập & Type Guards
│   └── booksApi.ts                   # Giả lập API trễ 500ms, hỗ trợ mô phỏng lỗi
├── app/
│   ├── middleware/
│   │   ├── __tests__/
│   │   │   └── borrowLimitMiddleware.test.ts # Test kiểm soát giới hạn 3 cuốn
│   │   └── borrowLimitMiddleware.ts  # Middleware Redux chặn mượn > 3 cuốn
│   ├── hooks.ts                      # useAppDispatch & useAppSelector typed
│   └── store.ts                      # Cấu hình Redux Store, xử lý Circular Types
├── data/
│   └── mockBooks.ts                  # Dữ liệu 15 cuốn sách, đủ 3 thể loại, có cuốn available=0
├── features/
│   ├── books/
│   │   ├── __tests__/
│   │   │   └── booksSlice.test.ts    # 9 test cases cho Reducers & ExtraReducers
│   │   ├── components/
│   │   │   ├── __tests__/
│   │   │   │   └── BookItem.test.tsx # 4 test cases RTL + userEvent cho BookItem
│   │   │   ├── BookItem.tsx          # Component thẻ sách bọc React.memo
│   │   │   ├── BookList.tsx          # Danh sách sách lọc bằng useMemo, key={book.id}
│   │   │   ├── BorrowedList.tsx      # Khu vực sách đang mượn (x/3)
│   │   │   └── MainLibraryView.tsx   # Giao diện chính của trang chủ
│   │   ├── booksSlice.ts             # Redux Slice với reducers phòng thủ
│   │   ├── booksThunks.ts            # createAsyncThunk fetchBooks với type guard
│   │   ├── selectors.ts              # Memoized selectors với createSelector
│   │   └── types.ts                  # Kiểu Book, Category & 4 Utility Types
│   ├── filters/
│   │   ├── __tests__/
│   │   │   └── useFilterStore.test.ts# Test Zustand Store
│   │   ├── components/
│   │   │   ├── CategoryFilter.tsx    # Nút bấm lọc theo danh mục
│   │   │   └── SearchBar.tsx         # Thanh tìm kiếm debounce 300ms
│   │   └── useFilterStore.ts         # Zustand store cho keyword & category
│   ├── stats/
│   │   ├── __tests__/
│   │   │   └── StatsPage.test.tsx    # Test trang Thống Kê & Record<Category, number>
│   │   └── StatsPage.tsx             # Trang Thống kê Lazy Load
│   └── theme/
│       ├── __tests__/
│       │   └── theme.test.tsx        # Test Theme Context & ThemeToggle
│       ├── ThemeContext.tsx          # ThemeProvider với useMemo & useCallback
│       ├── ThemeToggle.tsx           # Nút bấm chuyển Dark/Light Mode
│       └── useTheme.ts               # Custom hook ném lỗi an toàn kiểu
├── hooks/
│   ├── __tests__/
│   │   └── useDebounce.test.ts       # Test generic useDebounce dùng fake timers
│   └── useDebounce.ts                # Custom hook generic useDebounce<T>
├── types/
│   └── api.ts                        # ApiResult<T>, type guards isOk, isErr
├── App.tsx                           # Layout, Routing với React.lazy + Suspense
├── index.css                         # Hệ thống CSS Variables cho 2 themes
├── main.tsx                          # Điểm khởi chạy: Redux Provider, ThemeProvider, BrowserRouter
└── setupTests.ts                     # Cấu hình Jest-DOM matchers
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Khởi chạy Server Phát Triển (Dev Server)
```bash
npm run dev
```
Trình duyệt sẽ tự động mở tại: `http://localhost:3000`

### 3. Kiểm thử tự động (Unit & Integration Tests)
```bash
npm test
```
*Kết quả:* Toàn bộ **9 Test Suites, 41 Tests** chạy thành công (100% Xanh).

### 4. Kiểm tra TypeScript Strict Mode
```bash
npx tsc --noEmit
```
*Kết quả:* Exit code 0, không có bất kỳ lỗi cú pháp hoặc cảnh báo nào.

### 5. Đóng gói sản phẩm (Production Build)
```bash
npm run build
```
*Kết quả:* Code-Splitting phân tách chunk `StatsPage-*.js` độc lập thành công.

---

## 🔍 Cách Giả Lập Kịch Bản Lỗi API
Để kiểm tra trạng thái thông báo lỗi mạng và nút "Thử lại":
1. Mở trình duyệt với tham số: `http://localhost:3000/?fail=1`
2. Ứng dụng sẽ hiển thị hộp thông báo lỗi màu đỏ: *"Không thể kết nối đến máy chủ thư viện (HTTP 500)..."*
3. Click vào nút **"🔄 Thử lại"** để kích hoạt lại API và nạp dữ liệu bình thường.

---

## 📊 Bảng Đối Chiếu Toàn Diện Yêu Cầu Đề Bài

### Yêu Cầu Chức Năng (1 – 9)
| STT | Yêu cầu chức năng | Vị trí File cài đặt | Trạng thái |
|:---:|:---|:---|:---:|
| **1** | Lấy danh sách sách trễ ~500ms; hiển thị "Đang tải..."; báo lỗi kèm nút "Thử lại" | `src/api/booksApi.ts`, `src/features/books/components/MainLibraryView.tsx` | ✅ Đạt |
| **2** | Hiển thị: tên sách, tác giả, thể loại (CNTT / Kinh tế / Ngoại ngữ), năm, số bản | `src/features/books/components/BookItem.tsx` | ✅ Đạt |
| **3** | Tìm kiếm theo tên hoặc tác giả (không phân biệt hoa/thường), debounce 300ms | `src/features/filters/components/SearchBar.tsx`, `src/hooks/useDebounce.ts` | ✅ Đạt |
| **4** | Lọc theo thể loại: Tất cả / CNTT / Kinh tế / Ngoại ngữ | `src/features/filters/components/CategoryFilter.tsx`, `src/features/filters/useFilterStore.ts` | ✅ Đạt |
| **5** | Mượn sách: số bản giảm 1; nút "Mượn" disabled khi hết bản (`available === 0`) | `src/features/books/booksSlice.ts:L31-L47`, `BookItem.tsx:L106-L124` | ✅ Đạt |
| **6** | Trả sách: sách đang mượn hiện nút "Trả", trả xong số bản tăng 1 | `src/features/books/booksSlice.ts:L50-L64`, `BookItem.tsx:L83-L104` | ✅ Đạt |
| **7** | Mỗi sinh viên mượn tối đa 3 cuốn; vượt quá thì chặn và hiện cảnh báo | `src/app/middleware/borrowLimitMiddleware.ts:L20-L40`, `App.tsx:L129-L162` | ✅ Đạt |
| **8** | Nút chuyển giao diện sáng / tối bằng CSS Variables & `data-theme` | `src/features/theme/ThemeToggle.tsx`, `src/index.css:L6-L56` | ✅ Đạt |
| **9** | Trang Thống kê (route `/stats`): số sách theo từng thể loại & số sách đang mượn | `src/features/stats/StatsPage.tsx` | ✅ Đạt |

### Yêu Cầu Kỹ Thuật (1 – 8)
| STT | Yêu cầu kỹ thuật | Vị trí File cài đặt | Trạng thái |
|:---:|:---|:---|:---:|
| **1** | Đầy đủ type; Generic `ApiResult<T>`, type guards `isOk`/`isErr`; ≥ 2 Utility Types; không `any` | `src/types/api.ts`, `src/features/books/types.ts` (`Record`, `Pick`, `Readonly`, `Partial`) | ✅ Đạt |
| **2** | Redux Toolkit: `createSlice`, `createAsyncThunk` đủ 3 trạng thái, typed hooks, feature-based | `src/features/books/booksSlice.ts`, `booksThunks.ts`, `src/app/store.ts`, `hooks.ts` | ✅ Đạt |
| **3** | Giới hạn mượn 3 cuốn cài bằng **1 middleware Redux tự viết** (`MAX_BORROW = 3`) | `src/app/middleware/borrowLimitMiddleware.ts` | ✅ Đạt |
| **4** | State bộ lọc dùng **Zustand**; theme dùng **Context** (`useMemo`, `useCallback`, `useTheme`) | `src/features/filters/useFilterStore.ts`, `src/features/theme/ThemeContext.tsx` | ✅ Đạt |
| **5** | Custom hook generic `useDebounce<T>` | `src/hooks/useDebounce.ts` | ✅ Đạt |
| **6** | Tối ưu hiệu năng: `useMemo` lọc, `React.memo(BookItem)`, `useCallback` handlers, `key={book.id}`, `React.lazy` | `BookList.tsx`, `BookItem.tsx`, `App.tsx` | ✅ Đạt |
| **7** | Test xanh (`npm test`): ≥ 4 test slice (9 tests), ≥ 3 test BookItem RTL (4 tests), test useDebounce fake timers (5 tests) | `src/features/books/__tests__`, `BookItem.test.tsx`, `useDebounce.test.ts` | ✅ Đạt |
| **8** | API giả lập trễ 500ms, nhận cờ `shouldFail`, trả về bản sao clone không mutate gốc | `src/api/booksApi.ts` | ✅ Đạt |

---

## 🎓 Ánh Xạ Kiến Thức Môn Học (Buổi 1 – 6) Vào Dự Án

1. **Buổi 1 — TypeScript Nâng Cao (Generics, Discriminated Unions, Utility Types)**:
   - `ApiResult<T> = ApiSuccess<T> | ApiError` và Type Predicates (`result is ApiSuccess<T>`).
   - Sử dụng các Utility Types: `Record<Category, number>` cho thống kê, `Pick<Book, ...>` cho props, `Readonly<Book>` cho immutability.
2. **Buổi 2 — React Cơ Bản & Hook Nâng Cao (`useMemo`, `useCallback`, `React.memo`)**:
   - `BookItem` bọc `React.memo` chống re-render thừa.
   - `useMemo` tính toán danh sách lọc và bảng thống kê.
   - `useCallback` giữ nguyên tham chiếu cho các hàm `handleBorrow`, `handleReturn`.
3. **Buổi 3 — Quản Lý State (Redux Toolkit vs Zustand)**:
   - Áp dụng mô hình Hybrid State: Domain state (sách, lịch sử mượn) dùng **Redux Toolkit**; UI state (từ khoá, danh mục chọn) dùng **Zustand**.
4. **Buổi 4 — Redux Middleware & Luồng Bất Đồng Bộ**:
   - Tự viết `borrowLimitMiddleware` chặn action trước khi đến Reducer và dispatch `setWarning`.
   - Sử dụng `createAsyncThunk` xử lý đầy đủ chu kỳ `pending` -> `fulfilled` / `rejected`.
5. **Buổi 5 — React Context API & Custom Hooks**:
   - Xây dựng `ThemeContext` kèm custom hook `useTheme` ném lỗi an toàn kiểu dữ liệu.
   - Viết generic hook `useDebounce<T>` với cleanup function dọn dẹp `clearTimeout`.
6. **Buổi 6 — Tối Ưu Hiệu Năng & Routing (Code-Splitting, Testing)**:
   - Tách bundle trang thống kê bằng `React.lazy` và `<Suspense>`.
   - Kiểm thử toàn diện bằng Jest, ts-jest, jsdom và React Testing Library + `@testing-library/user-event`.

---

## ❓ Bộ 10 Câu Hỏi Vấn Đáp Thường Gặp & Gợi Ý Trả Lời

### 1. Vì sao lại dùng Middleware để giới hạn mượn 3 cuốn thay vì viết trong Reducer?
> **Trả lời:** Theo chuẩn kiến trúc Redux, Reducer bắt buộc phải là một **Pure Function** (hàm thuần khiết: nhận `(state, action)` và trả về `newState`). Reducer không được phép tạo side-effect và **không thể dispatch một action khác** (như `setWarning`). Middleware đóng vai trò là một **Guard/Interceptor** chặn đứng action mượn sách trước khi chạm vào state tree và dispatch cảnh báo.

### 2. Vì sao dự án kết hợp cả Redux Toolkit và Zustand mà không dùng một loại?
> **Trả lời:** Đây là mô hình phân loại state (State Classification):
> - **Redux Toolkit** quản lý **Domain/Server State** (`books`, `borrowedIds`): Dữ liệu cốt lõi, có vòng đời bất đồng bộ phức tạp (loading, error) và cần middleware can thiệp nghiệp vụ.
> - **Zustand** quản lý **Client/UI State** (`keyword`, `category`): Dữ liệu cục bộ giao diện, thay đổi liên tục theo từng phím gõ. Zustand nhẹ hơn, không cần bọc Provider và không có boilerplate cồng kềnh.

### 3. `React.memo` có tác dụng gì ở `BookItem`? Khi nào nó mất tác dụng?
> **Trả lời:** `React.memo` là Higher-Order Component ghi nhớ kết quả render, chỉ re-render component khi props nông (shallow comparison) thay đổi. Khi sinh viên mượn 1 cuốn, chỉ cuốn đó re-render, 14 cuốn còn lại giữ nguyên. `React.memo` sẽ **mất tác dụng** nếu component cha truyền xuống các hàm callback inline không được bọc bằng `useCallback`, vì mỗi lần cha render sẽ sinh ra tham chiếu hàm mới khiến `React.memo` tưởng props bị thay đổi.

### 4. `useDebounce` hoạt động như thế nào và vì sao cần cleanup function?
> **Trả lời:** `useDebounce` sử dụng `useEffect` kèm `setTimeout`. Khi người dùng gõ phím liên tục, component re-render trước khi hết 300ms. **Cleanup function** (`return () => clearTimeout(timer)`) sẽ được React gọi trước khi chạy effect mới để huỷ timer đang chờ. Nhờ vậy chỉ khi người dùng ngừng gõ đủ 300ms, giá trị mới được cập nhật, tiết kiệm hàng chục lần re-render và tính toán lọc danh sách.

### 5. Type Guard (`isOk`, `isErr`) hoạt động như thế nào trong TypeScript?
> **Trả lời:** Hàm sử dụng cú pháp Type Predicate: `function isOk<T>(result: ApiResult<T>): result is ApiSuccess<T>`. Khi đặt hàm này trong câu lệnh `if (isOk(result))`, TypeScript compiler hiểu rằng bên trong khối `if` đó, biến `result` chắc chắn thuộc kiểu `ApiSuccess<T>`, cho phép truy cập an toàn vào `result.data` mà không cần ép kiểu (`as`) và loại bỏ hoàn toàn `any`.

### 6. Vì sao không được dùng `key={index}` khi render danh sách `BookList`?
> **Trả lời:** Thuật toán so sánh Virtual DOM của React (Reconciliation) dựa vào `key` để nhận diện các phần tử được thêm, sửa, xoá hay di chuyển. Nếu dùng `index`, khi lọc hoặc xoá sách, chỉ số index của các phần tử phía sau sẽ bị thay đổi, khiến React đối chiếu sai DOM node, gây re-render toàn bộ danh sách và có thể làm sai lệch trạng thái cục bộ. Dùng `key={book.id}` đảm bảo mỗi phần tử gắn liền với một danh tính duy nhất.

### 7. Kỹ thuật Lazy Loading với `React.lazy` và `Suspense` giúp ích gì cho hiệu năng?
> **Trả lời:** `React.lazy` thực hiện Dynamic Import (`import('./StatsPage')`). Bundler (Vite) sẽ bóc tách mã nguồn của `StatsPage` thành một chunk file riêng (`StatsPage-*.js`). Khi người dùng mở trang chủ, trình duyệt không phải tải code của trang Thống Kê, giảm dung lượng Initial Bundle Size và tăng tốc độ tải trang ban đầu. `<Suspense>` hiển thị UI tạm thời (fallback spinner) trong khi tải chunk qua mạng.

### 8. Lỗi Circular Type Dependency giữa Store và Middleware xảy ra như thế nào và cách giải quyết?
> **Trả lời:** Khi `borrowLimitMiddleware` cần `RootState` từ `store.ts` để type-check `getState()`, còn `store.ts` lại import `borrowLimitMiddleware` để truyền vào `configureStore`, TypeScript sẽ bị lặp vô tận khi suy luận kiểu. Giải pháp là khai báo `const rootReducer = combineReducers({ books: booksReducer })` và xuất kiểu `export type RootState = ReturnType<typeof rootReducer>` **trước** khi tạo `store`.

### 9. Khác biệt giữa `userEvent` và `fireEvent` trong React Testing Library?
> **Trả lời:** `fireEvent` chỉ kích hoạt trực tiếp một DOM Event giả lập (dispatch event). Trong khi đó, `userEvent` mô phỏng đầy đủ chuỗi hành vi thực tế của người dùng: di chuột qua phần tử (hover), focus, nhấn chuột xuống (mousedown), nhấc chuột lên (mouseup) rồi mới click, đảm bảo các hiệu ứng CSS, kiểm tra disabled button và bubbling hoạt động chuẩn xác như trên trình duyệt thật.

### 10. `useTheme` xử lý kiểu dữ liệu an toàn như thế nào mà không cần ép kiểu `as`?
> **Trả lời:** `ThemeContext` được khởi tạo với kiểu `ThemeContextValue | undefined`. Trong hook `useTheme`, ta kiểm tra `if (context === undefined) throw new Error(...)`. Đoạn kiểm tra này vừa bảo vệ runtime (phát hiện ngay nếu dev dùng hook ngoài Provider) vừa giúp TypeScript tự động thu hẹp kiểu về `ThemeContextValue` một cách tự nhiên và an toàn 100%.

---

## 📤 Hướng Dẫn Commit & Nộp Bài Lên GitHub

Đảm bảo thư mục hiện tại đã được liên kết với repository GitHub của bạn:
```bash
# 1. Kiểm tra trạng thái git
git status

# 2. Thêm toàn bộ các file đã hoàn thiện
git add .

# 3. Tạo commit tổng kết hoàn thành dự án theo chuẩn Conventional Commits
git commit -m "chore: complete mini library project with full documentation and tests"

# 4. Đẩy mã nguồn lên nhánh chính của GitHub
git push origin main
```

---
*Chúc bạn có buổi vấn đáp và bảo vệ bài giữa kỳ đạt điểm số cao nhất!* 🚀

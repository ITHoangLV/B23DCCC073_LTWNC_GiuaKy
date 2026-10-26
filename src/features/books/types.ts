export type Category = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  available: number;
  coverImage?: string;
}

export type CategoryStats = Record<Category, number>;

export type ImmutableBook = Readonly<Book>;

export type BookCardProps = Pick<Book, 'id' | 'title' | 'author' | 'category' | 'year' | 'available' | 'coverImage'>;

export type BookFilterCriteria = Partial<Pick<Book, 'title' | 'author' | 'category'>>;

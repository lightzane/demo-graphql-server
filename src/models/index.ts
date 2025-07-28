export type BookModel = {
  id: string;
  title: string;
  description?: string | null;
  rating?: number | null;
  author?: string | null;
  year?: number | null;
};

export type BookShelfModel = {
  id: string;
  category: string;
  books: BookModel[];
  labels: BookShelfLabelModel[];
};

export type BookShelfLabelModel = {
  id: number;
  name: string;
};

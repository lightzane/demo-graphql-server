export type BookModel = {
  id: string;
  title: string;
  description?: string | null;
  rating?: number | null;
  author?: string | null;
  year?: number | null;
};

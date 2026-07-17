export type Bookmark = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

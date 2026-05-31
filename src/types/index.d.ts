export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  tags: string[];
  collectionId: string;
  createdAt: Date;
  isFavorite: boolean;
}

export interface Collection {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string;
}

export interface FilterState {
  collectionId: string | null;
  tag: string | null;
  search: string;
  showFavorites: boolean;
  showRecent: boolean;
}

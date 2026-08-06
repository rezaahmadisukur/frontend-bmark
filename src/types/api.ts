export type Authentication = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export interface Profile {
  id: string;
  email: string;
  name: string;
}

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  collectionId: string;
  tags?: { tag: { id: string; name: string; color?: string } }[];
  createdAt: Date;
  isFavorite: boolean;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string; // Lucide icon name
  parentId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export interface FilterState {
  collectionId: string | null;
  tag: string | null;
  search: string;
  showFavorites: boolean;
  showRecent: boolean;
}

export type ViewMode = "grid" | "list";
export type SortMode = "newest" | "oldest" | "az";

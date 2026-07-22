export type Login = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  color: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

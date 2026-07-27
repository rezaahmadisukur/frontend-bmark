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
  tags: string[];
  collectionId: string;
  createdAt: Date;
  isFavorite: boolean;
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

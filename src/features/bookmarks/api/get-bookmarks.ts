import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";

type GetBookmarksResponse = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  favicon: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}[];

export enum BookmarkSortBy {
  RECOMMENDED = "recommended"
}

type GetBookmarksInput = {
  sort?: BookmarkSortBy;
  limit?: number;
};

// For Query Fn
export const getBookmarks = async (input?: GetBookmarksInput) => {
  const res = await axiosInstance.get<GetBookmarksResponse>("/bookmarks", {
    params: input
  });
  return res.data;
};

// For Query Key
export const getBookmarksQueryKey = () => ["bookmarks"];

// Query Options
export const getBookmarksQueryOptions = (input?: GetBookmarksInput) => {
  return queryOptions({
    queryKey: getBookmarksQueryKey(),
    queryFn: () => getBookmarks(input)
  });
};

// Type Bookmarks
type UseGetBookmarks = {
  queryConfig?: QueryConfig<typeof getBookmarks>;
  input?: GetBookmarksInput;
};

//
export const useGetBookmarks = ({
  queryConfig,
  input
}: UseGetBookmarks = {}) => {
  return useQuery({
    ...getBookmarksQueryOptions(input),
    ...queryConfig
  });
};

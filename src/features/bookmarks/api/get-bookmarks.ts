import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Bookmark } from "~/types/api";

type GetBookmarksResponse = Bookmark[];

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

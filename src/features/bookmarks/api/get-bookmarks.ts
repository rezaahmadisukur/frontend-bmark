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
  search?: string;
};

// For Query Fn
export const getBookmarks = async (input?: GetBookmarksInput) => {
  const res = await axiosInstance.get<GetBookmarksResponse>("/bookmarks", {
    params: input
  });
  return res.data;
};

// For Query Key
// Tanpa argumen → ["bookmarks"] (prefix untuk invalidate semua search).
// Dengan search → ["bookmarks", { search }] supaya cache-nya unik per kata kunci.
export const getBookmarksQueryKey = (search?: string) =>
  search ? ["bookmarks", { search }] : ["bookmarks"];

// Query Options
export const getBookmarksQueryOptions = (input?: GetBookmarksInput) => {
  return queryOptions({
    queryKey: getBookmarksQueryKey(input?.search),
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

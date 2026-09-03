import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Bookmark } from "~/types/api";

export enum BookmarkSortBy {
  RECOMMENDED = "recommended"
}

type GetBookmarksInput = {
  sort?: "newest" | "oldest" | "az";
  limit?: number;
  search?: string;
  page?: number;
  tag?: string;
  collectionId?: string;
  favorites?: boolean;
  recent?: boolean;
};

type PaginatedResponse = {
  data: Bookmark[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type GetBookmarksResponse = Bookmark[] | PaginatedResponse;

// For Query Fn
export const getBookmarks = async (input?: GetBookmarksInput) => {
  const res = await axiosInstance.get<GetBookmarksResponse>("/bookmarks", {
    params: input
  });
  return res.data;
};

// For Query Key
// - Tanpa pagination → ["bookmarks"] (prefix yang dipakai mutation utk invalidate semua varian)
// - Dengan pagination → ["bookmarks", { search, page, limit, sort }] (cache unik per varian)
export const getBookmarksQueryKey = (input?: GetBookmarksInput) => {
  if (input?.page !== undefined || input?.limit !== undefined) {
    return [
      "bookmarks",
      {
        search: input.search ?? "",
        page: input.page ?? 1,
        limit: input.limit ?? 12,
        sort: input.sort ?? "newest",
        tag: input.tag ?? "",
        collectionId: input.collectionId ?? "",
        favorites: input.favorites ?? false,
        recent: input.recent ?? false
      }
    ];
  }
  return ["bookmarks"];
};

// Query Options
export const getBookmarksQueryOptions = (input?: GetBookmarksInput) => {
  return queryOptions({
    queryKey: getBookmarksQueryKey(input),
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

import { useQuery, queryOptions } from "@tanstack/react-query";
import { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";

type GetBookmarkByIdResponse = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  favicon: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

type GetBookmarkByIdInput = {
  id: string;
};

export const getBookmarkById = async (input: GetBookmarkByIdInput) => {
  const res = await axiosInstance.get<GetBookmarkByIdResponse>(
    `/bookmarks/${input.id}`
  );

  return res.data;
};

export const getBookmarkByIdQueryKey = (id: string) => ["bookmark", id];

export const getBookmarkByIdQueryOptions = (input: GetBookmarkByIdInput) => {
  return queryOptions({
    queryKey: getBookmarkByIdQueryKey(input.id),
    queryFn: () => getBookmarkById(input)
  });
};

type UseGetBookmarkById = {
  queryConfig?: QueryConfig<typeof getBookmarkById>;
  input: GetBookmarkByIdInput;
};

export const useGetBookmarkById = ({
  queryConfig,
  input
}: UseGetBookmarkById) => {
  return useQuery({
    ...getBookmarkByIdQueryOptions(input),
    ...queryConfig
  });
};

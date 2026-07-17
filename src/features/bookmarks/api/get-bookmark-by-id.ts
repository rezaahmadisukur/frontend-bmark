import { useQuery, queryOptions } from "@tanstack/react-query";
import { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Bookmark } from "~/types/api";

type GetBookmarkByIdResponse = Bookmark;

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

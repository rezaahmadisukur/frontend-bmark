import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";

export type Tag = {
  id: string;
  name: string;
  color?: string;
};

type GetTagsResponse = Tag[];

export const getTags = async () => {
  const res = await axiosInstance.get<GetTagsResponse>("/tags");
  return res.data;
};

export const getTagsQueryKey = () => ["tags"];

export const getTagsQueryOptions = () => {
  return queryOptions({
    queryKey: getTagsQueryKey(),
    queryFn: () => getTags()
  });
};

type UseGetTags = {
  queryConfig?: QueryConfig<typeof getTags>;
};

export const useGetTags = ({ queryConfig }: UseGetTags = {}) => {
  return useQuery({
    ...getTagsQueryOptions(),
    ...queryConfig
  });
};

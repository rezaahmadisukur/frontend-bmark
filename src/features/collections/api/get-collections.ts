import { useQuery, queryOptions } from "@tanstack/react-query";
import { QueryConfig } from "~/lib/react-query";
import { axiosInstance } from "~/lib/axios";
import { Collection } from "~/types/api";

type GetCollectionResponse = Collection[];

export const getCollections = async () => {
  const res = await axiosInstance.get<GetCollectionResponse>("/collections");

  return res.data;
};

export const getCollectionsQueryKey = () => ["collections"];

export const getCollectionsQueryOptions = () => {
  return queryOptions({
    queryKey: getCollectionsQueryKey(),
    queryFn: () => getCollections()
  });
};

type UseGetCollections = {
  queryConfig?: QueryConfig<typeof getCollections>;
};

export const useGetCollections = ({ queryConfig }: UseGetCollections = {}) => {
  return useQuery({
    ...getCollectionsQueryOptions(),
    ...queryConfig
  });
};
